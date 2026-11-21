#!/usr/bin/env python3
"""ElevenLabs로 장소 음성을 mp3로 미리 만든다.

만드는 파일 (app/audio/)
  {id}.note.{en|ja|zh}.mp3  "From your local friend" 설명
  {id}.say.ko.mp3           "Say this" 한국어 문장
  manifest.json             "files": 앱이 재생하는 파일 목록. 목록에 없는 음성은 브라우저 기본 음성으로 읽는다.
                            "sources": 파일마다 어떤 문장(해시)·목소리·모델로 만들었는지 기록.

바뀐 것만 다시 만든다
  파일이 없거나, 문장·목소리·모델이 기록과 다르면 다시 만든다. 그대로인 파일은 크레딧을 쓰지 않는다.
  문장을 고쳤는데 아직 다시 만들지 않은 파일은 "files"에서 빠진다. 앱은 예전 소리 대신
  브라우저 기본 음성으로 지금 문장을 읽는다.

사용법
  export ELEVENLABS_API_KEY=...      # 키는 파일에 쓰지 말고 터미널이나 .env(커밋 안 됨)에만 넣는다
  export ELEVENLABS_VOICE_ID=...     # 설명용 목소리 (ElevenLabs 앱의 Voices에서 ID 복사)
  export ELEVENLABS_KO_VOICE_ID=...  # 선택. 한국어 문장용 목소리. 없으면 설명용 목소리를 쓴다
  python3 -I tools/make_audio.py --dry-run   # 만들 파일과 이유, 글자 수만 확인
  python3 -I tools/make_audio.py             # 바뀐 것만 생성
  python3 -I tools/make_audio.py --force --only 장소id   # 한 장소만 처음부터 다시
  python3 -I tools/make_audio.py --manifest-only --prune # 지운 장소의 mp3 정리

샘플 장소("sample": true)는 크레딧 낭비를 막으려고 기본으로 건너뛴다.
"""
import argparse
import hashlib
import json
import os
import pathlib
import sys
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "app" / "data" / "places.json"
OUT = ROOT / "app" / "audio"
API = "https://api.elevenlabs.io/v1/text-to-speech/{voice}"

REASONS = {
    "force": "다시 만들기(--force)",
    "new": "새 파일",
    "unknown": "기록 없음",
    "text": "문장 바뀜",
    "voice": "목소리 바뀜",
    "model": "모델 바뀜",
}


def text_hash(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]


def build_jobs(data, langs=None, only=None, include_samples=True):
    """langs=None이면 데이터에 있는 모든 설명 언어."""
    for p in data["places"]:
        if only and p["id"] != only:
            continue
        if p.get("sample") and not include_samples:
            continue
        for lang, text in (p.get("note") or {}).items():
            if langs is not None and lang not in langs:
                continue
            if text:
                yield {"file": f"{p['id']}.note.{lang}.mp3", "text": text, "kind": "note"}
        say = (p.get("say") or {}).get("ko")
        if say:
            yield {"file": f"{p['id']}.say.ko.mp3", "text": say, "kind": "say"}


def tts(key, voice, model, text):
    body = json.dumps({"text": text, "model_id": model}).encode("utf-8")
    req = urllib.request.Request(
        API.format(voice=voice),
        data=body,
        method="POST",
        headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
    )
    with urllib.request.urlopen(req, timeout=90) as res:
        return res.read()


def load_sources(out):
    try:
        return dict(json.loads((out / "manifest.json").read_text(encoding="utf-8")).get("sources") or {})
    except (OSError, ValueError):
        return {}


def check(data, out, sources):
    """현재 데이터 기준으로 재생할 파일, 문장이 바뀐 파일, 어디에도 안 쓰이는 파일을 나눈다."""
    expected = {j["file"]: text_hash(j["text"]) for j in build_jobs(data)}
    present = {f.name for f in out.glob("*.mp3")}
    current = sorted(f for f in present if f in expected and (sources.get(f) or {}).get("text") == expected[f])
    stale = sorted(f for f in present if f in expected and f not in current)
    orphans = sorted(present - expected.keys())
    return current, stale, orphans


def write_manifest(data, out, sources, prune=False):
    current, stale, orphans = check(data, out, sources)
    if prune:
        for f in orphans:
            (out / f).unlink()
            sources.pop(f, None)
        if orphans:
            print(f"어디에도 안 쓰이는 파일 {len(orphans)}개를 지웠습니다: {', '.join(orphans)}")
        orphans = []
    present = {f.name for f in out.glob("*.mp3")}
    keep = {f: sources[f] for f in sorted(sources) if f in present}
    manifest = {"files": current, "sources": keep}
    (out / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"manifest.json: 재생 목록 {len(current)}개, 기록 {len(keep)}개")
    if stale:
        print(f"주의: 문장이 바뀌었는데 다시 만들지 않은 파일 {len(stale)}개는 재생 목록에서 뺐습니다"
              " (앱이 브라우저 음성으로 지금 문장을 읽음):")
        for f in stale:
            print(f"  {f}")
        print("  샘플이면 --include-samples를 붙여 다시 실행하세요.")
    if orphans:
        print(f"참고: 지금 장소 데이터에 없는 파일 {len(orphans)}개 (재생 안 됨, --prune으로 지움): {', '.join(orphans)}")
    return current, stale


