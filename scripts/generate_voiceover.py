"""Generate the narration audio, word-level captions and chapter markers.

Reads src/data/accomplishment.json (scenes[].narration), synthesizes each scene with
Microsoft Edge neural text-to-speech (edge-tts), and writes:

  public/voiceover/<scene>.mp3            narration audio per scene
  src/remotion/generated/voiceover.json   per-scene duration + captions for Remotion
  public/data/chapters.json               scene start times (seconds) for the landing page

Usage:  python -I scripts/generate_voiceover.py [--voice en-PH-RosaNeural] [--rate -4%] [--force]
"""
from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import math
import re
import subprocess
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "data" / "accomplishment.json"
AUDIO_DIR = ROOT / "public" / "voiceover"
GENERATED = ROOT / "src" / "remotion" / "generated" / "voiceover.json"
CHAPTERS = ROOT / "public" / "data" / "chapters.json"

PUNCT = re.compile(r"[^\w']+", re.UNICODE)


def normalize(token: str) -> str:
    return PUNCT.sub("", token).lower()


def audio_duration_ms(path: Path) -> int:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout.strip()
    return int(round(float(out) * 1000))


async def synthesize(text: str, voice: str, rate: str, out: Path) -> list[dict]:
    communicate = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    words: list[dict] = []
    with out.open("wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "text": chunk["text"],
                    "startMs": chunk["offset"] / 10_000,
                    "endMs": (chunk["offset"] + chunk["duration"]) / 10_000,
                })
    return words


def build_captions(source: str, words: list[dict], lead_ms: int) -> list[dict]:
    """Attach the original punctuation/casing to each spoken word and shift by the lead-in.

    Edge TTS occasionally emits no boundary for a token (years such as "2026" are the
    usual case). Skipped source tokens are inserted into the silent gap before the next
    spoken word so the subtitles always show the full sentence.
    """
    tokens = source.split()
    j = 0
    captions: list[dict] = []

    def push(text: str, start: float, end: float) -> None:
        captions.append({
            "text": (" " if captions else "") + text,
            "startMs": round(lead_ms + start),
            "endMs": round(lead_ms + end),
            "timestampMs": None,
            "confidence": None,
        })

    for w in words:
        display = w["text"]
        target = normalize(w["text"])
        matched = None
        for k in range(j, min(j + 4, len(tokens))):
            tok = normalize(tokens[k])
            if tok and (tok == target or tok.startswith(target) or target.startswith(tok)):
                matched = k
                break
        if matched is not None:
            skipped = tokens[j:matched]
            if skipped:
                prev_end = captions[-1]["endMs"] - lead_ms if captions else 0
                gap_start = min(prev_end, w["startMs"])
                step = max((w["startMs"] - gap_start) / len(skipped), 1)
                for n, tok in enumerate(skipped):
                    push(tok, gap_start + n * step, gap_start + (n + 1) * step)
            display = tokens[matched]
            j = matched + 1
        push(display, w["startMs"], w["endMs"])

    if j < len(tokens):  # trailing tokens never spoken as boundaries
        last_end = captions[-1]["endMs"] - lead_ms if captions else 0
        for n, tok in enumerate(tokens[j:]):
            push(tok, last_end + n * 250, last_end + (n + 1) * 250)
    missing = len(tokens) - len(captions)
    if missing:
        print(f" [warn: {missing} token(s) unmatched]", end="")
    return captions


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--voice")
    parser.add_argument("--rate")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    data = json.loads(DATA.read_text(encoding="utf-8"))
    video = data["video"]
    voice = args.voice or video["voice"]
    rate = args.rate or video["rate"]
    fps = video["fps"]
    lead_ms = video["leadMs"]
    tail_ms = video["tailMs"]
    transition = video["transitionFrames"]

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    GENERATED.parent.mkdir(parents=True, exist_ok=True)
    CHAPTERS.parent.mkdir(parents=True, exist_ok=True)

    previous = {}
    if GENERATED.exists() and not args.force:
        try:
            previous = {s["id"]: s for s in json.loads(GENERATED.read_text(encoding="utf-8"))["scenes"]}
        except Exception:
            previous = {}

    scenes_out = []
    for scene in data["scenes"]:
        text = scene["narration"]
        digest = hashlib.sha1(f"{voice}|{rate}|{text}".encode("utf-8")).hexdigest()[:12]
        mp3 = AUDIO_DIR / f"{scene['id']}.mp3"
        cached = previous.get(scene["id"])
        if cached and cached.get("hash") == digest and mp3.exists():
            print(f"  = {scene['id']:<12} cached ({cached['durationMs']} ms)")
            scenes_out.append(cached)
            continue

        print(f"  > {scene['id']:<12} synthesizing ...", end="", flush=True)
        words: list[dict] = []
        for attempt in range(1, 6):  # the Edge endpoint occasionally returns no audio; retry with backoff
            try:
                words = await synthesize(text, voice, rate, mp3)
                break
            except Exception as exc:  # noqa: BLE001
                if attempt == 5:
                    raise
                print(f" retry {attempt} ({type(exc).__name__})", end="", flush=True)
                await asyncio.sleep(2 * attempt)
        duration_ms = audio_duration_ms(mp3)
        frames = math.ceil((lead_ms + duration_ms + tail_ms) / 1000 * fps)
        scenes_out.append({
            "id": scene["id"],
            "title": scene["title"],
            "chapter": scene["chapter"],
            "hash": digest,
            "audio": f"voiceover/{scene['id']}.mp3",
            "durationMs": duration_ms,
            "frames": frames,
            "captions": build_captions(text, words, lead_ms),
        })
        print(f" {duration_ms} ms, {len(words)} words")

    # Timeline: consecutive scenes overlap by `transition` frames (cross-fade).
    start = 0
    chapters = []
    for s in scenes_out:
        s["startFrame"] = start
        chapters.append({"id": s["id"], "title": s["title"], "chapter": s["chapter"], "startSec": round(start / fps, 2)})
        start += s["frames"] - transition
    total_frames = start + transition

    GENERATED.write_text(json.dumps({
        "fps": fps,
        "transitionFrames": transition,
        "leadMs": lead_ms,
        "totalFrames": total_frames,
        "voice": voice,
        "scenes": scenes_out,
    }, indent=1), encoding="utf-8")
    CHAPTERS.write_text(json.dumps({
        "durationSec": round(total_frames / fps, 2),
        "chapters": chapters,
    }, indent=1), encoding="utf-8")
    print(f"\nTotal: {total_frames} frames = {total_frames / fps:.1f} s across {len(scenes_out)} scenes")
    print(f"Wrote {GENERATED.relative_to(ROOT)} and {CHAPTERS.relative_to(ROOT)}")


if __name__ == "__main__":
    asyncio.run(main())
