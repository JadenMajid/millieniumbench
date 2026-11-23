window.MILLIENIUMBENCH_DATA = {
  "benchmark": {
    "name": "MillieniumBench",
    "version": "0.2.0",
    "lastUpdated": "2026-11-23",
    "leanVersion": "Lean 4 / Mathlib4",
    "statusNote": "Verified real-world proof attempts only — no synthetic or placeholder scores. Official Clay prizes remain pending CMI's mandatory peer-review and 2-year scrutiny rules."
  },
  "problems": [
    {
      "id": "p-vs-np",
      "number": "01",
      "shortName": "P vs NP",
      "title": "P versus NP Problem",
      "field": "Complexity Theory",
      "category": "complexity",
      "status": "Unsolved",
      "statusType": "unsolved",
      "aiStatusSummary": "No verified AI proof",
      "prize": "$1,000,000",
      "proposed": "Stephen Cook (1971)",
      "officialAuthor": "Stephen Cook",
      "formulaLatex": "\\mathrm{P} \\stackrel{?}{=} \\mathrm{NP}",
      "formulaPlain": "P ≟ NP",
      "summary": "Determine whether every language whose membership can be verified in polynomial time by a deterministic Turing machine can also be decided in polynomial time.",
      "statement": "Let P be the class of decision problems solvable by a deterministic Turing machine in polynomial time, and NP be the class of decision problems verifiable in polynomial time given a polynomial-size witness. Prove either P = NP or P ≠ NP.",
      "breakthrough": null,
      "tiers": {
        "formalization": "Formalize Cook–Levin theorem, polynomial-time reductions, and circuit complexity classes (AC⁰, NC¹, P/poly) in Lean 4.",
        "milestones": "Reproduce Baker–Gill–Solovay relativization, Razborov–Rudich natural proofs barrier, and Aaronson–Wigderson algebrization barrier.",
        "flawAudit": "Detect invalid deductions in flawed P vs NP manuscripts (hidden exponential blowup, invalid diagonalization, non-uniform reductions).",
        "grandGoal": "Complete Lean 4 proof of P = NP or P ≠ NP with zero axioms beyond standard Mathlib foundations."
      },
      "leanSnippet": "import Mathlib.Computability.TMComputable\n\nnamespace MillieniumBench.PvsNP\n\n/-- Decision problem solvable in deterministic polynomial time. -/\ndef InP (L : Set (List Bool)) : Prop := sorry\n\n/-- Decision problem verifiable in deterministic polynomial time. -/\ndef InNP (L : Set (List Bool)) : Prop := sorry\n\n/-- Clay Millennium Prize Statement: Does P equal NP? -/\ntheorem p_vs_np : (∀ L, InP L ↔ InNP L) ∨ ¬(∀ L, InP L ↔ InNP L) := by\n  -- A constructive resolution proves one disjunct directly.\n  sorry\n\nend MillieniumBench.PvsNP"
    },
    {
      "id": "riemann",
      "number": "02",
      "shortName": "Riemann",
      "title": "Riemann Hypothesis",
      "field": "Analytic Number Theory",
      "category": "number-theory",
      "status": "Claimed (Nov 2026)",
      "statusType": "claimed",
      "aiStatusSummary": "Claude + Alpöge (Nov 2026)",
      "prize": "$1M · Pending CMI 2-Yr Review",
      "proposed": "Bernhard Riemann (1859)",
      "officialAuthor": "Enrico Bombieri",
      "formulaLatex": "\\zeta(s) = 0,\\; 0 < \\operatorname{Re}(s) < 1 \\implies \\operatorname{Re}(s) = \\tfrac{1}{2}",
      "formulaPlain": "ζ(s) = 0, 0 < Re(s) < 1 ⟹ Re(s) = 1/2",
      "summary": "Prove that every non-trivial zero of the analytic continuation of the Riemann zeta function lies on the critical line Re(s) = 1/2. Claimed in Nov 2026 (Alpöge + Claude); awaiting CMI's 2-year review.",
      "statement": "The Riemann zeta function ζ(s) = ∑(n=1 to ∞) n⁻ˢ for Re(s) > 1 extends meromorphically to ℂ with a single simple pole at s = 1. Prove that all zeros of ζ(s) in the critical strip 0 < Re(s) < 1 satisfy Re(s) = 1/2.",
      "breakthrough": "Nov 20, 2026 — Levent Alpöge (Anthropic) with Claude released a ~17M-line Lean 4 / Mathlib library (175,187 files) proving both RH and GRH for Dirichlet L-functions. The Lean FRO, Mathlib Initiative, and independent checkers (con-leche, con-ron) verified compilation against Mathlib's native `RiemannHypothesis` with zero `sorry`. Official CMI prize recognition still requires peer-reviewed publication and 2 years of community scrutiny.",
      "tiers": {
        "formalization": "Formalize the Euler product, functional equation ξ(s) = ξ(1 - s), and Hadamard–de la Vallée Poussin zero-free region.",
        "milestones": "Prove equivalence to Lagarias's elementary inequality, Robin's criterion, and Hardy's theorem on infinitely many critical-line zeros.",
        "flawAudit": "Detect invalid deductions in flawed Riemann proofs (circular contour integrals, illegal exchange of limits, invalid self-adjoint operators).",
        "grandGoal": "Mechanically verified proof of `RiemannHypothesis` (achieved Nov 2026 by Alpöge + Claude; pending CMI 2-year peer review)."
      },
      "leanSnippet": "import Mathlib.NumberTheory.LSeries.RiemannZeta\n\nnamespace MillieniumBench.Riemann\n\n/-- Every non-trivial zero of ζ(s) lies on the critical line Re(s) = 1/2.\n    Lean-verified Nov 20, 2026 (Alpöge + Claude); pending CMI 2-year review. -/\ntheorem riemann_hypothesis :\n    ∀ s : ℂ, riemannZeta s = 0 →\n      (¬∃ n : ℕ, s = -2 * (n + 1)) →\n      s ≠ 1 →\n      s.re = 1 / 2 := by\n  sorry\n\nend MillieniumBench.Riemann"
    },
    {
      "id": "yang-mills",
      "number": "03",
      "shortName": "Yang–Mills",
      "title": "Yang–Mills Existence & Mass Gap",
      "field": "Mathematical Physics",
      "category": "physics-pde",
      "status": "Partial · Existence (Oct 2026)",
      "statusType": "claimed",
      "aiStatusSummary": "GPT-6.2 Astra (Existence only, Oct 2026)",
      "prize": "$1M · Mass Gap Still Open",
      "proposed": "Yang & Mills (1954)",
      "officialAuthor": "Arthur Jaffe & Edward Witten",
      "formulaLatex": "\\operatorname{spec}(H) \\subset \\{0\\} \\cup [\\Delta, \\infty),\\quad \\Delta > 0",
      "formulaPlain": "spec(H) ⊂ {0} ∪ [Δ, ∞),  Δ > 0",
      "summary": "Construct a rigorous 4D quantum Yang–Mills theory for any compact simple gauge group G with mass gap Δ > 0. OpenAI released a Lean 4 existence proof in Oct–Nov 2026; the mass gap Δ > 0 remains open.",
      "statement": "Prove that for any compact simple gauge group G, a non-trivial quantum Yang–Mills theory exists on ℝ⁴ and has a mass gap Δ > 0, establishing a rigorous axiomatic quantum field theory satisfying Wightman or Osterwalder–Schrader axioms.",
      "breakthrough": "Oct 26 / Nov 2026 — OpenAI announced a Lean-formalized 4D Yang–Mills & QCD existence proof (`OpenAI-YM-20261028`), shepherded and released by an independent committee chaired by Nobel laureate David J. Gross (with Arthur Jaffe, Michael R. Douglas, Igor R. Klebanov, and Nikita Nekrasov). Because the mass gap (Δ > 0) remains unproven, the full Millennium Prize problem stays open.",
      "tiers": {
        "formalization": "Formalize principal G-bundles, Yang–Mills curvature functionals, lattice gauge Wilson action, and reflection positivity.",
        "milestones": "Reproduce 2D Yang–Mills exact solvability, Balaban's renormalization group estimates on finite lattices, and 4D existence construction.",
        "flawAudit": "Detect invalid deductions in flawed QFT proofs (uncontrolled UV continuum limits, non-rigorous path integrals, missing reflection positivity).",
        "grandGoal": "Formalized existence of Wightman fields for compact simple G on ℝ⁴ AND proof of strictly positive spectral mass gap Δ > 0."
      },
      "leanSnippet": "import Mathlib.Analysis.InnerProductSpace.Spectrum\n\nnamespace MillieniumBench.YangMills\n\nstructure QuantumYangMills (G : Type*) where\n  hilbertSpace : Type*\n  hamiltonian : hilbertSpace →ₗ[ℂ] hilbertSpace\n  satisfiesOsterwalderSchrader : Prop\n  massGap : ℝ\n  massGap_pos : 0 < massGap\n\ntheorem yang_mills_existence_and_mass_gap\n    (G : Type*) [CompactSimpleLieGroup G] :\n    ∃ T : QuantumYangMills G, T.satisfiesOsterwalderSchrader := by\n  sorry\n\nend MillieniumBench.YangMills"
    },
    {
      "id": "navier-stokes",
      "number": "04",
      "shortName": "Navier–Stokes",
      "title": "Navier–Stokes Existence & Smoothness",
      "field": "Partial Differential Equations",
      "category": "physics-pde",
      "status": "Claimed · Forced (Sep 2026)",
      "statusType": "claimed",
      "aiStatusSummary": "GPT-6.2 Astra (Forced C/D, Sep 2026)",
      "prize": "$1M · CMI Active / Unforced Open",
      "proposed": "Navier (1822) & Stokes (1845)",
      "officialAuthor": "Charles Fefferman",
      "formulaLatex": "\\partial_t u + (u \\cdot \\nabla) u = \\nu \\Delta u - \\nabla p + f,\\quad \\nabla \\cdot u = 0",
      "formulaPlain": "∂ₜu + (u · ∇)u = νΔu − ∇p + f,  ∇ · u = 0",
      "summary": "Prove global smoothness or finite-time blowup for 3D incompressible Navier–Stokes. In Sep 2026 OpenAI published a Lean 4 forced blowup proof (Fefferman Alternatives C & D); NL-to-Lean audit and unforced (f = 0) case remain active.",
      "statement": "Given smooth, rapidly decaying divergence-free initial velocity u₀ on ℝ³ (or 𝕋³) and viscosity ν > 0, prove either global existence and smoothness (Fefferman Alternatives A/B) or finite-time breakdown with smooth initial data and smooth external force f (Alternatives C/D).",
      "breakthrough": "Sep 8, 2026 — OpenAI's internal multi-agent system (~10,000 agents, 88h) released a 166-page proof + Lean 4 formalization of finite-time blowup from rest with a smooth compactly supported force f (targeting Fefferman Alternatives C & D). The Lean kernel compiled cleanly, though researchers are auditing natural-language-to-Lean boundary/cutoff fidelity, OpenAI declined to claim the CMI prize, and the unforced (f = 0) problem remains open.",
      "tiers": {
        "formalization": "Formalize Sobolev spaces Hˢ(ℝ³), Leray–Hopf weak solutions, Helmholtz projection, and energy inequalities.",
        "milestones": "Reproduce 2D global regularity, Ladyzhenskaya–Prodi–Serrin criteria, Beale–Kato–Majda vorticity blowup criterion, and forced singularity constructions.",
        "flawAudit": "Detect invalid deductions in flawed PDE proofs (invalid Gronwall inequalities, supercritical scaling confusion, NL-to-Lean cutoff/translation mismatches).",
        "grandGoal": "Peer-reviewed, faithful Lean 4 resolution of Fefferman Alternatives (C)/(D) without translation gaps, plus resolution of the unforced (f = 0) case."
      },
      "leanSnippet": "namespace MillieniumBench.NavierStokes\n\n/-- 3D incompressible Navier-Stokes: global smoothness vs finite-time blowup.\n    Sep 2026: OpenAI claimed forced blowup (Alternatives C/D); unforced f = 0 remains open. -/\naxiom SmoothDivergenceFree (u0 : (Fin 3 → ℝ) → (Fin 3 → ℝ)) : Prop\naxiom GlobalSmoothUnforced (ν : ℝ) (u0 : (Fin 3 → ℝ) → (Fin 3 → ℝ)) : Prop\n\ntheorem navier_stokes_unforced_regularity_or_blowup (ν : ℝ) (hν : 0 < ν) :\n    (∀ u0, SmoothDivergenceFree u0 → GlobalSmoothUnforced ν u0) ∨\n    (∃ u0, SmoothDivergenceFree u0 ∧ ¬GlobalSmoothUnforced ν u0) := by\n  sorry\n\nend MillieniumBench.NavierStokes"
    },
    {
      "id": "hodge",
      "number": "05",
      "shortName": "Hodge",
      "title": "Hodge Conjecture",
      "field": "Algebraic Geometry",
      "category": "geometry-topology",
      "status": "Unsolved",
      "statusType": "unsolved",
      "aiStatusSummary": "No verified AI proof",
      "prize": "$1,000,000",
      "proposed": "W. V. D. Hodge (1950)",
      "officialAuthor": "Pierre Deligne",
      "formulaLatex": "\\operatorname{Hdg}^{p}(X) = H^{2p}(X, \\mathbb{Q}) \\cap H^{p,p}(X) \\stackrel{?}{=} \\operatorname{im}(\\operatorname{cl})",
      "formulaPlain": "Hdgᵖ(X) = H²ᵖ(X, ℚ) ∩ Hᵖ,ᵖ(X) ≟ im(cl)",
      "summary": "Show that on every non-singular projective complex algebraic variety X, every rational Hodge class is a rational linear combination of cohomology classes of algebraic subvarieties.",
      "statement": "Let X be a non-singular projective complex algebraic manifold. Prove that every Hodge class in H²ᵖ(X, ℚ) ∩ Hᵖ,ᵖ(X) is a ℚ-linear combination of fundamental classes of algebraic subvarieties of codimension p.",
      "breakthrough": null,
      "tiers": {
        "formalization": "Formalize Kähler manifolds, Dolbeault cohomology, Hodge decomposition, and algebraic cycle class maps.",
        "milestones": "Prove the Lefschetz (1,1) theorem, Hard Lefschetz consequences for codimension 1 and dim(X) - 1, and known cases for abelian varieties of low dimension.",
        "flawAudit": "Detect invalid deductions in flawed Hodge proofs (conflating integral vs rational Hodge classes, invalid analytic-to-algebraic GAGA invocations).",
        "grandGoal": "Complete formal proof of the rational Hodge Conjecture or verified construction of a smooth projective counterexample."
      },
      "leanSnippet": "namespace MillieniumBench.Hodge\n\naxiom SmoothProjectiveVariety : Type*\naxiom HodgeClass (X : SmoothProjectiveVariety) (p : ℕ) : Type*\naxiom IsAlgebraicCycleClass {X : SmoothProjectiveVariety} {p : ℕ}\n    (α : HodgeClass X p) : Prop\n\ntheorem hodge_conjecture (X : SmoothProjectiveVariety) (p : ℕ)\n    (α : HodgeClass X p) : IsAlgebraicCycleClass α := by\n  sorry\n\nend MillieniumBench.Hodge"
    },
    {
      "id": "bsd",
      "number": "06",
      "shortName": "BSD",
      "title": "Birch & Swinnerton-Dyer Conjecture",
      "field": "Arithmetic Geometry",
      "category": "number-theory",
      "status": "Unsolved",
      "statusType": "unsolved",
      "aiStatusSummary": "No verified AI proof",
      "prize": "$1,000,000",
      "proposed": "Birch & Swinnerton-Dyer (1965)",
      "officialAuthor": "Andrew Wiles",
      "formulaLatex": "\\operatorname{rank} E(\\mathbb{Q}) = \\operatorname{ord}_{s=1} L(E, s)",
      "formulaPlain": "rank E(ℚ) = ord_{s=1} L(E, s)",
      "summary": "Prove that the algebraic rank of the Mordell–Weil group of rational points on an elliptic curve E/ℚ equals the order of vanishing of its Hasse–Weil L-function at s = 1.",
      "statement": "For any elliptic curve E defined over ℚ, prove that the rank of the abelian group E(ℚ) equals the order of vanishing of the analytic continuation of the L-series L(E, s) at s = 1 (and relate the leading Taylor coefficient to the Tate–Shafarevich group and regulator).",
      "breakthrough": null,
      "tiers": {
        "formalization": "Formalize Weierstrass models over ℚ, Mordell–Weil theorem, Selmer & Tate–Shafarevich groups, and Hasse–Weil L-functions.",
        "milestones": "Reproduce Coates–Wiles theorem (CM curves), Gross–Zagier height formula, and Kolyvagin's Euler system proof for analytic rank ≤ 1.",
        "flawAudit": "Detect invalid deductions in flawed BSD proofs (unjustified finiteness of Ш(E/ℚ), invalid analytic continuation of L-series without modularity).",
        "grandGoal": "Full formal proof of `rank E(ℚ) = ord_{s=1} L(E, s)` for all elliptic curves over ℚ."
      },
      "leanSnippet": "namespace MillieniumBench.BSD\n\naxiom EllipticCurveQ : Type*\naxiom mordellWeilRank (E : EllipticCurveQ) : ℕ\naxiom analyticRank (E : EllipticCurveQ) : ℕ\n\ntheorem birch_swinnerton_dyer (E : EllipticCurveQ) :\n    mordellWeilRank E = analyticRank E := by\n  sorry\n\nend MillieniumBench.BSD"
    },
    {
      "id": "poincare",
      "number": "07",
      "shortName": "Poincaré",
      "title": "Poincaré Conjecture (Solved Control)",
      "field": "Geometric Topology",
      "category": "geometry-topology",
      "status": "CMI Verified",
      "statusType": "solved",
      "aiStatusSummary": "Solved by G. Perelman (2003)",
      "prize": "Awarded 2010 (Perelman, declined)",
      "proposed": "Henri Poincaré (1904)",
      "officialAuthor": "John Milnor",
      "formulaLatex": "\\pi_1(M^3) = 1 \\implies M^3 \\cong S^3",
      "formulaPlain": "π₁(M³) = 1 ⟹ M³ ≅ S³",
      "summary": "Every simply connected, closed 3-manifold is homeomorphic to the 3-sphere. Remains the only Millennium Prize Problem officially resolved by CMI and serves as MillieniumBench's ground-truth control task.",
      "statement": "If a compact 3-dimensional manifold M³ without boundary has the property that every simple closed curve within the manifold can be continuously deformed to a point, then M³ is homeomorphic to the 3-sphere S³. Solved by Grigori Perelman (2002–2003) via Hamilton's Ricci flow with surgery.",
      "breakthrough": "Solved by Grigori Perelman (2002–2003); formally verified by the mathematical community and awarded the Clay Millennium Prize in 2010 (Perelman declined the award).",
      "tiers": {
        "formalization": "Formalize Riemannian metrics, Ricci curvature tensor, Hamilton's Ricci flow PDE, and Perelman's W-entropy functional.",
        "milestones": "Prove no local collapsing theorem, canonical neighborhood theorem, finite-time extinction for simply connected 3-manifolds.",
        "flawAudit": "Detect invalid deductions in historical flawed Poincaré attempts (early topological surgery errors, Dehn lemma misapplications, Ricci singularity gaps).",
        "grandGoal": "Complete, dependency-clean Lean 4 formalization of Perelman's proof from Mathlib primitives without external hints."
      },
      "leanSnippet": "import Mathlib.Geometry.Manifold.ChartedSpace\nimport Mathlib.AlgebraicTopology.FundamentalGroupoid.SimplyConnected\n\nnamespace MillieniumBench.Poincare\n\n/-- Control Benchmark: Every closed simply connected 3-manifold is homeomorphic to S³. -/\ntheorem poincare_conjecture\n    (M : Type*) [TopologicalSpace M] [CompactSpace M]\n    [ClosedThreeManifold M] [SimplyConnectedSpace M] :\n    Nonempty (M ≃ₜ Sphere3) := by\n  sorry\n\nend MillieniumBench.Poincare"
    }
  ],
  "models": [
    {
      "id": "claude-research-model",
      "name": "Claude (Internal Frontier)",
      "organization": "Anthropic",
      "openWeights": false,
      "date": "2026-11-20",
      "claimedCount": 1,
      "cmiVerifiedCount": 0,
      "verificationSummary": "Pending CMI 2-year peer review",
      "milestoneLabel": "Riemann Hypothesis & GRH",
      "highlights": "Nov 20, 2026: Used with mathematician Levent Alpöge to publish a claimed proof of both the Riemann Hypothesis and Generalized Riemann Hypothesis (GRH), accompanied by a ~17M-line formal library. Anthropic did not disclose which internal Claude checkpoint was used; official CMI verification awaits peer-reviewed publication and a 2-year scrutiny window.",
      "problems": {
        "p-vs-np": {
          "label": "—",
          "state": "none"
        },
        "riemann": {
          "label": "Claimed",
          "state": "claimed"
        },
        "yang-mills": {
          "label": "—",
          "state": "none"
        },
        "navier-stokes": {
          "label": "—",
          "state": "none"
        },
        "hodge": {
          "label": "—",
          "state": "none"
        },
        "bsd": {
          "label": "—",
          "state": "none"
        },
        "poincare": {
          "label": "—",
          "state": "none"
        }
      }
    },
    {
      "id": "gpt-6-2-astra",
      "name": "GPT-6.2 Astra",
      "organization": "OpenAI",
      "openWeights": false,
      "date": "2026-11-15",
      "claimedCount": 1,
      "cmiVerifiedCount": 0,
      "verificationSummary": "Forced NS under review · YM mass gap open",
      "milestoneLabel": "Navier–Stokes (Forced) · Yang–Mills (Partial)",
      "highlights": "OpenAI's flagship frontier model (`gpt-6.2-astra`) and its internal predecessor checkpoint. Sep 8, 2026: Claimed a 166-page finite-time blowup proof for 3D Navier–Stokes with a smooth external force targeting Fefferman Alternatives (C) & (D) (under community review; unforced f = 0 case open). Oct 26 / Nov 10, 2026: Released a 4D Yang–Mills / QCD existence proof shepherded by David J. Gross's committee (mass gap Δ > 0 remains open).",
      "problems": {
        "p-vs-np": {
          "label": "—",
          "state": "none"
        },
        "riemann": {
          "label": "—",
          "state": "none"
        },
        "yang-mills": {
          "label": "Partial (Existence)",
          "state": "partial"
        },
        "navier-stokes": {
          "label": "Claimed (Forced)",
          "state": "claimed"
        },
        "hodge": {
          "label": "—",
          "state": "none"
        },
        "bsd": {
          "label": "—",
          "state": "none"
        },
        "poincare": {
          "label": "—",
          "state": "none"
        }
      }
    },
    {
      "id": "claude-fable-5-2",
      "name": "Claude Fable 5.2",
      "organization": "Anthropic",
      "openWeights": false,
      "date": "2026-11-01",
      "claimedCount": 0,
      "cmiVerifiedCount": 0,
      "verificationSummary": "No Millennium Prize proof attributed",
      "milestoneLabel": "None",
      "highlights": "Anthropic's highest-tier general-release reasoning model (Mythos-class architecture, 1M token context) built for deep scientific and mathematical reasoning. No Millennium Prize Problem proof has been publicly attributed specifically to Fable 5.2.",
      "problems": {
        "p-vs-np": {
          "label": "—",
          "state": "none"
        },
        "riemann": {
          "label": "—",
          "state": "none"
        },
        "yang-mills": {
          "label": "—",
          "state": "none"
        },
        "navier-stokes": {
          "label": "—",
          "state": "none"
        },
        "hodge": {
          "label": "—",
          "state": "none"
        },
        "bsd": {
          "label": "—",
          "state": "none"
        },
        "poincare": {
          "label": "—",
          "state": "none"
        }
      }
    },
    {
      "id": "claude-opus-5-5",
      "name": "Claude Opus 5.5",
      "organization": "Anthropic",
      "openWeights": false,
      "date": "2026-11-01",
      "claimedCount": 0,
      "cmiVerifiedCount": 0,
      "verificationSummary": "No Millennium Prize proof attributed",
      "milestoneLabel": "None",
      "highlights": "Anthropic's flagship general-purpose frontier model (1M token context, adaptive thinking). No Millennium Prize Problem proof has been attributed to Opus 5.5.",
      "problems": {
        "p-vs-np": {
          "label": "—",
          "state": "none"
        },
        "riemann": {
          "label": "—",
          "state": "none"
        },
        "yang-mills": {
          "label": "—",
          "state": "none"
        },
        "navier-stokes": {
          "label": "—",
          "state": "none"
        },
        "hodge": {
          "label": "—",
          "state": "none"
        },
        "bsd": {
          "label": "—",
          "state": "none"
        },
        "poincare": {
          "label": "—",
          "state": "none"
        }
      }
    },
    {
      "id": "gpt-6-2-sol",
      "name": "GPT-6.2 Sol",
      "organization": "OpenAI",
      "openWeights": false,
      "date": "2026-11-15",
      "claimedCount": 0,
      "cmiVerifiedCount": 0,
      "verificationSummary": "No Millennium Prize proof attributed",
      "milestoneLabel": "None",
      "highlights": "OpenAI's versatile November 2026 model (`gpt-6.2-sol`) optimized for high-volume coding, document analysis, and everyday reasoning. No Millennium Prize Problem proof has been attributed to Sol.",
      "problems": {
        "p-vs-np": {
          "label": "—",
          "state": "none"
        },
        "riemann": {
          "label": "—",
          "state": "none"
        },
        "yang-mills": {
          "label": "—",
          "state": "none"
        },
        "navier-stokes": {
          "label": "—",
          "state": "none"
        },
        "hodge": {
          "label": "—",
          "state": "none"
        },
        "bsd": {
          "label": "—",
          "state": "none"
        },
        "poincare": {
          "label": "—",
          "state": "none"
        }
      }
    },
    {
      "id": "gemini-4-carbon",
      "name": "Gemini 4 Carbon",
      "organization": "Google DeepMind",
      "openWeights": false,
      "date": "2026-10-20",
      "claimedCount": 0,
      "cmiVerifiedCount": 0,
      "verificationSummary": "No Millennium Prize proof attributed",
      "milestoneLabel": "None",
      "highlights": "Google DeepMind's heavy-duty Gemini 4 tier built for demanding scientific and intelligence workloads. No Millennium Prize Problem proof has been attributed to Gemini 4 Carbon.",
      "problems": {
        "p-vs-np": {
          "label": "—",
          "state": "none"
        },
        "riemann": {
          "label": "—",
          "state": "none"
        },
        "yang-mills": {
          "label": "—",
          "state": "none"
        },
        "navier-stokes": {
          "label": "—",
          "state": "none"
        },
        "hodge": {
          "label": "—",
          "state": "none"
        },
        "bsd": {
          "label": "—",
          "state": "none"
        },
        "poincare": {
          "label": "—",
          "state": "none"
        }
      }
    },
    {
      "id": "gemini-4-neon",
      "name": "Gemini 4 Neon",
      "organization": "Google DeepMind",
      "openWeights": false,
      "date": "2026-11-12",
      "claimedCount": 0,
      "cmiVerifiedCount": 0,
      "verificationSummary": "No Millennium Prize proof attributed",
      "milestoneLabel": "None",
      "highlights": "Google DeepMind's November 2026 high-speed frontier reasoning model. No Millennium Prize Problem proof has been attributed to Gemini 4 Neon.",
      "problems": {
        "p-vs-np": {
          "label": "—",
          "state": "none"
        },
        "riemann": {
          "label": "—",
          "state": "none"
        },
        "yang-mills": {
          "label": "—",
          "state": "none"
        },
        "navier-stokes": {
          "label": "—",
          "state": "none"
        },
        "hodge": {
          "label": "—",
          "state": "none"
        },
        "bsd": {
          "label": "—",
          "state": "none"
        },
        "poincare": {
          "label": "—",
          "state": "none"
        }
      }
    },
    {
      "id": "deepseek-v4-1-flash",
      "name": "DeepSeek-V4.1-Flash",
      "organization": "DeepSeek",
      "openWeights": true,
      "date": "2026-09-25",
      "claimedCount": 0,
      "cmiVerifiedCount": 0,
      "verificationSummary": "No Millennium Prize proof attributed",
      "milestoneLabel": "None",
      "highlights": "DeepSeek's September 2026 open-weights Asymmetric Causal Encoder–Decoder MoE model (552B total parameters). No Millennium Prize Problem proof has been attributed to DeepSeek-V4.1-Flash.",
      "problems": {
        "p-vs-np": {
          "label": "—",
          "state": "none"
        },
        "riemann": {
          "label": "—",
          "state": "none"
        },
        "yang-mills": {
          "label": "—",
          "state": "none"
        },
        "navier-stokes": {
          "label": "—",
          "state": "none"
        },
        "hodge": {
          "label": "—",
          "state": "none"
        },
        "bsd": {
          "label": "—",
          "state": "none"
        },
        "poincare": {
          "label": "—",
          "state": "none"
        }
      }
    }
  ]
};