def main():
    ap = argparse.ArgumentParser(description="ElevenLabs 음성 mp3 생성 (바뀐 문장만)")
    ap.add_argument("--voice", default=os.environ.get("ELEVENLABS_VOICE_ID"), help="설명용 voice ID")
    ap.add_argument("--ko-voice", default=os.environ.get("ELEVENLABS_KO_VOICE_ID"), help="한국어 문장용 voice ID")
    ap.add_argument("--model", default="eleven_multilingual_v2")
    ap.add_argument("--langs", default="en,ja,zh", help="설명을 만들 언어 (쉼표로 구분)")
    ap.add_argument("--only", help="이 id의 장소만 만든다")
    ap.add_argument("--include-samples", action="store_true", help="샘플 장소도 만든다")
    ap.add_argument("--force", action="store_true", help="바뀌지 않은 파일도 다시 만든다 (--only와 같이 쓰기를 권장)")
    ap.add_argument("--dry-run", action="store_true", help="API를 부르지 않고 만들 파일, 이유, 글자 수만 본다")
    ap.add_argument("--manifest-only", action="store_true", help="API를 부르지 않고 manifest.json만 다시 쓴다")
    ap.add_argument("--prune", action="store_true", help="지금 장소 데이터에 없는 mp3를 지운다")
    ap.add_argument("--adopt-existing", action="store_true",
                    help="기록이 없는 기존 mp3를 지금 문장·목소리·모델로 만든 것으로 기록만 한다 (API 호출 없음)")
    ap.add_argument("--data", type=pathlib.Path, default=DATA, help="장소 데이터 파일")
    ap.add_argument("--out", type=pathlib.Path, default=OUT, help="mp3와 manifest.json을 둘 폴더")
    a = ap.parse_args()

    out = a.out
    out.mkdir(parents=True, exist_ok=True)
    data = json.loads(a.data.read_text(encoding="utf-8"))
    sources = load_sources(out)

    def voice_for(job):
        return (a.ko_voice or a.voice) if job["kind"] == "say" else a.voice

    if a.manifest_only:
        write_manifest(data, out, sources, a.prune)
        return 0

    if a.adopt_existing:
        adopted = 0
        for j in build_jobs(data):
            if j["file"] in sources or not (out / j["file"]).exists():
                continue
            sources[j["file"]] = {"text": text_hash(j["text"]), "voice": voice_for(j), "model": a.model}
            adopted += 1
        print(f"기존 파일 {adopted}개를 지금 문장·목소리·모델로 기록했습니다.")
        write_manifest(data, out, sources, a.prune)
        return 0

    def reason(job):
        if a.force:
            return "force"
        if not (out / job["file"]).exists():
            return "new"
        s = sources.get(job["file"])
        if not s:
            return "unknown"
        if s.get("text") != text_hash(job["text"]):
            return "text"
        v = voice_for(job)
        if v and s.get("voice") and s["voice"] != v:
            return "voice"
        if s.get("model") and s["model"] != a.model:
            return "model"
        return None

    langs = [x.strip() for x in a.langs.split(",") if x.strip()]
    jobs = list(build_jobs(data, langs, a.only, a.include_samples))
    todo = []
    for j in jobs:
        r = reason(j)
        if r:
            todo.append((j, r))

    chars = sum(len(j["text"]) for j, _ in todo)
    print(f"만들 파일 {len(todo)}개 / 대상 {len(jobs)}개, 글자 수 합계 {chars}자")
    if not jobs:
        print("만들 음성이 없습니다. 샘플만 있다면 내 장소를 넣거나 --include-samples를 쓰세요.")
    if a.dry_run:
        for j, r in todo:
            print(f"  {j['file']}  ({len(j['text'])}자, {REASONS[r]})")
        _, stale, orphans = check(data, out, sources)
        skipped = sorted(set(stale) - {j["file"] for j, _ in todo})
        if skipped:
            print(f"참고: 이번 대상 밖이라 안 만드는데 문장이 바뀐 파일 {len(skipped)}개: {', '.join(skipped)}")
        if orphans:
            print(f"참고: 지금 장소 데이터에 없는 파일 {len(orphans)}개: {', '.join(orphans)}")
        return 0

    if todo:
        key = os.environ.get("ELEVENLABS_API_KEY")
        if not key:
            print("ELEVENLABS_API_KEY가 없습니다. 터미널에서 export 한 뒤 다시 실행하세요.", file=sys.stderr)
            return 1
        if not a.voice:
            print("목소리 ID가 없습니다. ELEVENLABS_VOICE_ID를 넣거나 --voice로 주세요.", file=sys.stderr)
            return 1

    made = 0
    for j, r in todo:
        voice = voice_for(j)
        try:
            audio = tts(key, voice, a.model, j["text"])
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")[:300]
            print(f"실패: {j['file']} (HTTP {e.code}) {detail}", file=sys.stderr)
            print("401이면 키, 404면 voice ID, 429나 quota 문구면 크레딧을 확인하세요.", file=sys.stderr)
            break
        except urllib.error.URLError as e:
            print(f"실패: {j['file']} (네트워크) {e.reason}", file=sys.stderr)
            break
        (out / j["file"]).write_bytes(audio)
        sources[j["file"]] = {"text": text_hash(j["text"]), "voice": voice, "model": a.model}
        made += 1
        print(f"  만듦 {j['file']} ({len(audio) // 1024}KB, {REASONS[r]})")

    print(f"새로 만든 파일 {made}개")
    write_manifest(data, out, sources, a.prune)
    return 0 if made == len(todo) else 1


if __name__ == "__main__":
    sys.exit(main())
