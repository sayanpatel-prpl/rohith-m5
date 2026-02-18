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

  // Helper: empty state — show nothing (section heading remains visible)
  _emptyState() {
    return '';
  },

  init() {
    this.bindNavigation();
    this.bindModal();
    this.bindHamburger();
    Filters.init();
    try { Filters.loadFromLocalStorage(); } catch(e) { console.warn('Filter load failed, resetting:', e); localStorage.removeItem('cdi_filters'); }
    ExportUtils.init();
    try { this.renderAllSections(); } catch(e) { console.error('renderAllSections error:', e); }
    try { Charts.renderAll(Filters.getFilteredCompanyIds()); } catch(e) { console.error('Charts.renderAll error:', e); }
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
    const latestIdx = DataUtils.getLatestQuarterIndex();

    const ratingBadge = `<span class="badge badge-${rating.rating.toLowerCase()}">${rating.rating}</span>`;

    const html = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        ${ratingBadge}
        <span class="text-sm text-slate">${c.ticker} | ${c.subCategory}</span>
      </div>
      <p class="text-sm text-slate mb-4">${rating.reason}</p>

      <h4 class="mb-2">Key Financials (${DATA.quarters[latestIdx]})</h4>
      <div class="grid-3 mb-4" style="gap:12px;">
        <div class="stat-card" style="padding:12px;">
          <div class="stat-card-label">Revenue</div>
          <div class="stat-card-value" style="font-size:1.3rem;">${DataUtils.getLatestValue(companyId,'revenue') !== null ? '₹' + DataUtils.getLatestValue(companyId,'revenue') + ' Cr' : 'N/A'}</div>
          <span class="stat-card-change ${parseFloat(DataUtils.getYoYGrowth(companyId,'revenue'))>=0?'positive':'negative'}">${DataUtils.getYoYGrowth(companyId,'revenue')}${DataUtils.getYoYGrowth(companyId,'revenue') !== 'N/A' ? '% YoY' : ''}</span>
        </div>
        <div class="stat-card" style="padding:12px;">
          <div class="stat-card-label">EBITDA Margin</div>
          <div class="stat-card-value" style="font-size:1.3rem;">${DataUtils.getLatestValue(companyId,'ebitdaMargin') !== null ? DataUtils.getLatestValue(companyId,'ebitdaMargin') + '%' : 'N/A'}</div>
          <span class="stat-card-change ${parseFloat(DataUtils.getYoYGrowth(companyId,'ebitdaMargin'))>=0?'positive':'negative'}">${DataUtils.getYoYGrowth(companyId,'ebitdaMargin')}${DataUtils.getYoYGrowth(companyId,'ebitdaMargin') !== 'N/A' ? '% YoY' : ''}</span>
        </div>
        <div class="stat-card" style="padding:12px;">
          <div class="stat-card-label">ROCE</div>
          <div class="stat-card-value" style="font-size:1.3rem;">${f.roce[latestIdx] !== null ? f.roce[latestIdx] + '%' : 'N/A'}</div>
        </div>
      </div>

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

      <h4 class="mb-2">Operational Metrics</h4>
      <table class="data-table mb-4">
        <tbody>
          <tr><td class="fw-600">Capacity Utilization</td><td class="mono">${ops.capacityUtilization[companyId]}%</td></tr>
          <tr><td class="fw-600">Localization</td><td class="mono">${ops.localizationPct[companyId]}%</td></tr>
          <tr><td class="fw-600">Contract Manufacturing</td><td class="mono">${ops.contractManufacturingPct[companyId]}%</td></tr>
          <tr><td class="fw-600">After-Sales Cost</td><td class="mono">${ops.afterSalesCostPct[companyId]}%</td></tr>
          <tr><td class="fw-600">Vendor Consolidation</td><td class="mono">${ops.vendorConsolidationIndex[companyId]}</td></tr>
          <tr><td class="fw-600">Import Dependency</td><td class="mono">${f.importDependency[latestIdx] !== null ? f.importDependency[latestIdx] + '%' : '-'}</td></tr>
          <tr><td class="fw-600">Warranty Cost</td><td class="mono">${f.warrantyPct[latestIdx] !== null ? f.warrantyPct[latestIdx] + '%' : '-'}</td></tr>
          <tr><td class="fw-600">Avg. Selling Price</td><td class="mono">${f.asp[latestIdx] !== null ? '₹' + DataUtils.formatNumber(f.asp[latestIdx]) : '-'}</td></tr>
        </tbody>
      </table>

      <h4 class="mb-2">Channel Mix</h4>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
        <span class="badge badge-info">GT ${ch.gt}%</span>
        <span class="badge badge-teal">MT ${ch.mt}%</span>
        <span class="badge" style="background:rgba(245,158,11,0.08);color:#F59E0B;border:1px solid rgba(245,158,11,0.2);">E-Com ${ch.ecommerce}%</span>
        <span class="badge badge-purple">D2C ${ch.d2c}%</span>
      </div>

      <h4 class="mb-2">Product Mix</h4>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
        <span class="badge badge-info">Premium ${pm.premium}%</span>
        <span class="badge" style="background:rgba(245,158,11,0.08);color:#F59E0B;border:1px solid rgba(245,158,11,0.2);">Mass ${pm.mass}%</span>
        <span class="badge" style="background:rgba(100,116,139,0.08);color:#64748B;border:1px solid rgba(100,116,139,0.2);">Economy ${pm.economy}%</span>
      </div>

      <h4 class="mb-2">Sentiment Scores</h4>
      <div style="display:flex;gap:16px;">
        <div style="text-align:center;"><div class="text-xs text-slate">News</div><div class="fw-600 text-mono" style="color:${sent.news>=60?'var(--green)':'var(--red)'};">${sent.news}</div></div>
        <div style="text-align:center;"><div class="text-xs text-slate">Analyst</div><div class="fw-600 text-mono" style="color:${sent.analyst>=60?'var(--green)':'var(--red)'};">${sent.analyst}</div></div>
        <div style="text-align:center;"><div class="text-xs text-slate">Social</div><div class="fw-600 text-mono" style="color:${sent.social>=60?'var(--green)':'var(--red)'};">${sent.social}</div></div>
        <div style="text-align:center;"><div class="text-xs text-slate">Overall</div><div class="fw-600 text-mono" style="color:${sent.overall>=60?'var(--green)':'var(--red)'};">${sent.overall}</div></div>
      </div>
    `;

    document.getElementById('modalCompanyName').textContent = c.name;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('companyModal').classList.add('active');
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
  },

  // ============================================================
  // SECTION 1: EXECUTIVE SNAPSHOT
  // ============================================================
  renderExecutiveSnapshot(filteredIds) {
    const snap = DATA.executiveSnapshot;
    const kw = this._getFilterKeywords(filteredIds);

    // Bullets — show those relevant to filtered companies or sector-wide
    const bulletsEl = document.getElementById('snapshotBullets');
    if (bulletsEl) {
      const filtered = snap.bullets.filter(b => this._textMatchesFilter(b, kw));
      bulletsEl.innerHTML = filtered.length ? filtered.map(b => `<li>${b}</li>`).join('') : '';
    }

    // Themes — show those relevant to filtered companies or sector-wide
    const themesEl = document.getElementById('themesGrid');
    if (themesEl) {
      const filtered = snap.bigThemes.filter(t => this._textMatchesFilter(t, kw));
      themesEl.innerHTML = filtered.length ? filtered.map(t => `<div class="theme-card">${t}</div>`).join('') : this._emptyState();
    }

    // Red flags — filter by detail text
    const rfEl = document.getElementById('redFlagsContainer');
    if (rfEl) {
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

    // Confidence
    const confFill = document.getElementById('confidenceFill');
    const confScore = document.getElementById('confidenceScore');
    if (confFill) confFill.style.width = snap.confidenceScore + '%';
    if (confScore) confScore.textContent = snap.confidenceScore;
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
    const roceVals = ids.map(id => DataUtils.getLatestValue(id, 'roce')).filter(v => v !== null);
    const avgRoce = roceVals.length ? (roceVals.reduce((a, b) => a + b, 0) / roceVals.length).toFixed(1) : 'N/A';
    const ebitdaVals = ids.map(id => DataUtils.getLatestValue(id, 'ebitdaMargin')).filter(v => v !== null);
    const avgEbitda = ebitdaVals.length ? (ebitdaVals.reduce((a, b) => a + b, 0) / ebitdaVals.length).toFixed(1) : 'N/A';

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
        <div class="stat-card-value">${avgRoce !== 'N/A' ? avgRoce + '%' : 'N/A'}</div>
        <span class="stat-card-change ${avgRoce !== 'N/A' && parseFloat(avgRoce) >= 12 ? 'positive' : 'neutral'}">${avgRoce !== 'N/A' ? 'Filtered set' : 'No data'}</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">Avg EBITDA</div>
        <div class="stat-card-value">${avgEbitda !== 'N/A' ? avgEbitda + '%' : 'N/A'}</div>
        <span class="stat-card-change neutral">${avgEbitda !== 'N/A' ? 'Filtered set' : 'No data'}</span>
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

    const fmt = (v, suffix) => v !== null && v !== undefined ? v + suffix : '-';
    const fmtCur = (v) => v !== null && v !== undefined ? DataUtils.formatCurrency(v) : '-';

    tbody.innerHTML = ids.map(id => {
      const c = DataUtils.getCompany(id);
      const rev = DataUtils.getLatestValue(id, 'revenue');
      const yoy = DataUtils.getYoYGrowth(id, 'revenue');
      const ebitda = DataUtils.getLatestValue(id, 'ebitdaMargin');
      const wc = DataUtils.getLatestValue(id, 'workingCapDays');
      const inv = DataUtils.getLatestValue(id, 'inventoryDays');
      const debt = DataUtils.getLatestValue(id, 'netDebtEbitda');
      const capex = DataUtils.getLatestValue(id, 'capexIntensity');
      const roce = DataUtils.getLatestValue(id, 'roce');
      const rating = DATA.performanceRatings[id];

      const yoyVal = parseFloat(yoy);
      const trendIcon = isNaN(yoyVal) ? '<span class="trend-flat">&#9654;</span>' : yoyVal > 2 ? '<span class="trend-up">&#9650;</span>' : yoyVal < -2 ? '<span class="trend-down">&#9660;</span>' : '<span class="trend-flat">&#9654;</span>';
      const yoyClass = isNaN(yoyVal) ? '' : yoyVal >= 0 ? 'text-green' : 'text-red';
      const yoyDisplay = yoy === 'N/A' ? 'N/A' : yoy + '%';

      const ratingClass = rating.rating === 'Outperform' ? 'badge-outperform' : rating.rating === 'Inline' ? 'badge-inline' : 'badge-underperform';

      return `<tr class="clickable" data-company="${id}">
        <td><span class="fw-600 text-navy">${c.name}</span></td>
        <td><span class="badge badge-info">${c.subCategory}</span></td>
        <td class="text-right mono">${fmtCur(rev)}</td>
        <td class="text-right mono ${yoyClass}">${yoyDisplay}</td>
        <td class="text-right mono">${fmt(ebitda, '%')}</td>
        <td class="text-right mono">${fmt(wc, '')}</td>
        <td class="text-right mono">${fmt(inv, '')}</td>
        <td class="text-right mono">${fmt(debt, 'x')}</td>
        <td class="text-right mono">${fmt(roce, '%')}</td>
        <td class="text-right mono">${fmt(capex, '%')}</td>
        <td><span class="badge ${ratingClass}">${rating.rating}</span></td>
        <td class="text-center">${trendIcon}</td>
      </tr>`;
    }).join('');

    // Bind click handlers for drill-down
    tbody.querySelectorAll('tr.clickable').forEach(tr => {
      tr.addEventListener('click', () => {
        this.showCompanyModal(tr.dataset.company);
      });
    });
  },

  // ============================================================
  // HEATMAP
  // ============================================================
  renderHeatmap(filteredIds) {
    const container = document.getElementById('heatmapContainer');
    if (!container) return;
    const ids = filteredIds || Filters.getFilteredCompanyIds();

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
      const wc = DataUtils.getLatestValue(id, 'workingCapDays');
      const inv = DataUtils.getLatestValue(id, 'inventoryDays');
      const wcChgRaw = DataUtils.getYoYGrowth(id, 'workingCapDays');
      const invChgRaw = DataUtils.getYoYGrowth(id, 'inventoryDays');
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
  renderDealsSummaryStats(filteredIds) {
    const el = document.getElementById('dealsSummaryStats');
    if (!el) return;

    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const kw = this._getFilterKeywords(ids);
    const dealsToShow = DATA.deals.filter(d => this._companyMatchesFilter(d.company + ' ' + (d.buyer || '') + ' ' + (d.target || ''), kw));

    const totalValue = dealsToShow.reduce((sum, d) => sum + d.dealSize, 0);
    const maCount = dealsToShow.filter(d => d.type === 'M&A').length;
    const multiples = dealsToShow.map(d => parseFloat(d.valuationMultiple)).filter(v => !isNaN(v));
    const avgMultiple = multiples.length ? (multiples.reduce((a, b) => a + b, 0) / multiples.length).toFixed(1) : 'N/A';

    el.innerHTML = `
      <div class="stat-card">
        <div class="stat-card-label">Total Deal Value</div>
        <div class="stat-card-value">${DataUtils.formatCurrency(totalValue)}</div>
        <span class="stat-card-change neutral">${dealsToShow.length} Deals</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">M&A Transactions</div>
        <div class="stat-card-value">${maCount}</div>
        <span class="stat-card-change neutral">of ${dealsToShow.length} total</span>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">PE / Strategic</div>
        <div class="stat-card-value">${dealsToShow.length - maCount}</div>
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

    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const kw = this._getFilterKeywords(ids);
    const dealsToShow = DATA.deals.filter(d => this._companyMatchesFilter(d.company + ' ' + (d.buyer || '') + ' ' + (d.target || ''), kw));

    if (!dealsToShow.length) { grid.innerHTML = this._emptyState(); return; }

    grid.innerHTML = dealsToShow.map(d => {
      const typeColors = { 'M&A': 'badge-info', 'PE Investment': 'badge-purple', 'Strategic Stake': 'badge-teal', 'IPO': 'badge-outperform' };
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
              <span class="deal-metric-value">₹${d.dealSize} Cr</span>
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
      const impDep = DataUtils.getLatestValue(id, 'importDependency');
      const warranty = DataUtils.getLatestValue(id, 'warrantyPct');
      const dealerProd = DataUtils.getLatestValue(id, 'dealerProductivity');
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
  // SECTION 6: LEADERSHIP
  // ============================================================
  renderLeadership(filteredIds) {
    const timeline = document.getElementById('leadershipTimeline');
    if (!timeline) return;

    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const kw = this._getFilterKeywords(ids);
    const filtered = DATA.leadershipChanges.filter(lc => this._companyMatchesFilter(lc.company, kw));

    if (!filtered.length) { timeline.innerHTML = this._emptyState(); return; }
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

    const ids = filteredIds || Filters.getFilteredCompanyIds();
    const kw = this._getFilterKeywords(ids);
    const filtered = DATA.competitiveMoves.filter(m => this._companyMatchesFilter(m.company, kw));

    if (!filtered.length) { grid.innerHTML = this._emptyState(); return; }
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
        const filtered = data.filter(insight => this._textMatchesFilter(insight, kw));
        container.innerHTML = filtered.length ? filtered.map(insight => `<li>${insight}</li>`).join('') : '';
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

    // Margin inflection
    const miEl = document.getElementById('inflectionList');
    if (miEl) {
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

    // Consolidation targets
    const ctEl = document.getElementById('consolidationList');
    if (ctEl) {
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

    // Stress indicators
    const stEl = document.getElementById('stressList');
    if (stEl) {
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
  },

  // ============================================================
  // A&M VALUE-ADD
  // ============================================================
  renderAmSummaryStats(filteredIds) {
    const el = document.getElementById('amSummaryStats');
    if (!el) return;

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

    const kw = this._getFilterKeywords(filteredIds);
    const filtered = DATA.amValueAdd.filter(o => this._textMatchesFilter(o.opportunity + ' ' + o.detail, kw));

    if (!filtered.length) { el.innerHTML = this._emptyState(); return; }

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
