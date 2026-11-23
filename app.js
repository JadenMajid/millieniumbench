(() => {
  "use strict";

  const state = {
    data: null,
    track: "overall",
    view: "table",
    category: "all",
    openWeightsOnly: false,
    search: "",
    sortKey: "overall",
    sortDir: "desc",
    problemFilter: "all",
  };

  const PROBLEM_ORDER = [
    "p-vs-np",
    "riemann",
    "yang-mills",
    "navier-stokes",
    "hodge",
    "bsd",
    "poincare",
  ];

  /* ------------------------------------------------------------------------
     Utilities
     ------------------------------------------------------------------------ */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatInlineCode(str) {
    return escapeHtml(str).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function renderMathInContainer(container = document) {
    if (!window.katex) return;
    $$(".math-render[data-latex]", container).forEach((el) => {
      const tex = el.getAttribute("data-latex");
      if (!tex) return;
      try {
        window.katex.render(tex, el, {
          throwOnError: false,
          displayMode: el.dataset.display === "true",
        });
      } catch (_) {
        // Keep plain-text fallback
      }
    });
  }

  function heatStyle(score) {
    const clamped = Math.max(0, Math.min(100, score));
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const alpha = (0.08 + (clamped / 100) * 0.42).toFixed(2);
    if (clamped >= 48) {
      return isDark
        ? `background: rgba(62, 194, 174, ${alpha}); color: #d6fff7;`
        : `background: rgba(20, 116, 103, ${alpha}); color: #0e473f;`;
    }
    if (clamped >= 30) {
      return isDark
        ? `background: rgba(223, 176, 89, ${alpha}); color: #fff2d6;`
        : `background: rgba(169, 120, 34, ${alpha}); color: #5d3f09;`;
    }
    return isDark
      ? `background: rgba(239, 116, 100, ${alpha}); color: #ffdcd7;`
      : `background: rgba(179, 66, 51, ${alpha}); color: #6e1f15;`;
  }

  /* ------------------------------------------------------------------------
     Theme Handling
     ------------------------------------------------------------------------ */
  function initTheme() {
    const saved = localStorage.getItem("mb-theme");
    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", initial);

    $("#theme-toggle")?.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("mb-theme", next);
      if (state.data) renderMatrix();
    });
  }

  /* ------------------------------------------------------------------------
     Mobile Nav
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    const btn = $("#mobile-menu-btn");
    const drawer = $("#mobile-drawer");
    if (!btn || !drawer) return;

    btn.addEventListener("click", () => {
      const isHidden = drawer.hasAttribute("hidden");
      if (isHidden) {
        drawer.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
      } else {
        drawer.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
      }
    });

    $$("a", drawer).forEach((link) => {
      link.addEventListener("click", () => {
        drawer.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------------------
     Leaderboard Rendering
     ------------------------------------------------------------------------ */
  function getFilteredModels() {
    if (!state.data) return [];
    const q = state.search.trim().toLowerCase();

    const filtered = state.data.models.filter((m) => {
      if (state.category !== "all" && m.category !== state.category) return false;
      if (state.openWeightsOnly && !m.openWeights) return false;
      if (q) {
        const hay = `${m.name} ${m.organization} ${m.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const key = state.sortKey;
    const dir = state.sortDir === "asc" ? 1 : -1;

    filtered.sort((a, b) => {
      if (key === "name") return a.name.localeCompare(b.name) * dir;
      return ((a[key] ?? 0) - (b[key] ?? 0)) * dir;
    });

    return filtered;
  }

  function renderScoreCell(value, isHighlighted) {
    return `
      <div class="score-bar-cell">
        <span class="score-num ${isHighlighted ? "highlight-track" : ""}">${value.toFixed(1)}%</span>
        <div class="mini-bar" aria-hidden="true">
          <div class="mini-bar-fill" style="width:${Math.min(100, value)}%"></div>
        </div>
      </div>
    `;
  }

  function renderLeaderboard() {
    const models = getFilteredModels();
    const tbody = $("#leaderboard-tbody");
    const countEl = $("#result-count");
    if (!tbody) return;

    $$(".leaderboard-table th.sortable").forEach((th) => {
      th.classList.toggle("sort-active", th.dataset.sort === state.sortKey);
    });

    if (models.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:34px; color:var(--ink-muted);">
            No models match the current filter criteria.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = models
        .map((m, idx) => {
          const rank = idx + 1;
          const rankBadge =
            rank <= 3
              ? `<span class="rank-medal rank-${rank}">${rank}</span>`
              : `${rank}`;
          return `
            <tr data-model-id="${escapeHtml(m.id)}" tabindex="0" aria-label="Inspect ${escapeHtml(m.name)}">
              <td class="col-rank">${rankBadge}</td>
              <td>
                <div class="model-cell">
                  <div class="model-name-row">
                    <span class="model-name">${escapeHtml(m.name)}</span>
                    ${m.openWeights ? '<span class="badge badge-open">Open Weights</span>' : ""}
                  </div>
                  <span class="model-org">${escapeHtml(m.organization)} · ${escapeHtml(m.date)}</span>
                </div>
              </td>
              <td><span class="badge badge-arch">${escapeHtml(m.category)}</span></td>
              <td class="col-num">${renderScoreCell(m.overall, state.track === "overall")}</td>
              <td class="col-num">${renderScoreCell(m.openFrontier, state.track === "openFrontier")}</td>
              <td class="col-num">${renderScoreCell(m.poincareControl, state.track === "poincareControl")}</td>
              <td class="col-num">${renderScoreCell(m.flawDetection, state.track === "flawDetection")}</td>
              <td class="col-num"><span class="open-solved-pill ${m.hasBreakthrough ? "has-solve" : ""}">${escapeHtml(m.openSolved)}</span></td>
              <td class="col-num" style="font-family:var(--font-mono); color:var(--ink-secondary);">${escapeHtml(m.avgCost)}</td>
            </tr>
          `;
        })
        .join("");

      $$("tr[data-model-id]", tbody).forEach((row) => {
        const open = () => openModelModal(row.dataset.modelId);
        row.addEventListener("click", open);
        row.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        });
      });
    }

    if (countEl) {
      countEl.textContent = `Showing ${models.length} of ${state.data.models.length} benchmarked systems`;
    }

    renderMatrix(models);
  }

  function renderMatrix(models = getFilteredModels()) {
    const tbody = $("#matrix-tbody");
    if (!tbody) return;

    if (models.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:34px; color:var(--ink-muted);">
            No models match the current filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = models
      .map((m, idx) => {
        const cells = PROBLEM_ORDER.map((pid) => {
          const val = m.problems[pid] ?? 0;
          return `<td class="col-num"><span class="heat-cell" style="${heatStyle(val)}">${val.toFixed(1)}%</span></td>`;
        }).join("");
        return `
          <tr data-model-id="${escapeHtml(m.id)}" tabindex="0">
            <td class="col-rank">${idx + 1}</td>
            <td>
              <div class="model-cell">
                <span class="model-name">${escapeHtml(m.name)}</span>
                <span class="model-org">${escapeHtml(m.organization)}</span>
              </div>
            </td>
            ${cells}
          </tr>
        `;
      })
      .join("");

    $$("tr[data-model-id]", tbody).forEach((row) => {
      row.addEventListener("click", () => openModelModal(row.dataset.modelId));
    });
  }

  function statusBadgeClass(problem) {
    const t = problem.statusType || (problem.status === "Unsolved" ? "unsolved" : "solved");
    if (t === "ai-verified") return "badge-ai-verified";
    if (t === "claimed") return "badge-claimed";
    if (t === "solved") return "badge-solved";
    return "badge-unsolved";
  }

  /* ------------------------------------------------------------------------
     Seven Millennium Problems Cards
     ------------------------------------------------------------------------ */
  function renderProblems() {
    const grid = $("#problems-grid");
    if (!grid || !state.data) return;

    const filtered = state.data.problems.filter((p) => {
      const t = p.statusType || (p.status === "Unsolved" ? "unsolved" : "solved");
      if (state.problemFilter === "all") return true;
      if (state.problemFilter === "breakthrough") return t === "ai-verified" || t === "claimed";
      if (state.problemFilter === "unsolved") return t === "unsolved";
      if (state.problemFilter === "solved") return t === "solved";
      return p.category === state.problemFilter;
    });

    grid.innerHTML = filtered
      .map((p) => {
        return `
          <article class="problem-card" data-problem-id="${escapeHtml(p.id)}" tabindex="0" role="button" aria-label="Inspect ${escapeHtml(p.title)}">
            <div class="problem-card-top">
              <div class="problem-num-field">
                <span class="problem-num">#${escapeHtml(p.number)}</span>
                <span>·</span>
                <span>${escapeHtml(p.field)}</span>
              </div>
              <span class="badge ${statusBadgeClass(p)}">${escapeHtml(p.status)}</span>
            </div>
            <h3 class="problem-title">${escapeHtml(p.title)}</h3>
            <div class="problem-formula math-render" data-latex="${escapeHtml(p.formulaLatex)}">
              ${escapeHtml(p.formulaPlain)}
            </div>
            <p class="problem-summary">${escapeHtml(p.summary)}</p>
            <div class="problem-footer">
              <span>Best AI Milestone: <strong class="problem-sota">${p.sotaScore.toFixed(1)}%</strong> (${p.subtasks} tasks)</span>
              <span class="problem-inspect">Inspect →</span>
            </div>
          </article>
        `;
      })
      .join("");

    renderMathInContainer(grid);

    $$(".problem-card", grid).forEach((card) => {
      const open = () => openProblemModal(card.dataset.problemId);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Modals (Problem Detail & Model Detail)
     ------------------------------------------------------------------------ */
  function openModal(kicker, title, htmlBody) {
    const modal = $("#detail-modal");
    if (!modal) return;
    $("#modal-kicker").textContent = kicker;
    $("#modal-title").textContent = title;
    const bodyEl = $("#modal-body");
    bodyEl.innerHTML = htmlBody;
    renderMathInContainer(bodyEl);
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    $("#modal-close")?.focus();
  }

  function closeModal() {
    const modal = $("#detail-modal");
    if (!modal || modal.hasAttribute("hidden")) return;
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  function openProblemModal(problemId) {
    const p = state.data?.problems.find((item) => item.id === problemId);
    if (!p) return;

    const breakthroughBlock = p.breakthrough
      ? `
      <div>
        <div class="modal-section-label">Latest Verification Status (Nov 2026)</div>
        <div class="breakthrough-callout ${p.statusType === "ai-verified" || p.statusType === "solved" ? "verified" : ""}">
          ${formatInlineCode(p.breakthrough)}
        </div>
      </div>`
      : "";

    const bodyHtml = `
      <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
        <span class="badge ${statusBadgeClass(p)}">${escapeHtml(p.status)}</span>
        <span class="badge badge-arch">Prize: ${escapeHtml(p.prize)}</span>
        <span class="badge badge-arch">Proposed: ${escapeHtml(p.proposed)}</span>
        <span class="badge badge-arch">Clay Problem Description: ${escapeHtml(p.officialAuthor)}</span>
      </div>

      ${breakthroughBlock}

      <div class="problem-formula math-render" data-latex="${escapeHtml(p.formulaLatex)}" data-display="true" style="padding:16px;">
        ${escapeHtml(p.formulaPlain)}
      </div>

      <div>
        <div class="modal-section-label">Formal Statement</div>
        <p style="margin:0; font-size:0.93rem; color:var(--ink-secondary);">${formatInlineCode(p.statement)}</p>
      </div>

      <div>
        <div class="modal-section-label">MillieniumBench 4-Tier Task Breakdown (${p.subtasks} Graded Subtasks)</div>
        <div class="tier-list">
          <div class="tier-item">
            <strong>Tier 1 · Formalization Foundations</strong>
            <p>${formatInlineCode(p.tiers.formalization)}</p>
          </div>
          <div class="tier-item">
            <strong>Tier 2 · Known Barriers &amp; Milestones</strong>
            <p>${formatInlineCode(p.tiers.milestones)}</p>
          </div>
          <div class="tier-item">
            <strong>Tier 3 · Adversarial Flaw Audit</strong>
            <p>${formatInlineCode(p.tiers.flawAudit)}</p>
          </div>
          <div class="tier-item">
            <strong>Tier 4 · Full Prize-Level Goal</strong>
            <p>${formatInlineCode(p.tiers.grandGoal)}</p>
          </div>
        </div>
      </div>

      <div>
        <div class="modal-section-label">Lean 4 Target Signature Skeleton</div>
        <div class="code-panel">
          <div class="code-tabs">
            <span class="code-label">MillieniumBench/${escapeHtml(p.id)}.lean</span>
            <button type="button" class="copy-btn" data-copy-lean="true">Copy Lean 4</button>
          </div>
          <pre class="code-block"><code>${escapeHtml(p.leanSnippet)}</code></pre>
        </div>
      </div>
    `;

    openModal(`Clay Problem #${p.number} · ${p.field}`, p.title, bodyHtml);

    const copyBtn = $('[data-copy-lean="true"]', $("#modal-body"));
    copyBtn?.addEventListener("click", () => copyText(p.leanSnippet, copyBtn));
  }

  function openModelModal(modelId) {
    const m = state.data?.models.find((item) => item.id === modelId);
    if (!m) return;

    const breakdownCards = state.data.problems
      .map((p) => {
        const score = m.problems[p.id] ?? 0;
        return `
          <div class="breakdown-card">
            <div class="breakdown-card-top">
              <span>${escapeHtml(p.shortName)}</span>
              <strong>${score.toFixed(1)}%</strong>
            </div>
            <div class="mini-bar" style="width:100%;">
              <div class="mini-bar-fill" style="width:${Math.min(100, score)}%"></div>
            </div>
          </div>
        `;
      })
      .join("");

    const bodyHtml = `
      <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
        <span class="badge badge-arch">${escapeHtml(m.category)}</span>
        ${m.openWeights ? '<span class="badge badge-open">Open Weights</span>' : '<span class="badge badge-arch">API / Proprietary</span>'}
        <span class="open-solved-pill ${m.hasBreakthrough ? "has-solve" : ""}">Open Breakthroughs: ${escapeHtml(m.openSolved)}</span>
        <span class="badge badge-arch">Est. Cost / Full Run: ${escapeHtml(m.avgCost)}</span>
      </div>

      <div class="tier-list">
        <div class="tier-item">
          <strong>Overall Composite Score</strong>
          <p style="font-family:var(--font-mono); font-size:1.3rem; font-weight:600; color:var(--gold); margin-top:4px;">${m.overall.toFixed(1)}%</p>
        </div>
        <div class="tier-item">
          <strong>Adversarial Flaw Detection</strong>
          <p style="font-family:var(--font-mono); font-size:1.3rem; font-weight:600; color:var(--teal); margin-top:4px;">${m.flawDetection.toFixed(1)}%</p>
        </div>
      </div>

      <div>
        <div class="modal-section-label">Evaluation Notes &amp; Verified Highlights</div>
        <p style="margin:0; font-size:0.92rem; color:var(--ink-secondary);">${escapeHtml(m.highlights)}</p>
      </div>

      <div>
        <div class="modal-section-label">Per-Problem Mastery Across All 7 Clay Problems</div>
        <div class="model-breakdown-grid">${breakdownCards}</div>
      </div>
    `;

    openModal(`${m.organization} · Evaluated ${m.date}`, m.name, bodyHtml);
  }

  /* ------------------------------------------------------------------------
     Copy Helpers & Code Tabs
     ------------------------------------------------------------------------ */
  function copyText(text, btn) {
    const done = () => {
      const prev = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.textContent = prev;
      }, 1500);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => {});
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      done();
    }
  }

  function initCodeTabs() {
    let activeTab = "cli";
    const tabs = $$(".code-tab[data-code-tab]");
    const blocks = {
      cli: $("#code-cli"),
      pr: $("#code-pr"),
      schema: $("#code-schema"),
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activeTab = tab.dataset.codeTab;
        tabs.forEach((t) => t.classList.toggle("active", t === tab));
        Object.entries(blocks).forEach(([key, el]) => {
          if (!el) return;
          if (key === activeTab) el.removeAttribute("hidden");
          else el.setAttribute("hidden", "");
        });
      });
    });

    $("#copy-code-btn")?.addEventListener("click", (e) => {
      const code = blocks[activeTab]?.textContent || "";
      copyText(code.trim(), e.currentTarget);
    });

    $("#copy-bibtex-btn")?.addEventListener("click", (e) => {
      const bib = $("#bibtex-block")?.textContent || "";
      copyText(bib.trim(), e.currentTarget);
    });
  }

  /* ------------------------------------------------------------------------
     Subtle Mathematical Hero Backdrop (Riemann Critical Strip / Harmonic Curves)
     ------------------------------------------------------------------------ */
  function initHeroCanvas() {
    const canvas = $("#math-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let t = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const gridColor = isDark ? "rgba(223, 176, 89, 0.07)" : "rgba(169, 120, 34, 0.08)";
      const curveColor = isDark ? "rgba(223, 176, 89, 0.22)" : "rgba(169, 120, 34, 0.22)";
      const accentColor = isDark ? "rgba(62, 194, 174, 0.18)" : "rgba(20, 116, 103, 0.16)";

      // Subtle vertical critical-line axis on the right half
      const axisX = width * 0.78;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i++) {
        const x = axisX + i * 48;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Harmonic wave trajectories inspired by ζ(1/2 + it) & Navier-Stokes streamlines
      for (let c = 0; c < 4; c++) {
        ctx.beginPath();
        ctx.strokeStyle = c === 0 ? curveColor : accentColor;
        ctx.lineWidth = c === 0 ? 1.5 : 1;
        const baseY = height * (0.28 + c * 0.16);
        for (let x = width * 0.42; x <= width + 20; x += 10) {
          const nx = (x - width * 0.42) / 140;
          const y =
            baseY +
            Math.sin(nx * 1.4 + t + c * 0.9) * (22 + c * 4) +
            Math.cos(nx * 2.7 - t * 0.6 + c) * 10;
          if (x === width * 0.42) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (!reduceMotion) {
        t += 0.0045;
        requestAnimationFrame(draw);
      }
    }

    resize();
    draw();
    window.addEventListener("resize", () => {
      resize();
      if (reduceMotion) draw();
    });
  }

  /* ------------------------------------------------------------------------
     Controls Wiring & Data Loading
     ------------------------------------------------------------------------ */
  function bindControls() {
    // Track tabs
    $$(".tab-btn[data-track]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.track = btn.dataset.track;
        state.sortKey = state.track;
        state.sortDir = "desc";
        $$(".tab-btn[data-track]").forEach((b) => {
          const active = b === btn;
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", String(active));
        });
        renderLeaderboard();
      });
    });

    // View toggle (Table vs Heatmap)
    $$(".switch-btn[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.view = btn.dataset.view;
        $$(".switch-btn[data-view]").forEach((b) => b.classList.toggle("active", b === btn));
        const tableView = $("#leaderboard-table-view");
        const matrixView = $("#leaderboard-matrix-view");
        if (state.view === "table") {
          tableView.removeAttribute("hidden");
          matrixView.setAttribute("hidden", "");
        } else {
          tableView.setAttribute("hidden", "");
          matrixView.removeAttribute("hidden");
        }
      });
    });

    // Search input
    $("#model-search")?.addEventListener("input", (e) => {
      state.search = e.target.value;
      renderLeaderboard();
    });

    // Category filter pills
    $$(".filter-bar .pill[data-category]").forEach((pill) => {
      pill.addEventListener("click", () => {
        state.category = pill.dataset.category;
        $$(".filter-bar .pill[data-category]").forEach((p) => p.classList.toggle("active", p === pill));
        renderLeaderboard();
      });
    });

    // Open weights checkbox
    $("#open-weights-only")?.addEventListener("change", (e) => {
      state.openWeightsOnly = e.target.checked;
      renderLeaderboard();
    });

    // Sortable table columns
    $$(".leaderboard-table th.sortable").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        if (state.sortKey === key) {
          state.sortDir = state.sortDir === "desc" ? "asc" : "desc";
        } else {
          state.sortKey = key;
          state.sortDir = key === "name" ? "asc" : "desc";
        }
        renderLeaderboard();
      });
    });

    // Problem filter pills
    $$("#problem-filters .pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        state.problemFilter = pill.dataset.problemFilter;
        $$("#problem-filters .pill").forEach((p) => p.classList.toggle("active", p === pill));
        renderProblems();
      });
    });

    // Modal closing
    $("#modal-close")?.addEventListener("click", closeModal);
    $("#detail-modal")?.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  async function loadData() {
    try {
      const resp = await fetch("data/benchmark.json", { cache: "no-store" });
      if (!resp.ok) throw new Error("HTTP error");
      return await resp.json();
    } catch (_) {
      return window.MILLIENIUMBENCH_DATA || null;
    }
  }

  async function bootstrap() {
    initTheme();
    initMobileNav();
    initCodeTabs();
    bindControls();
    initHeroCanvas();

    state.data = await loadData();
    if (!state.data) return;

    const metaEl = $("#dataset-meta");
    if (metaEl && state.data.benchmark) {
      metaEl.textContent = `Live Standings · v${state.data.benchmark.version} · Updated ${state.data.benchmark.lastUpdated}`;
    }

    renderLeaderboard();
    renderProblems();

    // Render KaTeX once deferred script loads
    if (window.katex) {
      renderMathInContainer(document);
    } else {
      window.addEventListener("load", () => renderMathInContainer(document));
    }
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();
