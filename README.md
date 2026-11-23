# MillieniumBench

**An open-source AI benchmark website and evaluation framework testing frontier AI systems and automated theorem provers on the seven Clay Mathematics Institute Millennium Prize Problems.**

---

## Overview

**MillieniumBench** measures mathematical reasoning, formal proof generation in Lean 4, and adversarial flaw detection across all seven Millennium Prize Problems (status as of **November 23, 2026**):

1. **P versus NP** (Complexity Theory) — *Unsolved*
2. **Riemann Hypothesis** (Analytic Number Theory) — *AI Lean-Verified (Nov 20, 2026, Levent Alpöge + Claude; Lean FRO & Mathlib verified; pending CMI's mandatory 2-year peer-review period)*
3. **Yang–Mills Existence and Mass Gap** (Mathematical Physics) — *Partial · 4D Existence Claimed (Oct–Nov 2026, OpenAI, shepherded by David J. Gross's committee; mass gap Δ > 0 remains open)*
4. **Navier–Stokes Existence and Smoothness** (Partial Differential Equations) — *AI Claimed · Forced Blowup (Sep 8, 2026, OpenAI multi-agent Lean 4 proof targeting Fefferman Alternatives C/D; NL-to-Lean review ongoing and unforced f = 0 case remains open)*
5. **Hodge Conjecture** (Algebraic Geometry) — *Unsolved*
6. **Birch and Swinnerton-Dyer Conjecture** (Arithmetic Geometry) — *Unsolved*
7. **Poincaré Conjecture** (Geometric Topology) — *Officially Solved by CMI (Grigori Perelman, 2003; awarded 2010, declined) — Control Task*

Under Clay Mathematics Institute rules, official Millennium Prize awards require peer-reviewed publication and two years of mathematical community scrutiny, so Poincaré remains the sole CMI-awarded problem. MillieniumBench tracks **only publicly documented real-world proof attempts** (zero synthetic placeholder scores) across four verification stages:

- **Stage 1 — Formalization Foundations:** Definitions and target theorems anchored to standard `Mathlib4` statements with zero `sorry`.
- **Stage 2 — Independent Kernel Check:** Clean compilation under the official Lean 4 kernel and third-party checkers (*con-leche*, *con-ron*).
- **Stage 3 — Statement Fidelity Audit:** Human mathematical audit verifying that Lean definitions faithfully match the Clay Institute problem statement.
- **Stage 4 — CMI 2-Year Peer Review:** Peer-reviewed publication and two years of global mathematical community acceptance.

---

## Website Features

- **Verified Model Leaderboard:** Sortable table and **7-Problem Status Matrix** tracking frontier AI models (`Claude (Internal Frontier)`, `GPT-6.2 Astra`, `Claude Fable 5.2`, `Claude Opus 5.5`, `GPT-6.2 Sol`, `Gemini 4 Carbon`, `Gemini 4 Neon`, `DeepSeek-V4.1-Flash`) regardless of harness/environment, with zero synthetic placeholder scores.
- **Model & Problem Inspector Modals:** Click any row for public verification notes and per-problem status, or click any Millennium Problem card for its formal statement, latest 2026 verification status, and Lean 4 target skeleton.
- **Zero-Build Static Architecture:** Plain HTML, CSS, and vanilla JS with KaTeX math rendering and Light/Dark theme support — deploys directly to GitHub Pages with no bundler required.

---

## Deploying to GitHub Pages

1. Push changes to the `master` branch:
   ```bash
   git push origin master
   ```
2. In your repository on GitHub, open **Settings → Pages** and ensure **Build and deployment → Source** is set to **GitHub Actions**.
3. The included [`.github/workflows/static.yml`](.github/workflows/static.yml) workflow deploys the static site automatically on every push to `master` (or via manual `workflow_dispatch`).

---

## Local Preview

Run any static HTTP server from this directory:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

---

## Updating Leaderboard Data

Leaderboard entries and problem metadata live in [`data/benchmark.json`](data/benchmark.json). After updating `data/benchmark.json`, regenerate the offline fallback file `data/benchmark.js`:

```bash
python3 -c 'import json; d=json.load(open("data/benchmark.json")); open("data/benchmark.js","w").write("window.MILLIENIUMBENCH_DATA = " + json.dumps(d, indent=2) + ";\n")'
```

---

## Disclaimer

MillieniumBench is an independent open-source AI research benchmark inspired by the Clay Mathematics Institute's Millennium Prize Problems. It is not affiliated with, sponsored by, or endorsed by the Clay Mathematics Institute.

## License

MIT License — see [`LICENSE`](LICENSE).
