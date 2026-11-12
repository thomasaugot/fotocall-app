"""Find and remove AI traces in text files and PDF metadata.

Usage:
  clean_ai_marks.py FILE [FILE ...]            report only
  clean_ai_marks.py FILE --fix                  apply the safe fixes (text) / rewrite metadata (pdf)
  clean_ai_marks.py out.pdf --fix --title T --author A [--subject S]

Exit code 1 when something still needs attention, 0 when clean.
"""
import argparse
import re
import sys
import unicodedata

INVISIBLE = re.compile(
    "[­᠎​-‏‪-‮⁠-⁤⁦-⁩﻿︀-️\U000e0000-\U000e007f]"
)
ODD_SPACES = re.compile("[     ]")
NUM_RANGE = re.compile(r"(\d)–(\d)")

# reported, rewritten by hand: the right replacement depends on the sentence
MANUAL = {
    "—": "long dash: use a comma, colon, period or parentheses",
    "–": "en dash outside a number range: use a hyphen or rewrite",
    "→": "arrow: use a colon or a sentence",
    "←": "arrow: use a colon or a sentence",
    "✔": "check mark: write Sí/No",
    "✓": "check mark: write Sí/No",
    "✅": "emoji check: write Sí/No",
    "·": "dot separator: use a comma, 'y' or a line break",
}
PHRASES = [
    # Spanish
    "no solo", "sino también", "cabe destacar", "cabe mencionar", "en definitiva", "en resumen",
    "sin fricción", "mínima fricción", "de principio a fin", "sin renunciar", "sin complicaciones",
    "experiencia fluida", "de forma fluida", "robusto", "robusta", "potenciar", "ecosistema",
    "solución integral", "llevar al siguiente nivel", "en el panorama actual",
    # English
    "seamless", "robust", "leverage", "delve", "it's worth noting", "in today's", "not only",
    "game-changer", "elevate", "unlock", "cutting-edge",
    # French
    "il convient de noter", "non seulement", "en somme", "sans friction",
]


def scan_text(text):
    issues = []
    for n, line in enumerate(text.split("\n"), 1):
        for m in INVISIBLE.finditer(line):
            issues.append((n, f"invisible U+{ord(m.group()):04X} {unicodedata.name(m.group(), '')}", True))
        for m in ODD_SPACES.finditer(line):
            issues.append((n, f"odd space U+{ord(m.group()):04X}", True))
        if "…" in line:
            issues.append((n, "ellipsis character", True))
        if NUM_RANGE.search(line):
            issues.append((n, "en dash in a number range", True))
        stripped = NUM_RANGE.sub("", line)
        for ch, why in MANUAL.items():
            if ch in stripped:
                issues.append((n, f"{why}  |  {line.strip()[:90]}", False))
        low = line.lower()
        for p in PHRASES:
            if re.search(r"(?<!\w)" + re.escape(p) + r"(?!\w)", low):
                issues.append((n, f"stock phrase '{p}'  |  {line.strip()[:90]}", False))
    return issues


def fix_text(text):
    text = INVISIBLE.sub("", text)
    text = ODD_SPACES.sub(" ", text)
    text = text.replace("…", "...")
    return NUM_RANGE.sub(r"\1-\2", text)


def handle_pdf(path, args):
    try:
        from pypdf import PdfReader, PdfWriter
    except ImportError:
        print(f"{path}: pypdf missing. Install it in a scratch venv: python3 -m venv v && v/bin/pip install pypdf")
        return 1
    meta = PdfReader(path).metadata or {}
    leaks = {k: v for k, v in meta.items() if k in ("/Creator", "/Producer") or "chrome" in str(v).lower() or "skia" in str(v).lower()}
    if not args.fix:
        for k, v in meta.items():
            print(f"{path}: {k} = {v}{'   <- remove' if k in leaks else ''}")
        return 1 if leaks else 0
    reader = PdfReader(path)
    writer = PdfWriter(clone_from=reader)
    writer.metadata = None
    clean = {"/Title": args.title or str(meta.get("/Title", "")), "/Author": args.author or ""}
    if args.subject:
        clean["/Subject"] = args.subject
    writer.add_metadata({k: v for k, v in clean.items() if v})
    with open(path, "wb") as f:
        writer.write(f)
    print(f"{path}: metadata replaced with {', '.join(k.strip('/') for k, v in clean.items() if v)}")
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="+")
    ap.add_argument("--fix", action="store_true")
    ap.add_argument("--title")
    ap.add_argument("--author")
    ap.add_argument("--subject")
    args = ap.parse_args()
    status = 0
    for path in args.files:
        if path.lower().endswith(".pdf"):
            status |= handle_pdf(path, args)
            continue
        text = open(path, encoding="utf-8").read()
        if args.fix:
            fixed = fix_text(text)
            if fixed != text:
                open(path, "w", encoding="utf-8").write(fixed)
                print(f"{path}: safe fixes applied")
            text = fixed
        issues = [i for i in scan_text(text) if not (args.fix and i[2])]
        for n, msg, auto in issues:
            print(f"{path}:{n}: {msg}{'  (auto with --fix)' if auto else ''}")
        if not issues:
            print(f"{path}: clean")
        status |= 1 if issues else 0
    sys.exit(status)


if __name__ == "__main__":
    main()
