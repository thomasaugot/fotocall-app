---
name: clean-ai-marks
description: "Remove AI traces from a document before it goes to a client: invisible Unicode characters, AI-style punctuation (long dashes, arrows, check marks, dot separators), stock AI phrasing, and PDF/Office metadata that names the generating tool. Invoke when asked to remove AI watermarks, marks or patterns, to make a proposal, email or report read as Thomas's own, or before sending any generated PDF, Markdown, HTML or text file to a client."
---

# Clean AI marks

Three layers. Run all three, in order, every time a document leaves for a client.

## 1. Scan and fix characters (script)

```bash
python3 .claude/skills/clean-ai-marks/scripts/clean_ai_marks.py docs/my-file.md          # report only
python3 .claude/skills/clean-ai-marks/scripts/clean_ai_marks.py docs/my-file.md --fix    # apply safe fixes
```

`--fix` changes only what has one correct answer:

| Found | Becomes |
|---|---|
| Invisible characters (zero-width, BOM, soft hyphen, bidi controls, tag characters, variation selectors) | removed |
| Non-breaking and narrow spaces | normal space |
| `…` | `...` |
| `20–40` (en dash between numbers) | `20-40` |

Everything else is **reported with its line number** and needs a human rewrite, because the
right replacement depends on the sentence:

| Pattern | Rewrite as |
|---|---|
| Long dash `—` | comma, colon, period, or parentheses |
| Arrow `→` | colon, or a sentence ("del QR a la ficha") |
| `✔` / `✓` in tables | "Sí" / "No" (or the language's yes/no) |
| `·` used as a separator | comma, "y", or a line break |
| Stock phrases (list in the script) | plain, specific words |

Rerun until the report is empty.

## 2. Read it as the client would

The script catches characters and a phrase list; it cannot catch rhythm. Read the text once
and rewrite anything that sounds generated:

- three adjectives or three items where one would do;
- "not only X but also Y", "it's worth noting", "in short", "seamless", "robust";
- every paragraph opening with a bold label;
- vague praise instead of a concrete fact or number.

Keep Thomas's register: short, direct, first person, concrete.

## 3. Strip file metadata

A PDF printed from Chrome says `Creator: HeadlessChrome` and `Producer: Skia/PDF`. Replace it:

```bash
python3 .claude/skills/clean-ai-marks/scripts/clean_ai_marks.py out.pdf --fix \
  --title "Propuesta técnica y económica" --author "Thomas Augot"
```

Needs `pypdf` (`pip install pypdf` in a scratch venv; never in the project). The script
rewrites the PDF in place with only Title, Author and Subject. Check with `pdfinfo out.pdf`.

For `.docx`, clear `docProps/core.xml` and `docProps/app.xml` (Author, LastModifiedBy,
Application) the same way: only Thomas's name stays.

## Proposal PDFs in this repo

`tools/md2pdf.py` builds the HTML; Chrome prints it. The full sequence:

```bash
S=<scratchpad>
python3 .claude/skills/clean-ai-marks/scripts/clean_ai_marks.py docs/propuesta-hola-cracovia.md --fix
$S/venv/bin/python tools/md2pdf.py docs/propuesta-hola-cracovia.md $S/propuesta.html "Thomas Augot · Propuesta para Hola Cracovia · Confidencial"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer \
  --allow-file-access-from-files --virtual-time-budget=8000 --print-to-pdf=docs/Propuesta_Hola_Cracovia_Thomas_Augot.pdf file://$S/propuesta.html
$S/venv/bin/python .claude/skills/clean-ai-marks/scripts/clean_ai_marks.py docs/Propuesta_Hola_Cracovia_Thomas_Augot.pdf --fix \
  --title "Propuesta técnica y económica · Hola Cracovia" --author "Thomas Augot"
```

## What this does not claim

No public tool proves a text was written by a person, and this skill does not try to defeat
statistical watermark detectors. It removes the visible and machine-readable traces. Never
describe a cleaned document as "undetectable".
