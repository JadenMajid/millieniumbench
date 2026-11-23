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

Under Clay Mathematics Institute rules, official Millennium Prize awards require peer-reviewed publication and two years of mathematical community scrutiny, so Poincaré remains the sole CMI-awarded problem while MillieniumBench tracks both landmark AI formal proofs and four graded evaluation tiers:

- **Tier 1 (25%) — Formalization Foundations:** Lean 4 / Mathlib4 definitions and foundational lemmas with zero `sorry`.
- **Tier 2 (35%) — Barrier & Partial Milestones:** Reconstructing landmark partial theorems and known barriers (e.g., Razborov–Rudich, Hardy's theorem, Gross–Zagier, Beale–Kato–Majda).
- **Tier 3 (20%) — Adversarial Flaw Audit:** Pinpointing the exact first invalid step across 160 flawed purported Millennium proofs.
- **Tier 4 (20% + Prize Gate) — Poincaré Control & Open Frontier:** End-to-end reconstruction of Perelman's solved proof as calibration, plus kernel-checked open-problem attempts.

---

## Website Features

- **Interactive Leaderboard:** Sortable columns, track tabs (`Overall Composite`, `Open Frontier`, `Poincaré Control`, `Flaw Audit`), architecture and open-weights filters, live search, and a **7-Problem Heatmap Matrix** view.
- **Model & Problem Inspector Modals:** Click any model row for its per-problem breakdown across all 7 problems, or click any Millennium Problem card for its formal statement, 4-tier task breakdown, and Lean 4 target skeleton.
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
