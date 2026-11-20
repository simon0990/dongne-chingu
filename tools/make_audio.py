#!/usr/bin/env python3
"""ElevenLabs로 장소 음성을 mp3로 미리 만든다.

만드는 파일 (app/audio/)
  {id}.note.{en|ja|zh}.mp3  "From your local friend" 설명
  {id}.say.ko.mp3           "Say this" 한국어 문장
  manifest.json             앱이 읽는 파일 목록. 목록에 없는 음성은 브라우저 기본 음성으로 읽는다.

사용법
  export ELEVENLABS_API_KEY=...      # 키는 파일에 쓰지 말고 터미널에서만 넣는다
  export ELEVENLABS_VOICE_ID=...     # 설명용 목소리 (ElevenLabs 앱의 Voices에서 ID 복사)
  export ELEVENLABS_KO_VOICE_ID=...  # 선택. 한국어 문장용 목소리. 없으면 설명용 목소리를 쓴다
  python3 -I tools/make_audio.py --dry-run   # 만들 파일과 글자 수만 확인
  python3 -I tools/make_audio.py             # 실제 생성. 이미 있는 파일은 건너뛴다

샘플 장소("sample": true)는 크레딧 낭비를 막으려고 기본으로 건너뛴다.
"""
import argparse
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


def build_jobs(data, langs, only, include_samples):
    for p in data["places"]:
        if only and p["id"] != only:
            continue
        if p.get("sample") and not include_samples:
            continue
        for lang in langs:
            text = (p.get("note") or {}).get(lang)
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


def write_manifest():
    files = sorted(f.name for f in OUT.glob("*.mp3"))
    (OUT / "manifest.json").write_text(json.dumps({"files": files}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return len(files)


def main():
    ap = argparse.ArgumentParser(description="ElevenLabs 음성 mp3 생성")
    ap.add_argument("--voice", default=os.environ.get("ELEVENLABS_VOICE_ID"), help="설명용 voice ID")
    ap.add_argument("--ko-voice", default=os.environ.get("ELEVENLABS_KO_VOICE_ID"), help="한국어 문장용 voice ID")
    ap.add_argument("--model", default="eleven_multilingual_v2")
    ap.add_argument("--langs", default="en,ja,zh", help="설명을 만들 언어 (쉼표로 구분)")
    ap.add_argument("--only", help="이 id의 장소만 만든다")
    ap.add_argument("--include-samples", action="store_true", help="샘플 장소도 만든다")
    ap.add_argument("--force", action="store_true", help="이미 있는 파일도 다시 만든다")
    ap.add_argument("--dry-run", action="store_true", help="API를 부르지 않고 목록과 글자 수만 본다")
    ap.add_argument("--manifest-only", action="store_true", help="audio 폴더의 mp3로 manifest.json만 다시 쓴다")
    a = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    if a.manifest_only:
        print(f"manifest.json: {write_manifest()}개 파일")
        return 0

    data = json.loads(DATA.read_text(encoding="utf-8"))
    langs = [x.strip() for x in a.langs.split(",") if x.strip()]
    jobs = list(build_jobs(data, langs, a.only, a.include_samples))
    todo = [j for j in jobs if a.force or not (OUT / j["file"]).exists()]

    chars = sum(len(j["text"]) for j in todo)
    print(f"만들 파일 {len(todo)}개 / 전체 {len(jobs)}개, 글자 수 합계 {chars}자")
    if not jobs:
        print("만들 음성이 없습니다. 샘플만 있다면 내 장소를 넣거나 --include-samples를 쓰세요.")
    if a.dry_run:
        for j in todo:
            print(f"  {j['file']}  ({len(j['text'])}자)")
        return 0

    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        print("ELEVENLABS_API_KEY가 없습니다. 터미널에서 export 한 뒤 다시 실행하세요.", file=sys.stderr)
        return 1
    if not a.voice:
        print("목소리 ID가 없습니다. ELEVENLABS_VOICE_ID를 넣거나 --voice로 주세요.", file=sys.stderr)
        return 1

    made = 0
    for j in todo:
        voice = (a.ko_voice or a.voice) if j["kind"] == "say" else a.voice
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
        (OUT / j["file"]).write_bytes(audio)
        made += 1
        print(f"  만듦 {j['file']} ({len(audio) // 1024}KB)")

    total = write_manifest()
    print(f"새로 만든 파일 {made}개. manifest.json에 {total}개 등록")
    return 0 if made == len(todo) else 1


if __name__ == "__main__":
    sys.exit(main())
