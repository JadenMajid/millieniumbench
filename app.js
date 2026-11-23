(() => {
  "use strict";

  const state = {
    data: null,
    track: "all",
    view: "table",
    provider: "all",
    search: "",
    sortKey: "claimedCount",
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

  function statusBadgeClass(problem) {
    const t = problem.statusType || (problem.status === "Unsolved" ? "unsolved" : "solved");
    if (t === "ai-verified") return "badge-ai-verified";
    if (t === "claimed") return "badge-claimed";
    if (t === "solved") return "badge-solved";
    return "badge-unsolved";
  }

  function matrixCellHtml(cell) {
    if (!cell || cell.state === "none") {
      return `<span class="matrix-empty">—</span>`;
    }
    const cls =
      cell.state === "verified"
        ? "badge-ai-verified"
        : cell.state === "claimed" || cell.state === "partial"
          ? "badge-claimed"
          : "badge-arch";
    return `<span class="badge ${cls}">${escapeHtml(cell.label)}</span>`;
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
    });
  }

  /* ------------------------------------------------------------------------
     Mobile Nav
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    const btn = $("#mobile-menu-btn");
    const drawer = $("#mobile-drawer");
    if (!btn || !drawer) return;

    function closeDrawer() {
      if (!drawer.hasAttribute("hidden")) {
        drawer.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
      }
    }

    btn.addEventListener("click", () => {
      const isHidden = drawer.hasAttribute("hidden");
      if (isHidden) {
        drawer.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
      } else {
        closeDrawer();
      }
    });

    $$("a", drawer).forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeDrawer();
    });
  }

  /* ------------------------------------------------------------------------
     Leaderboard Rendering (Verified Real-World Entries Only)
     ------------------------------------------------------------------------ */
  function getFilteredModels() {
    if (!state.data) return [];
    const q = state.search.trim().toLowerCase();

    const filtered = state.data.models.filter((m) => {
      if (state.track === "claimed" && (m.claimedCount ?? 0) === 0) return false;
      if (state.track === "cmi" && (m.cmiVerifiedCount ?? 0) === 0) return false;
      if (state.track === "open" && ((m.claimedCount ?? 0) > 0 || (m.cmiVerifiedCount ?? 0) > 0)) return false;
      if (state.provider !== "all" && m.organization !== state.provider) return false;
      if (q) {
        const hay = `${m.name} ${m.organization} ${m.milestoneLabel} ${m.verificationSummary}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const key = state.sortKey;
    const dir = state.sortDir === "asc" ? 1 : -1;

    filtered.sort((a, b) => {
      if (key === "name" || key === "organization" || key === "date") {
        return String(a[key] ?? "").localeCompare(String(b[key] ?? "")) * dir;
      }
      const diff = ((a[key] ?? 0) - (b[key] ?? 0)) * dir;
      if (diff !== 0) return diff;
      const cmiDiff = (b.cmiVerifiedCount ?? 0) - (a.cmiVerifiedCount ?? 0);
      if (cmiDiff !== 0) return cmiDiff;
      const claimDiff = (b.claimedCount ?? 0) - (a.claimedCount ?? 0);
      if (claimDiff !== 0) return claimDiff;
      return String(b.date ?? "").localeCompare(String(a.date ?? ""));
    });

    return filtered;
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
          <td colspan="7" style="text-align:center; padding:34px; color:var(--ink-muted);">
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
          const claimedPill =
            m.claimedCount > 0
              ? `<span class="badge badge-claimed">${m.claimedCount} / 6</span>`
              : `<span class="matrix-empty">0 / 6</span>`;
          const cmiPill =
            m.cmiVerifiedCount > 0
              ? `<span class="open-solved-pill has-solve">${m.cmiVerifiedCount} / 6</span>`
              : `<span class="matrix-empty">0 / 6</span>`;

          return `
            <tr data-model-id="${escapeHtml(m.id)}" tabindex="0" aria-label="Inspect ${escapeHtml(m.name)}">
              <td class="col-rank">${rankBadge}</td>
              <td>
                <div class="model-name-row">
                  <span class="model-name">${escapeHtml(m.name)}</span>
                  ${m.openWeights ? '<span class="badge badge-open">Open Weights</span>' : ""}
                </div>
              </td>
              <td><span class="badge badge-arch">${escapeHtml(m.organization)}</span></td>
              <td class="col-num">${claimedPill}</td>
              <td class="col-num">${cmiPill}</td>
              <td>
                <div class="model-cell">
                  <span style="font-weight:500; color:var(--ink);">${escapeHtml(m.milestoneLabel)}</span>
                  <span class="model-org">${escapeHtml(m.verificationSummary)}</span>
                </div>
              </td>
              <td class="col-num" style="font-family:var(--font-mono); color:var(--ink-secondary); white-space:nowrap;">${escapeHtml(m.date)}</td>
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
      countEl.textContent = `Showing ${models.length} of ${state.data.models.length} models`;
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
            No verified entries match the current filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = models
      .map((m, idx) => {
        const cells = PROBLEM_ORDER.map((pid) => {
          return `<td class="col-num">${matrixCellHtml(m.problems[pid])}</td>`;
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
              <span>Status: <strong class="problem-sota">${escapeHtml(p.aiStatusSummary)}</strong></span>
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
        <div class="modal-section-label">MillieniumBench Verification Scope</div>
        <div class="tier-list">
          <div class="tier-item">
            <strong>Stage 1 · Formalization Foundations</strong>
            <p>${formatInlineCode(p.tiers.formalization)}</p>
          </div>
          <div class="tier-item">
            <strong>Stage 2 · Known Barriers &amp; Milestones</strong>
            <p>${formatInlineCode(p.tiers.milestones)}</p>
          </div>
          <div class="tier-item">
            <strong>Stage 3 · Proof Fidelity &amp; Flaw Audit</strong>
            <p>${formatInlineCode(p.tiers.flawAudit)}</p>
          </div>
          <div class="tier-item">
            <strong>Stage 4 · Full Prize-Level Goal</strong>
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
        const cell = m.problems[p.id];
        return `
          <div class="breakdown-card">
            <div class="breakdown-card-top">
              <span>${escapeHtml(p.shortName)}</span>
            </div>
            <div>${matrixCellHtml(cell)}</div>
          </div>
        `;
      })
      .join("");

    const statusBadgeCls =
      m.cmiVerifiedCount > 0
        ? "badge-solved"
        : m.claimedCount > 0
          ? "badge-claimed"
          : "badge-arch";

    const bodyHtml = `
      <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
        <span class="badge badge-arch">${escapeHtml(m.organization)}</span>
        ${m.openWeights ? '<span class="badge badge-open">Open Weights</span>' : ""}
        <span class="badge ${statusBadgeCls}">${escapeHtml(m.verificationSummary)}</span>
      </div>

      <div class="tier-list">
        <div class="tier-item">
          <strong>Claimed</strong>
          <p style="font-family:var(--font-mono); font-size:1.25rem; font-weight:600; color:var(--gold); margin-top:4px;">${m.claimedCount} / 6</p>
        </div>
        <div class="tier-item">
          <strong>CMI Verified</strong>
          <p style="font-family:var(--font-mono); font-size:1.25rem; font-weight:600; color:var(--teal); margin-top:4px;">${m.cmiVerifiedCount} / 6</p>
        </div>
      </div>

      <div>
        <div class="modal-section-label">Verification Details &amp; Public Record</div>
        <p style="margin:0; font-size:0.92rem; color:var(--ink-secondary);">${formatInlineCode(m.highlights)}</p>
      </div>

      <div>
        <div class="modal-section-label">Status Across All 7 Clay Problems</div>
        <div class="model-breakdown-grid">${breakdownCards}</div>
      </div>
    `;

    openModal(`${m.organization} · Updated ${m.date}`, m.name, bodyHtml);
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
     Subtle Mathematical Hero Backdrop
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
    $$(".tab-btn[data-track]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.track = btn.dataset.track;
        $$(".tab-btn[data-track]").forEach((b) => {
          const active = b === btn;
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", String(active));
        });
        renderLeaderboard();
      });
    });

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

    $("#model-search")?.addEventListener("input", (e) => {
      state.search = e.target.value;
      renderLeaderboard();
    });

    $$(".filter-bar .pill[data-provider]").forEach((pill) => {
      pill.addEventListener("click", () => {
        state.provider = pill.dataset.provider;
        $$(".filter-bar .pill[data-provider]").forEach((p) => p.classList.toggle("active", p === pill));
        renderLeaderboard();
      });
    });

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

    $$("#problem-filters .pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        state.problemFilter = pill.dataset.problemFilter;
        $$("#problem-filters .pill").forEach((p) => p.classList.toggle("active", p === pill));
        renderProblems();
      });
    });

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
      const resp = await fetch("data/benchmark.json?v=0.2.1", { cache: "no-store" });
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
      metaEl.textContent = `Verified Public Record · v${state.data.benchmark.version} · Updated ${state.data.benchmark.lastUpdated}`;
    }

    renderLeaderboard();
    renderProblems();

    if (window.katex) {
      renderMathInContainer(document);
    } else {
      window.addEventListener("load", () => renderMathInContainer(document));
    }
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();
