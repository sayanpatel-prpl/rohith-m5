/*
 * App Module — Main application logic, navigation, rendering
 * Consumer Durables Intelligence Dashboard
 * Following Kompete patterns
 */

const App = {

  currentSection: 'executive',

  // Helper: get lowercase first-word keywords for filtered companies
  _getFilterKeywords(filteredIds) {
    const ids = filteredIds || Filters.getFilteredCompanyIds();
    if (ids.length === DATA.companies.length) return null; // all selected
    return ids.map(id => DataUtils.getCompany(id)?.name?.split(' ')[0]?.toLowerCase()).filter(Boolean);
  },

  // Helper: check if free-form text is relevant to filtered companies
  // Returns true if: all selected, text mentions a selected company, or text is sector-wide (mentions no specific company)
  _textMatchesFilter(text, keywords) {
    if (!keywords) return true;
    const lower = text.toLowerCase();
    const allKw = DATA.companies.map(c => c.name.split(' ')[0].toLowerCase());
    const mentionsAny = allKw.some(kw => lower.includes(kw));
    if (!mentionsAny) return true; // sector-wide, always show
    return keywords.some(kw => lower.includes(kw));
  },

  // Helper: check if a structured item's company field matches filtered companies
  _companyMatchesFilter(companyField, keywords) {
    if (!keywords) return true;
    const lower = companyField.toLowerCase();
    return keywords.some(kw => lower.includes(kw));
  },

  // Helper: empty state — shows centered dash with optional message
  _emptyState(message) {
    const msg = message || 'Awaiting sourced data';
    return `<div style="text-align:center;padding:24px 16px;color:var(--slate-400);font-size:0.85rem;">
      <div style="font-size:1.5rem;font-weight:600;color:var(--slate-300);margin-bottom:4px;">&mdash;</div>
      ${msg}
    </div>`;
  },

  // Helper: A&M Signal classification
  _getAmSignal(companyId, qIdx) {
    const yoy = parseFloat(DataUtils.getYoYGrowthAt(companyId, 'revenue', qIdx));
    const ebitda = DataUtils.getValueAt(companyId, 'ebitdaMargin', qIdx);
    const ebitdaPrior = qIdx >= 4 ? DataUtils.getValueAt(companyId, 'ebitdaMargin', qIdx - 4) : null;
    const marginDelta = (ebitda !== null && ebitdaPrior !== null) ? ebitda - ebitdaPrior : 0;
    const debt = DataUtils.getValueAt(companyId, 'netDebtEbitda', qIdx);
    const wc = DataUtils.getValueAt(companyId, 'workingCapDays', qIdx);
    const rating = DATA.performanceRatings[companyId]?.rating;
    const capex = DataUtils.getValueAt(companyId, 'capexIntensity', qIdx);

    // Red: Turnaround Candidate
    if (!isNaN(yoy) && yoy < 0 && (marginDelta < -1 || (debt !== null && debt > 2))) {
      const reasons = [];
      if (yoy < 0) reasons.push('Rev decline ' + yoy.toFixed(1) + '%');
      if (marginDelta < -1) reasons.push('Margin -' + Math.abs(marginDelta).toFixed(1) + 'pp');
      if (debt > 2) reasons.push('Leverage ' + debt + 'x');
      return { type: 'turnaround', color: '#EF4444', label: 'Turnaround', tooltip: reasons.join(', ') };
    }

    // Amber: Performance Improvement
    if (rating === 'Inline' || rating === 'Underperform') {
      const reasons = [];
      if (wc !== null && wc > 40) reasons.push('WC ' + wc + ' days (high)');
      if (marginDelta < -0.5) reasons.push('Margin compressing');
      if (capex !== null && capex > 8) reasons.push('Capex ' + capex + '% (heavy)');
      if (debt !== null && debt > 1.5) reasons.push('Leverage ' + debt + 'x');
      if (reasons.length) return { type: 'improve', color: '#F59E0B', label: 'Perf. Improve', tooltip: reasons.join(', ') };
    }

    // Green: Transaction Advisory / CDD
    if (rating === 'Outperform' || (!isNaN(yoy) && yoy > 15 && ebitda !== null && ebitda > 10)) {
      const reasons = [];
      if (rating === 'Outperform') reasons.push('Outperformer');
      if (!isNaN(yoy) && yoy > 15) reasons.push('Rev +' + yoy.toFixed(1) + '%');
      if (ebitda > 10) reasons.push('EBITDA ' + ebitda + '%');
      return { type: 'transaction', color: '#22C55E', label: 'Transaction', tooltip: reasons.join(', ') };
    }

    // Blue: Monitor
    return { type: 'monitor', color: '#3B82F6', label: 'Monitor', tooltip: 'No immediate signal' };
  },

  // Helper: Inline SVG sparkline from data array
  _sparklineSvg(dataArray, qIdx) {
    const end = Math.min(qIdx + 1, dataArray.length);
    const start = Math.max(0, end - 6);
    const slice = dataArray.slice(start, end).filter(v => v !== null && v !== undefined);
    if (slice.length < 2) return '';
    const min = Math.min(...slice);
    const max = Math.max(...slice);
    const range = max - min || 1;
    const w = 50, h = 18, pad = 2;
    const points = slice.map((v, i) => {
      const x = pad + (i / (slice.length - 1)) * (w - 2 * pad);
      const y = h - pad - ((v - min) / range) * (h - 2 * pad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    const last = slice[slice.length - 1];
    const first = slice[0];
    const color = last > first ? '#22C55E' : last < first ? '#EF4444' : '#94A3B8';
    const lastPt = points.split(' ').pop().split(',');
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="vertical-align:middle;">
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="2" fill="${color}"/>
    </svg>`;
  },

  // Helper: Compute sector medians for given company IDs at given quarter
  _getSectorMedians(ids, qIdx) {
    const collect = (metric) => ids.map(id => DataUtils.getValueAt(id, metric, qIdx)).filter(v => v !== null);
    const median = (arr) => { if (!arr.length) return null; const s = [...arr].sort((a,b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m-1] + s[m]) / 2; };
    const avg = (arr) => arr.length ? +(arr.reduce((a,b) => a + b, 0) / arr.length).toFixed(1) : null;
    return {
      wcDays: median(collect('workingCapDays')),
      invDays: median(collect('inventoryDays')),
      ebitda: avg(collect('ebitdaMargin')),
      debt: median(collect('netDebtEbitda')),
    };
  },

  init() {
    this.bindNavigation();
    this.bindModal();
    this.bindHamburger();
    Filters.init();
    try { Filters.loadFromLocalStorage(); } catch(e) { console.warn('Filter load failed, resetting:', e); localStorage.removeItem('cdi_filters'); }
    ExportUtils.init();
    this.bindDealFyFilter();
    this.bindDerivedToggle();
    try { this.renderAllSections(); } catch(e) { console.error('renderAllSections error:', e); }
    try { Charts.renderAll(Filters.getFilteredCompanyIds()); } catch(e) { console.error('Charts.renderAll error:', e); }
  },

  bindDealFyFilter() {
    const fySelect = document.getElementById('dealFyFilter');
    if (fySelect) {
      fySelect.addEventListener('change', () => {
        const filtered = Filters.getFilteredCompanyIds();
        this.renderDealsSummaryStats(filtered);
        this.renderDeals(filtered);
      });
    }
  },

  bindDerivedToggle() {
    const btn = document.getElementById('toggleDerivedBtn');
    const table = document.getElementById('financialTable');
    const label = document.getElementById('toggleDerivedLabel');
    if (!btn || !table) return;
    btn.addEventListener('click', () => {
      table.classList.toggle('show-derived');
      const showing = table.classList.contains('show-derived');
      btn.classList.toggle('active', showing);
      if (label) label.textContent = showing ? 'Hide Derived Metrics' : 'Show Derived Metrics';
    });
  },

  // ============================================================
  // NAVIGATION
  // ============================================================
  bindNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        if (!section) return;
        this.navigateTo(section);
        // Close sidebar on mobile
        document.getElementById('sidebar').classList.remove('open');
      });
    });
  },

  navigateTo(section) {
    this.currentSection = section;

    // Update nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-section="${section}"]`)?.classList.add('active');

    // Update sections
    document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`section-${section}`)?.classList.add('active');

    // Update breadcrumb
    const titles = {
      executive: 'Executive Snapshot',
      market: 'Market Pulse',
      financial: 'Financial Tracker',
      deals: 'Deals & Transactions',
      operational: 'Operational Intelligence',
      leadership: 'Leadership & Governance',
      competitive: 'Competitive Moves',
      news: 'News Intelligence',
      subsector: 'Sub-Sector Deep Dive',
      stakeholder: 'What This Means For...',
      watchlist: 'Watchlist & Signals',
      amvalue: 'A&M Value-Add',
    };
    document.getElementById('breadcrumbCurrent').textContent = titles[section] || section;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // ============================================================
  // HAMBURGER (Mobile)
  // ============================================================
  bindHamburger() {
    const btn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    if (btn && sidebar) {
      btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
  },

  // ============================================================
  // MODAL
  // ============================================================
  bindModal() {
    const overlay = document.getElementById('companyModal');
    const closeBtn = document.getElementById('modalClose');

    if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    if (overlay) overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') overlay?.classList.remove('active');
    });
  },

  showCompanyModal(companyId) {
    const c = DataUtils.getCompany(companyId);
    if (!c) return;

    const f = DATA.financials[companyId];
    const rating = DATA.performanceRatings[companyId];
    const ops = DATA.operationalMetrics;
    const ch = DATA.channelMix[companyId];
    const pm = DATA.productMix[companyId];
    const sent = DATA.sentimentScores[companyId];
    const qIdx = DataUtils.getQuarterIndexForPeriod(Filters.timePeriod);

    const ratingBadgeClass = rating.rating === 'Outperform' ? 'badge-outperform' : rating.rating === 'Inline' ? 'badge-inline' : rating.rating === 'N/A' ? 'badge-info' : 'badge-underperform';
    const ratingBadge = `<span class="badge ${ratingBadgeClass}">${rating.rating}</span>`;

    const revAt = DataUtils.getValueAt(companyId, 'revenue', qIdx);
    const revYoY = DataUtils.getYoYGrowthAt(companyId, 'revenue', qIdx);
    const ebitdaAt = DataUtils.getValueAt(companyId, 'ebitdaMargin', qIdx);
    const ebitdaYoY = DataUtils.getYoYGrowthAt(companyId, 'ebitdaMargin', qIdx);
    const roceAt = DataUtils.getValueAt(companyId, 'roce', qIdx);

    const html = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        ${ratingBadge}
        <span class="text-sm text-slate">${c.ticker} | ${c.subCategory}</span>
      </div>
      <p class="text-sm text-slate mb-4">${rating.reason}</p>

      <h4 class="mb-2">Key Financials (${DATA.quarters[qIdx]})</h4>
      <div class="grid-3 mb-4" style="gap:12px;">
        <div class="stat-card" style="padding:12px;">
          <div class="stat-card-label">Revenue</div>
          <div class="stat-card-value" style="font-size:1.3rem;">${revAt !== null ? '₹' + revAt + ' Cr' : 'N/A'}</div>
          <span class="stat-card-change ${parseFloat(revYoY)>=0?'positive':'negative'}">${revYoY}${revYoY !== 'N/A' ? '% YoY' : ''}</span>
        </div>
        <div class="stat-card" style="padding:12px;">
          <div class="stat-card-label">EBITDA Margin</div>
          <div class="stat-card-value" style="font-size:1.3rem;">${ebitdaAt !== null ? ebitdaAt + '%' : 'N/A'}</div>
          <span class="stat-card-change ${parseFloat(ebitdaYoY)>=0?'positive':'negative'}">${ebitdaYoY}${ebitdaYoY !== 'N/A' ? '% YoY' : ''}</span>
        </div>
        <div class="stat-card" style="padding:12px;">
          <div class="stat-card-label">ROCE</div>
          <div class="stat-card-value" style="font-size:1.3rem;">${roceAt !== null ? roceAt + '%' : 'N/A'}</div>
        </div>
      </div>

      <div style="border-radius:8px;padding:12px;margin-bottom:16px;border:1px solid var(--slate-200);">
      <h4 class="mb-2">Company Profile</h4>
      <table class="data-table mb-4">
        <tbody>
          <tr><td class="fw-600">Headquarters</td><td>${c.headquarters}</td></tr>
          <tr><td class="fw-600">Founded</td><td>${c.founded}</td></tr>
          <tr><td class="fw-600">Parent Company</td><td>${c.parentCompany}</td></tr>
          <tr><td class="fw-600">Employees</td><td>${DataUtils.formatNumber(c.employees)}</td></tr>
          <tr><td class="fw-600">Dealer Network</td><td>${c.dealerNetwork ? DataUtils.formatNumber(c.dealerNetwork) : 'N/A (OEM/ODM)'}</td></tr>
          <tr><td class="fw-600">Plants</td><td>${c.plants}</td></tr>
          <tr><td class="fw-600">Market Cap</td><td>${DataUtils.formatCurrency(c.marketCap)}</td></tr>
          <tr><td class="fw-600">Promoter Holding</td><td>${c.promoterHolding}%</td></tr>
          <tr><td class="fw-600">Export Revenue</td><td>${c.exportRevenuePct}%</td></tr>
          <tr><td class="fw-600">Key Products</td><td>${c.keyProducts.join(', ')}</td></tr>
        </tbody>
      </table>
      </div>

      <div style="border-radius:8px;padding:12px;margin-bottom:16px;border:1px solid var(--slate-200);">
      <h4 class="mb-2">Operational Metrics</h4>
      <table class="data-table mb-4">
        <tbody>
          <tr><td class="fw-600">Capacity Utilization</td><td class="mono">${ops.capacityUtilization[companyId]}%</td></tr>
          <tr><td class="fw-600">Localization</td><td class="mono">${ops.localizationPct[companyId]}%</td></tr>
          <tr><td class="fw-600">Contract Manufacturing</td><td class="mono">${ops.contractManufacturingPct[companyId]}%</td></tr>
          <tr><td class="fw-600">After-Sales Cost</td><td class="mono">${ops.afterSalesCostPct[companyId]}%</td></tr>
          <tr><td class="fw-600">Vendor Consolidation</td><td class="mono">${ops.vendorConsolidationIndex[companyId]}</td></tr>
          <tr><td class="fw-600">Import Dependency</td><td class="mono">${f.importDependency[qIdx] !== null ? f.importDependency[qIdx] + '%' : '-'}</td></tr>
          <tr><td class="fw-600">Warranty Cost</td><td class="mono">${f.warrantyPct[qIdx] !== null ? f.warrantyPct[qIdx] + '%' : '-'}</td></tr>
          <tr><td class="fw-600">Avg. Selling Price</td><td class="mono">${f.asp[qIdx] !== null ? '₹' + DataUtils.formatNumber(f.asp[qIdx]) : '-'}</td></tr>
        </tbody>
      </table>
      </div>

      <div style="border-radius:8px;padding:12px;margin-bottom:16px;border:1px solid var(--slate-200);">
      <h4 class="mb-2">Channel Mix</h4>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
        <span class="badge badge-info">GT ${ch.gt}%</span>
        <span class="badge badge-teal">MT ${ch.mt}%</span>
        <span class="badge" style="background:rgba(245,158,11,0.08);color:#F59E0B;border:1px solid rgba(245,158,11,0.2);">E-Com ${ch.ecommerce}%</span>
        <span class="badge badge-purple">D2C ${ch.d2c}%</span>
      </div>
      </div>

      <div style="border-radius:8px;padding:12px;margin-bottom:16px;border:1px solid var(--slate-200);">
      <h4 class="mb-2">Product Mix</h4>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
        <span class="badge badge-info">Premium ${pm.premium}%</span>
        <span class="badge" style="background:rgba(245,158,11,0.08);color:#F59E0B;border:1px solid rgba(245,158,11,0.2);">Mass ${pm.mass}%</span>
        <span class="badge" style="background:rgba(100,116,139,0.08);color:#64748B;border:1px solid rgba(100,116,139,0.2);">Economy ${pm.economy}%</span>
      </div>
      </div>

      <h4 class="mb-2">Earnings Quality Score</h4>
      <div style="display:flex;gap:16px;align-items:center;margin-bottom:16px;">
        <div style="text-align:center;">
          <div class="text-xs text-slate">Overall</div>
          <div class="fw-600 text-mono" style="font-size:1.3rem;color:${sent.overall !== null ? (sent.overall>=60?'var(--green)':sent.overall>=40?'var(--amber)':'var(--red)') : '#94A3B8'};">${sent.overall !== null ? sent.overall : 'N/A'}</div>
        </div>
        <div class="text-xs text-slate" style="max-width:200px;">Source: Sovrenn quarterly result tags (recency-weighted)</div>
      </div>

      ${this._renderAmEngagement(companyId, qIdx)}
    `;

    document.getElementById('modalCompanyName').textContent = c.name;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('companyModal').classList.add('active');
  },

  _renderAmEngagement(companyId, qIdx) {
    const signal = this._getAmSignal(companyId, qIdx);
    const ids = Filters.getFilteredCompanyIds();
    const med = this._getSectorMedians(ids, qIdx);

    const wc = DataUtils.getValueAt(companyId, 'workingCapDays', qIdx);
    const ebitda = DataUtils.getValueAt(companyId, 'ebitdaMargin', qIdx);
    const debt = DataUtils.getValueAt(companyId, 'netDebtEbitda', qIdx);
    const rev = DataUtils.getValueAt(companyId, 'revenue', qIdx);
    const yoy = parseFloat(DataUtils.getYoYGrowthAt(companyId, 'revenue', qIdx));
    const impDep = DATA.operationalMetrics.importDependency[companyId];

    const pitches = [];

    if (wc !== null && med.wcDays !== null && wc > med.wcDays) {
      const delta = wc - med.wcDays;
      const potential = rev ? Math.round(rev * delta / 365) : '?';
      pitches.push({ icon: '&#9200;', text: `<strong>Working capital optimization</strong> — ${wc} days vs sector median ${med.wcDays} days. Potential ~₹${potential} Cr cash release.` });
    }

    if (ebitda !== null && med.ebitda !== null && ebitda < med.ebitda) {
      const gap = (med.ebitda - ebitda).toFixed(1);
      const impact = rev ? Math.round(rev * parseFloat(gap) / 100) : '?';
      pitches.push({ icon: '&#9650;', text: `<strong>Margin improvement program</strong> — ${ebitda}% vs sector avg ${med.ebitda}%. ${gap}pp uplift = ~₹${impact} Cr EBITDA impact.` });
    }

    if (debt !== null && debt > 1.5) {
      pitches.push({ icon: '&#9888;', text: `<strong>Balance sheet restructuring</strong> — leverage at ${debt}x. De-leveraging roadmap and refinancing advisory.` });
    }

    if (!isNaN(yoy) && yoy > 15 && ebitda !== null && ebitda > 10) {
      pitches.push({ icon: '&#9733;', text: `<strong>Transaction advisory / CDD</strong> — strong growth profile (${yoy.toFixed(1)}% YoY, ${ebitda}% EBITDA) positions for PE interest.` });
    }

    if (impDep !== null && impDep > 30) {
      pitches.push({ icon: '&#9881;', text: `<strong>Supply chain de-risk</strong> — ${impDep}% import exposure. Localization roadmap + alternate supplier sourcing.` });
    }

    if (!pitches.length) {
      pitches.push({ icon: '&#128269;', text: `<strong>Monitor</strong> — No immediate intervention triggers. Continue tracking for emerging signals.` });
    }

    return `
      <div style="border-radius:8px;padding:14px;border:2px solid ${signal.color}30;background:${signal.color}08;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <span class="am-signal-dot" style="background:${signal.color};width:10px;height:10px;border-radius:50%;display:inline-block;"></span>
          <h4 style="margin:0;font-size:14px;">Potential A&M Engagement</h4>
          <span style="font-size:11px;font-weight:600;color:${signal.color};margin-left:auto;">${signal.label}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;">
          ${pitches.map(p => `<div style="display:flex;gap:8px;font-size:12px;color:var(--slate-600);line-height:1.5;">
            <span style="flex-shrink:0;">${p.icon}</span>
            <span>${p.text}</span>
          </div>`).join('')}
        </div>
      </div>
    `;
  },

  // ============================================================
  // RENDER ALL SECTIONS
  // ============================================================
  renderAllSections() {
    const filtered = Filters.getFilteredCompanyIds();
    const safe = (fn, name) => { try { fn(); } catch(e) { console.error('Render ' + name + ':', e); } };
    safe(() => this.renderExecutiveSnapshot(filtered), 'executiveSnapshot');
    safe(() => this.renderFinancialTable(filtered), 'financialTable');
    safe(() => this.renderHeatmap(filtered), 'heatmap');
    safe(() => this.renderOperationalTable(filtered), 'operationalTable');
    safe(() => this.renderMfgFootprint(filtered), 'mfgFootprint');
    safe(() => this.renderRetailFootprint(filtered), 'retailFootprint');
    safe(() => this.renderDealsSummaryStats(filtered), 'dealsSummaryStats');
    safe(() => this.renderDeals(filtered), 'deals');
    safe(() => this.renderLeadership(filtered), 'leadership');
    safe(() => this.renderLeadershipBadge(filtered), 'leadershipBadge');
    safe(() => this.renderCompetitiveMoves(filtered), 'competitiveMoves');
    safe(() => this.renderMarginLevers(), 'marginLevers');
    safe(() => this.renderStakeholderInsights(filtered), 'stakeholderInsights');
    safe(() => this.renderWatchlist(filtered), 'watchlist');
    safe(() => this.renderAmSummaryStats(filtered), 'amSummaryStats');
    safe(() => this.renderAmOpportunities(filtered), 'amOpportunities');
    safe(() => this.renderQuickStats(filtered), 'quickStats');
    safe(() => this.renderNewsFeed(filtered), 'newsFeed');
    safe(() => this.renderNewsBadge(filtered), 'newsBadge');
    // Market Pulse new sections
    safe(() => this.renderQ3EarningsCards(), 'q3Earnings');
    safe(() => this.renderCommodityOutlook(), 'commodityOutlook');
    safe(() => this.renderPolicyImpact(), 'policyImpact');
    safe(() => this.renderUrbanRural(), 'urbanRural');
  },

  // ============================================================
  // SECTION 1: EXECUTIVE SNAPSHOT
  // ============================================================
  renderExecutiveSnapshot(filteredIds) {
    const snap = DATA.executiveSnapshot;
    const kw = this._getFilterKeywords(filteredIds);

    // Bullets
    const bulletsEl = document.getElementById('snapshotBullets');
    if (bulletsEl) {
      if (!snap.bullets.length) { bulletsEl.innerHTML = this._emptyState('No executive insights available'); }
      else {
        const filtered = snap.bullets.filter(b => this._textMatchesFilter(b, kw));
        bulletsEl.innerHTML = filtered.length ? filtered.map(b => `<li>${b}</li>`).join('') : this._emptyState('No matching insights');
      }
    }

    // Themes
    const themesEl = document.getElementById('themesGrid');
    if (themesEl) {
      if (!snap.bigThemes.length) { themesEl.innerHTML = this._emptyState('No themes available'); }
      else {
        const filtered = snap.bigThemes.filter(t => this._textMatchesFilter(t, kw));
        themesEl.innerHTML = filtered.length ? filtered.map(t => `<div class="theme-card">${t}</div>`).join('') : this._emptyState();
      }
    }

    // Red flags
    const rfEl = document.getElementById('redFlagsContainer');
    if (rfEl) {
      if (!snap.redFlags.length) { rfEl.innerHTML = this._emptyState('No red flags available'); }
      else {
        const filtered = snap.redFlags.filter(f => this._textMatchesFilter(f.flag + ' ' + f.detail, kw));
        rfEl.innerHTML = filtered.length ? filtered.map(f => `
          <div class="red-flag-item">
            <div class="red-flag-severity" style="background:${DataUtils.getSeverityColor(f.severity)};"></div>
            <div class="red-flag-content">
              <div class="red-flag-title">${f.flag} <span class="badge badge-${f.severity==='High'?'underperform':f.severity==='Medium'?'inline':'outperform'}" style="margin-left:8px;">${f.severity}</span></div>
              <div class="red-flag-detail">${f.detail}</div>
            </div>
          </div>
        `).join('') : this._emptyState();
      }
    }

    // Confidence
    const confFill = document.getElementById('confidenceFill');
    const confScore = document.getElementById('confidenceScore');
    if (confFill) confFill.style.width = snap.confidenceScore + '%';
    if (confScore) confScore.textContent = snap.confidenceScore || '-';
  },

  renderQuickStats(filteredIds) {
    const el = document.getElementById('quickStatsRow');
    if (!el) return;

    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const totalCompanies = ids.length;
    const outperformers = ids.filter(id => DATA.performanceRatings[id]?.rating === 'Outperform').length;
    const kw = this._getFilterKeywords(ids);
    const filteredDeals = DATA.deals.filter(d => this._companyMatchesFilter(d.company + ' ' + (d.buyer || '') + ' ' + (d.target || ''), kw));
    const totalDeals = filteredDeals.length;
    const qIdx = DataUtils.getQuarterIndexForPeriod(Filters.timePeriod);
    const roceVals = ids.map(id => DataUtils.getValueAt(id, 'roce', qIdx)).filter(v => v !== null);
    const avgRoce = roceVals.length ? (roceVals.reduce((a, b) => a + b, 0) / roceVals.length).toFixed(1) : null;
    const ebitdaVals = ids.map(id => DataUtils.getValueAt(id, 'ebitdaMargin', qIdx)).filter(v => v !== null);
    const avgEbitda = ebitdaVals.length ? (ebitdaVals.reduce((a, b) => a + b, 0) / ebitdaVals.length).toFixed(1) : null;

    el.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-label">Companies Tracked</div>
        <div class="stat-card-value">${totalCompanies}</div>
        <span class="stat-card-change neutral">${totalCompanies === DATA.companies.length ? 'All Companies' : 'Filtered'}</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Outperformers</div>
        <div class="stat-card-value">${outperformers}</div>
        <span class="stat-card-change positive">${outperformers} of ${totalCompanies}</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Active Deals</div>
        <div class="stat-card-value">${totalDeals}</div>
        <span class="stat-card-change neutral">FY24-FY26</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Avg ROCE</div>
        <div class="stat-card-value">${avgRoce !== null ? avgRoce + '%' : '-'}</div>
        <span class="stat-card-change ${avgRoce !== null && parseFloat(avgRoce) >= 12 ? 'positive' : 'neutral'}">${avgRoce !== null ? 'Filtered set' : 'No data'}</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Avg EBITDA</div>
        <div class="stat-card-value">${avgEbitda !== null ? avgEbitda + '%' : '-'}</div>
        <span class="stat-card-change neutral">${avgEbitda !== null ? 'Filtered set' : 'No data'}</span>
      </div>
    `;
  },

  // ============================================================
  // SECTION 3: FINANCIAL TABLE
  // ============================================================
  renderFinancialTable(filteredIds) {
    const tbody = document.getElementById('financialTableBody');
    if (!tbody) return;

    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const qIdx = DataUtils.getQuarterIndexForPeriod(Filters.timePeriod);

    const fmt = (v, suffix) => v !== null && v !== undefined ? v + suffix : '-';
    const fmtCur = (v) => v !== null && v !== undefined ? DataUtils.formatCurrency(v) : '-';

    // Precompute sub-category revenue totals for market share
    const subCatRevTotals = {};
    ids.forEach(id => {
      const cat = DataUtils.getCompany(id).subCategory;
      const rev = DataUtils.getValueAt(id, 'revenue', qIdx) || 0;
      subCatRevTotals[cat] = (subCatRevTotals[cat] || 0) + rev;
    });

    // Sector volume growth for pricing power
    const volGrowth = DATA.marketPulse?.demandSignals?.volumeGrowth;
    const sectorVolGrowth = (volGrowth && volGrowth[qIdx] !== null) ? volGrowth[qIdx] : 7;

    // News counts per company for competitive intensity
    const newsCounts = {};
    if (typeof NEWS_DATA !== 'undefined') {
      NEWS_DATA.items.forEach(n => { newsCounts[n.companyId] = (newsCounts[n.companyId] || 0) + 1; });
    }

    tbody.innerHTML = ids.map(id => {
      const c = DataUtils.getCompany(id);
      const rev = DataUtils.getValueAt(id, 'revenue', qIdx);
      const yoy = DataUtils.getYoYGrowthAt(id, 'revenue', qIdx);
      const ebitda = DataUtils.getValueAt(id, 'ebitdaMargin', qIdx);
      const wc = DataUtils.getValueAt(id, 'workingCapDays', qIdx);
      const inv = DataUtils.getValueAt(id, 'inventoryDays', qIdx);
      const debt = DataUtils.getValueAt(id, 'netDebtEbitda', qIdx);
      const capex = DataUtils.getValueAt(id, 'capexIntensity', qIdx);
      const roce = DataUtils.getValueAt(id, 'roce', qIdx);
      const rating = DATA.performanceRatings[id];

      const yoyVal = parseFloat(yoy);
      const trendIcon = isNaN(yoyVal) ? '-' : yoyVal > 2 ? '<span class="trend-up">&#9650;</span>' : yoyVal < -2 ? '<span class="trend-down">&#9660;</span>' : '<span class="trend-flat">&#9654;</span>';
      const yoyClass = isNaN(yoyVal) ? '' : yoyVal >= 0 ? 'text-green' : 'text-red';
      const yoyDisplay = yoy === 'N/A' ? '-' : yoy + '%';

      const ratingClass = rating.rating === 'Outperform' ? 'badge-outperform' : rating.rating === 'Inline' ? 'badge-inline' : rating.rating === 'N/A' ? 'badge-info' : 'badge-underperform';

      // A&M Signal
      const signal = this._getAmSignal(id, qIdx);
      const signalHtml = `<span class="am-signal" title="${signal.tooltip}"><span class="am-signal-dot" style="background:${signal.color};"></span>${signal.label}</span>`;

      // Sparklines
      const revSparkline = rev !== null ? this._sparklineSvg(DATA.financials[id].revenue, qIdx) : '';
      const ebitdaSparkline = ebitda !== null ? this._sparklineSvg(DATA.financials[id].ebitdaMargin, qIdx) : '';

      // Derived: Market Share %
      const mktShare = (rev && subCatRevTotals[c.subCategory]) ? (rev / subCatRevTotals[c.subCategory] * 100).toFixed(1) : '-';

      // Derived: Pricing Power
      let pricingPower = '-';
      let ppClass = '';
      if (!isNaN(yoyVal)) {
        const pp = (yoyVal - sectorVolGrowth).toFixed(1);
        pricingPower = (pp >= 0 ? '+' : '') + pp + 'pp';
        ppClass = pp >= 0 ? 'text-green' : 'text-red';
      }

      // Derived: Competitive Intensity
      const newsCount = newsCounts[id] || 0;
      const compIntensity = rev ? (newsCount / (rev / 1000)).toFixed(1) : '-';

      return `<tr>
        <td>${signalHtml}</td>
        <td><span class="fw-600 text-navy">${c.name}</span></td>
        <td><span class="badge badge-info">${c.subCategory}</span></td>
        <td class="text-right mono"><span class="sparkline-cell">${fmtCur(rev)}${revSparkline}</span></td>
        <td class="text-right mono ${yoyClass}">${yoyDisplay}</td>
        <td class="text-right mono"><span class="sparkline-cell">${fmt(ebitda, '%')}${ebitdaSparkline}</span></td>
        <td class="text-right mono">${fmt(wc, '')}</td>
        <td class="text-right mono">${fmt(inv, '')}</td>
        <td class="text-right mono">${fmt(debt, 'x')}</td>
        <td class="text-right mono">${fmt(roce, '%')}</td>
        <td class="text-right mono">${fmt(capex, '%')}</td>
        <td><span class="badge ${ratingClass}">${rating.rating === 'N/A' ? '-' : rating.rating}</span></td>
        <td class="text-center">${trendIcon}</td>
        <td class="text-right mono derived-col">${mktShare}${mktShare !== '-' ? '%' : ''}</td>
        <td class="text-right mono derived-col ${ppClass}">${pricingPower}</td>
        <td class="text-right mono derived-col">${compIntensity}</td>
      </tr>`;
    }).join('');
  },

  // ============================================================
  // HEATMAP
  // ============================================================
  renderHeatmap(filteredIds) {
    const container = document.getElementById('heatmapContainer');
    if (!container) return;
    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const qIdx = DataUtils.getQuarterIndexForPeriod(Filters.timePeriod);

    const getHmClass = (value, metric) => {
      if (metric === 'wc' || metric === 'inv') {
        if (value <= 30) return 'hm-5';
        if (value <= 40) return 'hm-4';
        if (value <= 55) return 'hm-3';
        if (value <= 70) return 'hm-2';
        return 'hm-1';
      }
      return 'hm-3';
    };

    let html = `<table class="data-table heatmap-table">
      <thead><tr><th>Company</th><th>WC Days</th><th>Inv Days</th><th>WC Chg</th><th>Inv Chg</th></tr></thead><tbody>`;

    ids.forEach(id => {
      const c = DataUtils.getCompany(id);
      const wc = DataUtils.getValueAt(id, 'workingCapDays', qIdx);
      const inv = DataUtils.getValueAt(id, 'inventoryDays', qIdx);
      const wcChgRaw = DataUtils.getYoYGrowthAt(id, 'workingCapDays', qIdx);
      const invChgRaw = DataUtils.getYoYGrowthAt(id, 'inventoryDays', qIdx);
      const wcChg = parseFloat(wcChgRaw);
      const invChg = parseFloat(invChgRaw);

      html += `<tr>
        <td style="text-align:left;font-weight:600;">${c.name.split(' ')[0]}</td>
        <td class="${wc !== null ? getHmClass(wc, 'wc') : 'hm-3'}">${wc !== null ? wc : '-'}</td>
        <td class="${inv !== null ? getHmClass(inv, 'inv') : 'hm-3'}">${inv !== null ? inv : '-'}</td>
        <td class="${isNaN(wcChg) ? 'hm-3' : wcChg <= 0 ? 'hm-5' : 'hm-1'}">${isNaN(wcChg) ? '-' : (wcChg > 0 ? '+' : '') + wcChg + '%'}</td>
        <td class="${isNaN(invChg) ? 'hm-3' : invChg <= 0 ? 'hm-5' : 'hm-1'}">${isNaN(invChg) ? '-' : (invChg > 0 ? '+' : '') + invChg + '%'}</td>
      </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
  },

  // ============================================================
  // SECTION 4: DEALS
  // ============================================================
  // Helper: get Indian FY for a date string (YYYY-MM-DD)
  // Indian FY: Apr–Mar. FY2026 = Apr 2025 – Mar 2026
  _getDealFY(dateStr) {
    const d = new Date(dateStr);
    const month = d.getMonth(); // 0-indexed: 0=Jan, 3=Apr
    const year = d.getFullYear();
    return month >= 3 ? year + 1 : year; // Apr(3)+ → next FY, Jan-Mar → same year FY
  },

  // Helper: filter deals by company keywords AND FY dropdown
  _getFilteredDeals(filteredIds) {
    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const kw = this._getFilterKeywords(ids);
    let deals = DATA.deals.filter(d => this._companyMatchesFilter(d.company + ' ' + (d.buyer || '') + ' ' + (d.target || ''), kw));

    // Apply FY filter
    const fySelect = document.getElementById('dealFyFilter');
    if (fySelect && fySelect.value !== 'all') {
      const fy = parseInt(fySelect.value);
      deals = deals.filter(d => this._getDealFY(d.date) === fy);
    }
    return deals;
  },

  renderDealsSummaryStats(filteredIds) {
    const el = document.getElementById('dealsSummaryStats');
    if (!el) return;

    const dealsToShow = this._getFilteredDeals(filteredIds);

    const failedStatuses = ['Failed', 'Rejected', 'Bidders Withdrew', 'Withdrew', 'Shelved'];
    const activeDeals = dealsToShow.filter(d => !failedStatuses.includes(d.status));
    const failedCount = dealsToShow.length - activeDeals.length;

    const totalValue = activeDeals.reduce((sum, d) => sum + (d.dealSize || 0), 0);
    const maCount = dealsToShow.filter(d => ['M&A', 'Acquisition', 'Demerger', 'Divestiture'].includes(d.type)).length;
    const peCount = dealsToShow.filter(d => ['PE Investment', 'Strategic Investment', 'Strategic Stake', 'Stake Sale'].includes(d.type)).length;
    const multiples = activeDeals.map(d => parseFloat(d.valuationMultiple)).filter(v => !isNaN(v));
    const avgMultiple = multiples.length ? (multiples.reduce((a, b) => a + b, 0) / multiples.length).toFixed(1) : 'N/A';

    const failedTooltip = failedCount > 0
      ? `title="Excludes ${failedCount} failed/rejected/withdrawn deal(s) from value calculation"`
      : '';

    el.innerHTML = `
      <div class="stat-card" ${failedTooltip} style="cursor:${failedCount > 0 ? 'help' : 'default'};">
        <div class="stat-card-label">Total Deal Value</div>
        <div class="stat-card-value">${DataUtils.formatCurrency(totalValue)}</div>
        <span class="stat-card-change neutral">${activeDeals.length} of ${dealsToShow.length} Deals${failedCount > 0 ? ' (' + failedCount + ' failed excl.)' : ''}</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">M&A / Restructuring</div>
        <div class="stat-card-value">${maCount}</div>
        <span class="stat-card-change neutral">of ${dealsToShow.length} total</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">PE / Strategic</div>
        <div class="stat-card-value">${peCount}</div>
        <span class="stat-card-change neutral">Investments</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Avg Valuation Multiple</div>
        <div class="stat-card-value">${avgMultiple !== 'N/A' ? avgMultiple + 'x' : 'N/A'}</div>
        <span class="stat-card-change neutral">Revenue</span>
      </div>
    `;
  },

  renderDeals(filteredIds) {
    const grid = document.getElementById('dealsGrid');
    if (!grid) return;

    const dealsToShow = this._getFilteredDeals(filteredIds);

    if (!dealsToShow.length) { grid.innerHTML = this._emptyState(); return; }

    const typeColors = {
      'M&A': 'badge-info', 'Acquisition': 'badge-info',
      'PE Investment': 'badge-purple', 'Strategic Investment': 'badge-purple',
      'Strategic Stake': 'badge-teal', 'Stake Sale': 'badge-teal',
      'IPO': 'badge-outperform', 'QIP': 'badge-outperform', 'Fund Raise': 'badge-outperform',
      'Land Allotment': 'badge-teal',
      'Buyback': 'badge-inline', 'Demerger': 'badge-inline', 'Divestiture': 'badge-inline',
      'JV': 'badge-info',
      'Govt Incentive': 'badge-outperform',
      'Capex': 'badge-teal',
      'Corporate Action': 'badge-inline'
    };

    grid.innerHTML = dealsToShow.map(d => {
      const sourceLink = d.sourceUrl
        ? `<a href="${d.sourceUrl}" target="_blank" rel="noopener noreferrer" style="color:var(--intelligence-blue);text-decoration:none;font-size:11px;">${d.sourceName || 'Source'} &#8599;</a>`
        : '';
      return `
        <div class="deal-card">
          <div class="deal-card-header">
            <span class="deal-type-badge badge ${typeColors[d.type] || 'badge-info'}">${d.type}</span>
            <span class="deal-date">${d.date}</span>
          </div>
          <div class="deal-company">${d.company}</div>
          <div class="deal-target">Target: ${d.target} | Status: ${d.status}</div>
          <div class="deal-metrics">
            <div class="deal-metric">
              <span class="deal-metric-label">Deal Size</span>
              <span class="deal-metric-value">${d.dealSize !== null ? '₹' + d.dealSize.toLocaleString('en-IN') + ' Cr' : 'Undisclosed'}</span>
            </div>
            <div class="deal-metric">
              <span class="deal-metric-label">Valuation</span>
              <span class="deal-metric-value">${d.valuationMultiple}</span>
            </div>
            <div class="deal-metric">
              <span class="deal-metric-label">Buyer</span>
              <span class="deal-metric-value">${d.buyer}</span>
            </div>
          </div>
          <div class="deal-rationale">${d.rationale}</div>
          <div style="margin-top:8px;text-align:right;">${sourceLink}</div>
        </div>
      `;
    }).join('');
  },

  // ============================================================
  // SECTION 5: OPERATIONAL TABLE
  // ============================================================
  renderOperationalTable(filteredIds) {
    const tbody = document.getElementById('operationalTableBody');
    if (!tbody) return;
    const ids = filteredIds || Filters.getFilteredCompanyIds();

    const fmtVal = (v, sfx) => v !== null && v !== undefined ? v + sfx : '-';
    tbody.innerHTML = ids.map(id => {
      const c = DataUtils.getCompany(id);
      const ops = DATA.operationalMetrics;
      // Read from operationalMetrics (populated from research) instead of financials
      const impDep = ops.importDependency ? ops.importDependency[id] : null;
      const warranty = ops.warrantyPct ? ops.warrantyPct[id] : null;
      const dealerProd = ops.dealerProductivity ? ops.dealerProductivity[id] : null;
      return `<tr>
        <td><span class="fw-600 text-navy">${c.name}</span></td>
        <td class="text-right mono">${fmtVal(ops.capacityUtilization[id], '%')}</td>
        <td class="text-right mono">${fmtVal(ops.localizationPct[id], '%')}</td>
        <td class="text-right mono">${fmtVal(ops.contractManufacturingPct[id], '%')}</td>
        <td class="text-right mono">${fmtVal(ops.afterSalesCostPct[id], '%')}</td>
        <td class="text-right mono">${fmtVal(impDep, '%')}</td>
        <td class="text-right mono">${fmtVal(ops.vendorConsolidationIndex[id], '')}</td>
        <td class="text-right mono">${fmtVal(warranty, '%')}</td>
        <td class="text-right mono">${dealerProd !== null ? '₹' + dealerProd + ' Cr' : '-'}</td>
      </tr>`;
    }).join('');
  },

  // ============================================================
  // SECTION 5: MANUFACTURING FOOTPRINT TABLE
  // ============================================================
  renderMfgFootprint(filteredIds) {
    const tbody = document.getElementById('mfgFootprintBody');
    if (!tbody) return;
    const ids = filteredIds || Filters.getFilteredCompanyIds();
    // Static data from operational-intelligence-data.md research
    const mfgData = {
      whirlpool: { plants: 3, capex: null, expansion: 'PG Electroplast contract mfg at Roorkee; 9 MW solar rooftop' },
      voltas: { plants: 4, capex: 100, expansion: 'Sanand facility (100% local fridge/WM); Chennai at 90% util.' },
      bluestar: { plants: 5, capex: 200, expansion: 'Sri City Phase 3: 1.2M→2.05M units. New Group CTO hired.' },
      crompton: { plants: 12, capex: 500, expansion: 'Rs 500 Cr capex FY25-27. 35M fans/yr, 55M lighting/yr.' },
      bajaj_elec: { plants: 4, capex: null, expansion: 'Chakan fan plant (400K/month). Post-demerger focus.' },
      vguard: { plants: 9, capex: null, expansion: '3 new factories 2025 (Vapi, Hyderabad x2). Sunflame integration.' },
      ifb: { plants: 3, capex: null, expansion: 'Washer capacity constrained. BLDC motors local production started.' },
      havells: { plants: 12, capex: 800, expansion: 'Rs 800 Cr Noida plant. Ghiloth fridge plant. Alwar cable expansion.' },
      symphony: { plants: 2, capex: null, expansion: '100% outsourced domestic (9 OEM partners). Export plants only.' },
      orient: { plants: 5, capex: null, expansion: 'New Hyderabad greenfield (May 2024). BLDC 45% target.' },
      dixon: { plants: 24, capex: 25000, expansion: '$2.7-3B display fab (8.6G). ECMS approvals. Vivo/Signify JVs.' },
      amber: { plants: 30, capex: 6785, expansion: 'YEIDA 100-acre facility. 27% India RAC footprint. ILJIN expansions.' },
      ttk_prestige: { plants: 5, capex: 500, expansion: 'Karjan triply cookware. Rs 500 Cr 3-year modernization plan.' },
      butterfly: { plants: 1, capex: null, expansion: 'Urappakkam: mixer upgraded 6K→9K units/day. Independent post-merger collapse.' },
      bosch_jch: { plants: 1, capex: null, expansion: 'Faridabad only. Restructuring under Bosch ownership.' },
    };
    tbody.innerHTML = ids.map(id => {
      const d = mfgData[id] || {};
      return `<tr>
        <td><span class="fw-600 text-navy">${DataUtils.getCompany(id).name.replace(' of India','').replace(' Greaves Consumer','')}</span></td>
        <td class="text-right mono">${d.plants || '-'}</td>
        <td class="text-right mono">${d.capex ? '₹' + d.capex.toLocaleString() : '-'}</td>
        <td style="font-size:12px;max-width:300px;">${d.expansion || '-'}</td>
      </tr>`;
    }).join('');
  },

  // ============================================================
  // SECTION 5: RETAIL FOOTPRINT TABLE
  // ============================================================
  renderRetailFootprint(filteredIds) {
    const tbody = document.getElementById('retailFootprintBody');
    if (!tbody) return;
    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const retailData = {
      whirlpool: { dealers: null, productivity: null, signal: 'Parent reducing stake to ~40%' },
      voltas: { dealers: '24,000+ touch points', productivity: 0.64, signal: 'Voltas Beko stores + D2C platform' },
      bluestar: { dealers: '3,000+ outlets', productivity: 4.0, signal: 'B2B projects + retail expansion' },
      crompton: { dealers: '236,000+ retail; 2,800+ dist.', productivity: 2.81, signal: '860+ service centres. BLDC driving premium retail.' },
      bajaj_elec: { dealers: '400,000+ retail; 1,000+ dist.', productivity: 4.83, signal: 'Morphy Richards brand integration' },
      vguard: { dealers: '18,000+', productivity: null, signal: 'Non-South now 48.4% revenue. New SCM head.' },
      ifb: { dealers: '300 COCOs + 180 franchise', productivity: 10.61, signal: 'Target 700+ stores. Premium experience focus.' },
      havells: { dealers: '248,000 retail; 18,000 dealers', productivity: 1.21, signal: '900+ Utsav stores. SmartHub. Rural Vistaar.' },
      symphony: { dealers: null, productivity: null, signal: '100% outsourced. Channel via OEM partners.' },
      orient: { dealers: '125,000 outlets', productivity: 0.02, signal: '450+ cities service. Exports +40% YoY.' },
      dixon: { dealers: 'B2B only', productivity: null, signal: 'OEM/ODM. No retail distribution.' },
      amber: { dealers: 'B2B only', productivity: null, signal: 'OEM/ODM. Clients: Voltas, Panasonic, Daikin, LG.' },
      ttk_prestige: { dealers: null, productivity: null, signal: 'GramyaHaat rural distribution investment.' },
      butterfly: { dealers: '17 branches', productivity: null, signal: 'New Head of Procurement (ex-Royal Enfield).' },
      bosch_jch: { dealers: null, productivity: null, signal: 'Restructuring under Bosch. Network being rebuilt.' },
    };
    tbody.innerHTML = ids.map(id => {
      const d = retailData[id] || {};
      return `<tr>
        <td><span class="fw-600 text-navy">${DataUtils.getCompany(id).name.replace(' of India','').replace(' Greaves Consumer','')}</span></td>
        <td class="text-right" style="font-size:12px;">${d.dealers || '-'}</td>
        <td class="text-right mono">${d.productivity !== null ? '₹' + d.productivity + ' Cr' : '-'}</td>
        <td style="font-size:12px;max-width:250px;">${d.signal || '-'}</td>
      </tr>`;
    }).join('');
  },

  // ============================================================
  // SECTION 2: MARKET PULSE — Q3 Earnings Cards
  // ============================================================
  renderQ3EarningsCards() {
    const container = document.getElementById('q3EarningsCards');
    if (!container) return;
    const data = DATA.marketPulse.q3Earnings;
    if (!data || !data.length) return;
    const signalColor = { positive: 'var(--green)', mixed: 'var(--amber)', negative: 'var(--red)', neutral: '#94A3B8' };
    container.innerHTML = data.map(e => `
      <div class="stat-card" style="border-top: 3px solid ${signalColor[e.signal] || '#94A3B8'};">
        <div class="stat-card-label">${e.company}</div>
        <div class="stat-card-value" style="font-size:1.1rem;">₹${e.revenue.toLocaleString()} Cr</div>
        <span class="stat-card-change ${e.yoyGrowth > 5 ? 'positive' : e.yoyGrowth < 0 ? 'negative' : 'neutral'}">${e.yoyGrowth > 0 ? '+' : ''}${e.yoyGrowth}% YoY</span>
        <div style="margin-top:6px;font-size:11px;color:var(--slate-400);">EBITDA: ${e.ebitdaMargin}%</div>
        <div style="margin-top:4px;font-size:11px;color:var(--slate-300);">${e.note}</div>
      </div>
    `).join('');
  },

  // ============================================================
  // SECTION 2: MARKET PULSE — Commodity Outlook Table
  // ============================================================
  renderCommodityOutlook() {
    const tbody = document.getElementById('commodityOutlookBody');
    if (!tbody) return;
    const data = DATA.marketPulse.commodityOutlook;
    if (!data || !data.length) return;
    const impactBadge = (imp) => {
      const color = imp === 'CRITICAL' ? '#EF4444' : imp === 'HIGH' ? '#F59E0B' : '#3B82F6';
      return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;color:#fff;background:${color};">${imp}</span>`;
    };
    // Cross-reference import dependency to generate A&M implications
    const impDep = DATA.operationalMetrics.importDependency;
    const getAmImplication = (commodity) => {
      const highImport = Object.entries(impDep)
        .filter(([, v]) => v >= 30)
        .map(([id]) => DataUtils.getCompany(id).name.split(' ')[0])
        .slice(0, 3);
      const highList = highImport.length ? highImport.join(', ') : 'multiple companies';
      if (commodity === 'Copper') return `Procurement advisory for high-import companies (${highList}). Hedging strategy + alternate supplier sourcing.`;
      if (commodity === 'Aluminum') return `Supply chain de-risk for AC/component makers. Localization acceleration opportunity.`;
      if (commodity === 'Steel') return `BoM cost optimization for white goods. Duty pass-through pricing advisory.`;
      if (commodity === 'INR/USD') return `FX hedging program design. Import substitution roadmap for companies at >${30}% import dependency.`;
      return 'Cost optimization advisory opportunity.';
    };
    tbody.innerHTML = data.map(c => `<tr>
      <td><span class="fw-600">${c.commodity}</span></td>
      <td class="mono" style="font-size:13px;">${c.forecast}</td>
      <td>${impactBadge(c.impact)}</td>
      <td style="font-size:12px;max-width:300px;">${c.detail}</td>
      <td style="font-size:12px;max-width:280px;color:var(--teal);"><strong style="color:var(--teal);">&#9654;</strong> ${getAmImplication(c.commodity)}</td>
      <td style="font-size:11px;color:var(--slate-400);">${c.source}</td>
    </tr>`).join('');
  },

  // ============================================================
  // SECTION 2: MARKET PULSE — Policy Impact Table
  // ============================================================
  renderPolicyImpact() {
    const tbody = document.getElementById('policyImpactBody');
    if (!tbody) return;
    const data = DATA.marketPulse.policyImpact;
    if (!data || !data.length) return;
    const impactBadge = (imp) => {
      const color = imp === 'positive' ? '#22C55E' : imp === 'negative' ? '#EF4444' : '#3B82F6';
      const label = imp === 'positive' ? '&#9650; Tailwind' : imp === 'negative' ? '&#9660; Headwind' : '&#8594; Neutral';
      return `<span style="color:${color};font-weight:600;font-size:12px;">${label}</span>`;
    };
    tbody.innerHTML = data.map(p => `<tr>
      <td><span class="fw-600" style="font-size:13px;">${p.policy}</span></td>
      <td style="font-size:12px;">${p.target}</td>
      <td>${impactBadge(p.impact)}</td>
      <td style="font-size:12px;max-width:350px;">${p.detail}</td>
    </tr>`).join('');
  },

  // ============================================================
  // SECTION 2: MARKET PULSE — Urban vs Rural Dynamics
  // ============================================================
  renderUrbanRural() {
    const container = document.getElementById('urbanRuralContainer');
    if (!container) return;
    const d = DATA.marketPulse.urbanRuralDynamics;
    if (!d) return;
    container.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div style="padding:12px;border-radius:8px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);">
          <div style="font-weight:600;font-size:13px;color:#22C55E;margin-bottom:6px;">&#9650; Urban Premium</div>
          <div style="font-size:12px;color:var(--slate-300);">Growth: <strong>${d.urbanPremiumGrowth}</strong></div>
          <div style="font-size:11px;color:var(--slate-400);margin-top:4px;">Frost-free, multi-door, inverter split ACs in Tier 1-2 cities</div>
        </div>
        <div style="padding:12px;border-radius:8px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15);">
          <div style="font-weight:600;font-size:13px;color:#EF4444;margin-bottom:6px;">&#9660; Rural Volume</div>
          <div style="font-size:12px;color:var(--slate-300);">Recovery: <strong>${d.ruralVolumeRecovery}</strong></div>
          <div style="font-size:11px;color:var(--slate-400);margin-top:4px;">Weather, farm income, essential inflation destroying discretionary power</div>
        </div>
      </div>
      <div style="margin-top:12px;padding:10px;border-radius:8px;background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.15);">
        <div style="font-weight:600;font-size:13px;color:#3B82F6;margin-bottom:6px;">&#127968; Home Improvement Boom</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;font-size:12px;">
          <div><span style="color:var(--slate-400);">Market Size:</span> <strong>${d.homeImprovementBoom.size}</strong></div>
          <div><span style="color:var(--slate-400);">CAGR:</span> <strong>${d.homeImprovementBoom.cagr}</strong></div>
          <div><span style="color:var(--slate-400);">Target 2030:</span> <strong>${d.homeImprovementBoom.target2030}</strong></div>
          <div><span style="color:var(--slate-400);">Smart Home:</span> <strong>${d.smartHomeDemand}</strong></div>
          <div><span style="color:var(--slate-400);">Modular:</span> <strong>${d.modularSolutions}</strong></div>
          <div><span style="color:var(--slate-400);">Reno Cycle:</span> <strong>${d.renovationCycle}</strong></div>
        </div>
      </div>
      <div style="margin-top:8px;font-size:11px;color:var(--slate-400);">Key insight: ${d.growthDriver}</div>
      <div style="margin-top:12px;padding:12px;border-radius:8px;background:rgba(13,148,136,0.06);border:1px solid rgba(13,148,136,0.2);">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
          <span style="font-weight:700;font-size:12px;color:var(--teal);">What A&M Published</span>
          <span class="badge" style="background:rgba(13,148,136,0.12);color:var(--teal);font-size:9px;border:1px solid rgba(13,148,136,0.25);">A&M Research</span>
        </div>
        <div style="font-size:12px;color:var(--slate-500);line-height:1.5;margin-bottom:6px;">
          <strong style="color:var(--slate-600);">The Reality Check India's Consumer Economy Needed</strong> &mdash;
          A&M's analysis highlights that India's consumer growth is price-hike and premiumization driven, not genuine volume expansion.
          Rural demand remains fragile; urban discretionary spending masks structural weakness in mass-market penetration.
        </div>
        <a href="https://www.alvarezandmarsal.com/thought-leadership/the-reality-check-india-s-consumer-economy-needed" target="_blank" rel="noopener noreferrer"
          style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:var(--teal);text-decoration:none;">
          Read Full Report &#8599;
        </a>
      </div>
    `;
  },

  // ============================================================
  // SECTION 6: LEADERSHIP
  // ============================================================
  renderLeadership(filteredIds) {
    const timeline = document.getElementById('leadershipTimeline');
    if (!timeline) return;

    if (!DATA.leadershipChanges.length) { timeline.innerHTML = this._emptyState('No leadership changes available'); return; }

    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const kw = this._getFilterKeywords(ids);
    const filtered = DATA.leadershipChanges.filter(lc => this._companyMatchesFilter(lc.company, kw));

    if (!filtered.length) { timeline.innerHTML = this._emptyState('No matching leadership changes'); return; }
    const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

    timeline.innerHTML = sorted.map(lc => {
      const dotColor = DataUtils.getSeverityColor(lc.riskLevel);
      return `
        <div class="timeline-item">
          <div class="timeline-dot" style="background:${dotColor};"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="timeline-company">${lc.company}</span>
              <span class="badge badge-${lc.riskLevel==='High'?'underperform':lc.riskLevel==='Medium'?'inline':'outperform'}">${lc.change}</span>
              <span class="timeline-date">${lc.date}</span>
            </div>
            <div class="timeline-detail">${lc.detail}</div>
            <div class="timeline-implication">Implication: ${lc.implication}</div>
          </div>
        </div>
      `;
    }).join('');
  },

  // ============================================================
  // SECTION 7: COMPETITIVE MOVES
  // ============================================================
  renderCompetitiveMoves(filteredIds) {
    const grid = document.getElementById('competitiveGrid');
    if (!grid) return;

    if (!DATA.competitiveMoves.length) { grid.innerHTML = this._emptyState('No competitive moves available'); return; }

    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const kw = this._getFilterKeywords(ids);
    const filtered = DATA.competitiveMoves.filter(m => this._companyMatchesFilter(m.company, kw));

    if (!filtered.length) { grid.innerHTML = this._emptyState('No matching competitive moves'); return; }
    const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

    grid.innerHTML = sorted.map(m => {
      const impactClass = m.impact === 'High' ? 'impact-high' : m.impact === 'Medium' ? 'impact-medium' : 'impact-low';
      const typeColors = {
        'Product Launch': 'badge-info',
        'D2C Initiative': 'badge-purple',
        'Plant Expansion': 'badge-teal',
        'Partnership': 'badge-outperform',
        'Pricing Strategy': 'badge-inline',
      };
      return `
        <div class="move-card">
          <div class="move-card-header">
            <span class="badge ${typeColors[m.type] || 'badge-info'}">${m.type}</span>
            <span class="impact-badge ${impactClass}">${m.impact} Impact</span>
          </div>
          <div class="move-title">${m.title}</div>
          <div class="move-company">${m.company} &middot; ${m.date}</div>
          <div class="move-detail">${m.detail}</div>
        </div>
      `;
    }).join('');
  },

  // ============================================================
  // SECTION 8: MARGIN LEVERS
  // ============================================================
  renderMarginLevers() {
    const tbody = document.getElementById('marginLeversBody');
    if (!tbody) return;

    if (!DATA.subSectorDeepDive.marginLevers.length) {
      tbody.innerHTML = `<tr><td colspan="4">${this._emptyState('No margin lever data available')}</td></tr>`;
      return;
    }

    tbody.innerHTML = DATA.subSectorDeepDive.marginLevers.map(ml => {
      const diffColor = ml.difficulty === 'Low' ? 'text-green' : ml.difficulty === 'Medium' ? 'text-amber' : 'text-red';
      return `<tr>
        <td class="fw-600">${ml.lever}</td>
        <td class="mono text-teal fw-600">${ml.potentialImpact}</td>
        <td><span class="${diffColor} fw-600">${ml.difficulty}</span></td>
        <td class="text-slate">${ml.timeframe}</td>
      </tr>`;
    }).join('');
  },

  // ============================================================
  // SECTION 9: STAKEHOLDER INSIGHTS
  // ============================================================
  renderStakeholderInsights(filteredIds) {
    // Tabs — only bind once
    if (!this._stakeholderTabsBound) {
      document.querySelectorAll('#stakeholderTabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('#stakeholderTabs .tab').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
          tab.classList.add('active');
          document.getElementById(`tabcontent-${tab.dataset.tab}`)?.classList.add('active');
        });
      });
      this._stakeholderTabsBound = true;
    }

    const kw = this._getFilterKeywords(filteredIds);

    // Content — filter insights by company relevance
    const map = {
      pe: { el: 'insightsPe', data: DATA.stakeholderInsights.peInvestors },
      founders: { el: 'insightsFounders', data: DATA.stakeholderInsights.founderPromoters },
      coos: { el: 'insightsCoos', data: DATA.stakeholderInsights.coosCfos },
      supply: { el: 'insightsSupply', data: DATA.stakeholderInsights.supplyChainHeads },
    };

    Object.values(map).forEach(({ el, data }) => {
      const container = document.getElementById(el);
      if (container) {
        if (!data.length) { container.innerHTML = this._emptyState('No insights available'); return; }
        const filtered = data.filter(insight => this._textMatchesFilter(insight, kw));
        container.innerHTML = filtered.length ? filtered.map(insight => `<li>${insight}</li>`).join('') : this._emptyState('No matching insights');
      }
    });
  },

  // ============================================================
  // SECTION 10: WATCHLIST
  // ============================================================
  renderWatchlist(filteredIds) {
    const w = DATA.watchlist;
    const kw = this._getFilterKeywords(filteredIds);

    // Fundraises
    const frEl = document.getElementById('fundraisesList');
    if (frEl) {
      if (!w.likelyFundraises.length) { frEl.innerHTML = this._emptyState('No fundraise signals'); }
      else {
        const items = w.likelyFundraises.filter(f => this._companyMatchesFilter(f.company, kw));
        frEl.innerHTML = items.length ? items.map(f => `
          <div class="watchlist-item">
            <div class="watchlist-item-left">
              <div>
                <div class="watchlist-company">${f.company}</div>
                <div class="watchlist-signal">${f.type} | ${f.estimatedSize} | ${f.timeline}</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="probability-bar"><div class="probability-fill" style="width:${f.probability}%;background:${f.probability>=70?'var(--green)':'var(--amber)'}"></div></div>
              <span class="text-mono text-sm fw-600">${f.probability}%</span>
            </div>
          </div>
        `).join('') : this._emptyState();
      }
    }

    // Margin inflection
    const miEl = document.getElementById('inflectionList');
    if (miEl) {
      if (!w.marginInflectionCandidates.length) { miEl.innerHTML = this._emptyState('No inflection candidates'); }
      else {
        const items = w.marginInflectionCandidates.filter(m => this._companyMatchesFilter(m.company + ' ' + m.signal, kw));
        miEl.innerHTML = items.length ? items.map(m => `
          <div class="watchlist-item">
            <div class="watchlist-item-left">
              <div>
                <div class="watchlist-company">${m.company}</div>
                <div class="watchlist-signal">${m.signal}</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="probability-bar"><div class="probability-fill" style="width:${m.confidence}%;background:var(--teal)"></div></div>
              <span class="text-mono text-sm fw-600">${m.confidence}%</span>
            </div>
          </div>
        `).join('') : this._emptyState();
      }
    }

    // Consolidation targets
    const ctEl = document.getElementById('consolidationList');
    if (ctEl) {
      if (!w.consolidationTargets.length) { ctEl.innerHTML = this._emptyState('No consolidation targets'); }
      else {
        const items = w.consolidationTargets.filter(c => this._companyMatchesFilter(c.company + ' ' + c.signal, kw));
        ctEl.innerHTML = items.length ? items.map(c => `
          <div class="watchlist-item">
            <div class="watchlist-item-left">
              <div>
                <div class="watchlist-company">${c.company}</div>
                <div class="watchlist-signal">${c.signal}</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <div class="probability-bar"><div class="probability-fill" style="width:${c.probability}%;background:var(--amber)"></div></div>
              <span class="text-mono text-sm fw-600">${c.probability}%</span>
            </div>
          </div>
        `).join('') : this._emptyState();
      }
    }

    // Stress indicators
    const stEl = document.getElementById('stressList');
    if (stEl) {
      if (!w.stressIndicators.length) { stEl.innerHTML = this._emptyState('No stress indicators'); }
      else {
        const items = w.stressIndicators.filter(s => this._companyMatchesFilter(s.company, kw));
        stEl.innerHTML = items.length ? items.map(s => `
          <div class="watchlist-item" style="flex-direction:column;align-items:flex-start;">
            <div style="display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:8px;">
              <span class="watchlist-company">${s.company}</span>
              <span class="badge badge-${s.severity==='High'?'underperform':'inline'}">${s.severity} Severity</span>
            </div>
            <div class="stress-indicators">
              ${s.indicators.map(ind => `<span class="stress-tag">${ind}</span>`).join('')}
            </div>
          </div>
        `).join('') : this._emptyState();
      }
    }
  },

  // ============================================================
  // A&M VALUE-ADD
  // ============================================================
  renderAmSummaryStats(filteredIds) {
    const el = document.getElementById('amSummaryStats');
    if (!el) return;

    if (!DATA.amValueAdd.length) {
      el.innerHTML = `
        <div class="stat-card"><div class="stat-card-label">Opportunities Identified</div><div class="stat-card-value">-</div><span class="stat-card-change neutral">Awaiting source</span></div>
        <div class="stat-card"><div class="stat-card-label">High Urgency</div><div class="stat-card-value">-</div><span class="stat-card-change neutral">Awaiting source</span></div>
        <div class="stat-card"><div class="stat-card-label">Avg Confidence</div><div class="stat-card-value">-</div><span class="stat-card-change neutral">Awaiting source</span></div>
      `;
      return;
    }

    const kw = this._getFilterKeywords(filteredIds);
    const opps = DATA.amValueAdd.filter(o => this._textMatchesFilter(o.opportunity + ' ' + o.detail, kw));
    const totalOpps = opps.length;
    const highUrgency = opps.filter(o => o.urgency === 'High').length;
    const avgConfidence = totalOpps ? Math.round(opps.reduce((sum, o) => sum + o.confidence, 0) / totalOpps) : 0;

    el.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-label">Opportunities Identified</div>
        <div class="stat-card-value">${totalOpps}</div>
        <span class="stat-card-change neutral">Active pipeline</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">High Urgency</div>
        <div class="stat-card-value">${highUrgency}</div>
        <span class="stat-card-change ${highUrgency > 0 ? 'negative' : 'neutral'}">${highUrgency} of ${totalOpps}</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Avg Confidence</div>
        <div class="stat-card-value">${avgConfidence}%</div>
        <span class="stat-card-change ${avgConfidence >= 70 ? 'positive' : 'neutral'}">Across all opportunities</span>
      </div>
    `;
  },

  // ============================================================
  // NEWS INTELLIGENCE
  // ============================================================
  _getFilteredNews(filteredIds) {
    if (typeof NEWS_DATA === 'undefined') return [];
    const kw = this._getFilterKeywords(filteredIds);
    let items = NEWS_DATA.items.filter(n => this._companyMatchesFilter(n.company, kw));

    // Tier filter
    const tierFilter = document.getElementById('newsTierFilter');
    if (tierFilter && tierFilter.value !== 'all') {
      const tier = parseInt(tierFilter.value);
      items = items.filter(n => n.sourceTier === tier);
    }

    // Category filter
    const catFilter = document.getElementById('newsCategoryFilter');
    if (catFilter && catFilter.value !== 'all') {
      items = items.filter(n => n.category === catFilter.value);
    }

    return items;
  },

  renderNewsFeed(filteredIds) {
    const feed = document.getElementById('newsFeed');
    if (!feed) return;

    if (typeof NEWS_DATA === 'undefined' || !NEWS_DATA.items.length) {
      feed.innerHTML = this._emptyState('No news data available');
      return;
    }

    const items = this._getFilteredNews(filteredIds);
    const countLabel = document.getElementById('newsCountLabel');
    if (countLabel) countLabel.textContent = items.length + ' items';

    if (!items.length) { feed.innerHTML = this._emptyState('No matching news items'); return; }

    const tierColors = { 1: '#22C55E', 2: '#3B82F6', 3: '#F59E0B', 4: '#EF4444' };
    const tierLabels = { 1: 'T1', 2: 'T2', 3: 'T3', 4: 'T4' };

    feed.innerHTML = items.map(n => {
      const borderColor = tierColors[n.sourceTier] || '#94A3B8';
      const tierBadge = `<span class="badge" style="background:${borderColor}15;color:${borderColor};border:1px solid ${borderColor}33;font-size:10px;">${tierLabels[n.sourceTier]}</span>`;
      const catBadge = n.category ? `<span class="badge badge-info" style="font-size:10px;">${n.category}</span>` : '';
      const sourceLink = `<span style="font-size:11px;color:var(--slate-400);">${n.source}</span>`;
      const cxoHtml = n.cxoQuote
        ? `<div style="margin-top:8px;padding:8px 12px;background:rgba(59,130,246,0.04);border-left:3px solid var(--intelligence-blue);border-radius:0 6px 6px 0;font-size:12px;color:var(--slate-600);font-style:italic;">${n.cxoQuote}</div>`
        : '';
      const implHtml = n.strategicImplication
        ? `<div style="margin-top:6px;font-size:12px;color:var(--slate-500);"><strong style="color:var(--slate-600);">Implication:</strong> ${n.strategicImplication}</div>`
        : '';

      return `
        <div class="news-item" style="border-left:4px solid ${borderColor};">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
            ${tierBadge} ${catBadge}
            <span style="font-size:12px;color:var(--slate-400);margin-left:auto;">${n.date}</span>
          </div>
          <div style="font-weight:600;font-size:0.9rem;color:var(--navy);margin-bottom:4px;">${n.title}</div>
          <div style="font-size:12px;color:var(--slate-500);margin-bottom:4px;">${n.company}</div>
          ${n.summary ? `<div style="font-size:13px;color:var(--slate-600);line-height:1.5;margin-bottom:6px;">${n.summary}</div>` : ''}
          ${cxoHtml}
          ${implHtml}
          <div style="margin-top:8px;text-align:right;">${sourceLink}</div>
        </div>
      `;
    }).join('');
  },

  renderNewsBadge(filteredIds) {
    const badge = document.getElementById('newsBadge');
    if (!badge) return;
    if (typeof NEWS_DATA === 'undefined') { badge.textContent = '0'; return; }
    const kw = this._getFilterKeywords(filteredIds);
    const count = NEWS_DATA.items.filter(n => this._companyMatchesFilter(n.company, kw)).length;
    badge.textContent = count;
  },

  renderLeadershipBadge(filteredIds) {
    const badge = document.getElementById('leadershipBadge');
    if (!badge) return;

    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const kw = this._getFilterKeywords(ids);
    const filtered = DATA.leadershipChanges.filter(lc => this._companyMatchesFilter(lc.company, kw));
    badge.textContent = filtered.length;
  },

  renderAmOpportunities(filteredIds) {
    const el = document.getElementById('amOpportunitiesList');
    if (!el) return;

    if (!DATA.amValueAdd.length) { el.innerHTML = this._emptyState('No advisory opportunities available'); return; }

    const kw = this._getFilterKeywords(filteredIds);
    const filtered = DATA.amValueAdd.filter(o => this._textMatchesFilter(o.opportunity + ' ' + o.detail, kw));

    if (!filtered.length) { el.innerHTML = this._emptyState('No matching opportunities'); return; }

    el.innerHTML = filtered.map(opp => {
      const urgencyClass = opp.urgency === 'High' ? 'badge-underperform' : 'badge-inline';
      return `
        <div class="am-opportunity">
          <div class="am-opportunity-header">
            <div>
              <div class="am-opportunity-title">${opp.opportunity}</div>
              <div class="text-xs text-slate mt-2">${opp.type}</div>
            </div>
            <div class="am-opportunity-value">${opp.estimatedValue}</div>
          </div>
          <div class="am-opportunity-detail">${opp.detail}</div>
          <div class="am-opportunity-meta">
            <span class="badge ${urgencyClass}">${opp.urgency} Urgency</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <span class="text-xs text-slate">Confidence</span>
              <div class="probability-bar" style="width:100px;"><div class="probability-fill" style="width:${opp.confidence}%;"></div></div>
              <span class="text-mono text-sm fw-600">${opp.confidence}%</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },
};

// ============================================================
// INITIALIZE
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
