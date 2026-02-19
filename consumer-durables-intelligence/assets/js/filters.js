/*
 * Filters Module — Interactive filtering system
 * Multi-select company dropdown, sub-category, performance, time period, revenue range
 */

const Filters = {
  selectedCompanies: new Set(DataUtils.getAllCompanyIds()),
  subCategory: 'all',
  performance: 'all',
  timePeriod: 'latest',
  revenueRange: 'all',

  init() {
    this.buildCompanyDropdown();
    this.bindEvents();
  },

  buildCompanyDropdown() {
    const dropdown = document.getElementById('companyFilterDropdown');
    if (!dropdown) return;

    // Select All option
    let html = `<div class="multi-select-option" data-id="__all">
      <input type="checkbox" checked id="chk_all"> <label for="chk_all" style="cursor:pointer;">Select All</label>
    </div>`;

    DATA.companies.forEach(c => {
      html += `<div class="multi-select-option" data-id="${c.id}">
        <input type="checkbox" checked id="chk_${c.id}"> <label for="chk_${c.id}" style="cursor:pointer;">${c.name}</label>
      </div>`;
    });
    dropdown.innerHTML = html;
  },

  bindEvents() {
    // Company multi-select toggle
    const trigger = document.getElementById('companyFilterTrigger');
    const dropdown = document.getElementById('companyFilterDropdown');

    if (trigger && dropdown) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const option = e.target.closest('.multi-select-option');
        if (!option) return;
        const id = option.dataset.id;
        const checkbox = option.querySelector('input[type="checkbox"]');

        if (id === '__all') {
          const checked = checkbox.checked;
          dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = checked);
          if (checked) {
            this.selectedCompanies = new Set(DataUtils.getAllCompanyIds());
          } else {
            this.selectedCompanies.clear();
          }
        } else {
          // Toggle if clicking the row (not checkbox directly)
          if (e.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
          }
          if (checkbox.checked) {
            this.selectedCompanies.add(id);
          } else {
            this.selectedCompanies.delete(id);
          }
          // Update select all state
          const allCheckbox = dropdown.querySelector('[data-id="__all"] input');
          allCheckbox.checked = this.selectedCompanies.size === DATA.companies.length;
        }

        this.updateTriggerLabel();
        this.applyFilters();
      });

      // Close on outside click
      document.addEventListener('click', () => dropdown.classList.remove('open'));
    }

    // Sub-category filter
    const subCatEl = document.getElementById('subCategoryFilter');
    if (subCatEl) subCatEl.addEventListener('change', () => {
      this.subCategory = subCatEl.value;
      this.applyFilters();
    });

    // Performance filter
    const perfEl = document.getElementById('performanceFilter');
    if (perfEl) perfEl.addEventListener('change', () => {
      this.performance = perfEl.value;
      this.applyFilters();
    });

    // Time period filter
    const timeEl = document.getElementById('timePeriodFilter');
    if (timeEl) timeEl.addEventListener('change', () => {
      this.timePeriod = timeEl.value;
      this.applyFilters();
    });

    // Revenue range filter
    const revEl = document.getElementById('revenueFilter');
    if (revEl) revEl.addEventListener('change', () => {
      this.revenueRange = revEl.value;
      this.applyFilters();
    });

    // Reset button
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetAll());
  },

  updateTriggerLabel() {
    const trigger = document.getElementById('companyFilterTrigger');
    if (!trigger) return;
    const count = this.selectedCompanies.size;
    const total = DATA.companies.length;
    if (count === total) {
      trigger.querySelector('span').textContent = `All Companies (${total})`;
    } else if (count === 0) {
      trigger.querySelector('span').textContent = 'No Companies Selected';
    } else {
      trigger.querySelector('span').textContent = `${count} Companies Selected`;
    }
  },

  getFilteredCompanyIds() {
    let ids = [...this.selectedCompanies];

    // Sub-category filter
    if (this.subCategory !== 'all') {
      ids = ids.filter(id => DataUtils.getCompany(id).subCategory === this.subCategory);
    }

    // Performance filter
    if (this.performance !== 'all') {
      ids = ids.filter(id => DATA.performanceRatings[id].rating === this.performance);
    }

    // Revenue range filter
    if (this.revenueRange !== 'all') {
      ids = ids.filter(id => {
        const annualRev = DataUtils.getAnnualRevenue(id, 'FY25') || DataUtils.getLatestValue(id, 'revenue') * 4;
        if (this.revenueRange === '5000+') return annualRev >= 5000;
        if (this.revenueRange === '2000-5000') return annualRev >= 2000 && annualRev < 5000;
        if (this.revenueRange === '0-2000') return annualRev < 2000;
        return true;
      });
    }

    return ids;
  },

  applyFilters() {
    const filtered = this.getFilteredCompanyIds();
    const safe = (fn, name) => { try { fn(); } catch(e) { console.error('Filter ' + name + ':', e); } };
    // Update all filter-dependent sections
    if (typeof App !== 'undefined') {
      safe(() => App.renderExecutiveSnapshot(filtered), 'executiveSnapshot');
      safe(() => App.renderQuickStats(filtered), 'quickStats');
      safe(() => App.renderFinancialTable(filtered), 'financialTable');
      safe(() => App.renderHeatmap(filtered), 'heatmap');
      safe(() => App.renderOperationalTable(filtered), 'operationalTable');
      safe(() => App.renderMfgFootprint(filtered), 'mfgFootprint');
      safe(() => App.renderRetailFootprint(filtered), 'retailFootprint');
      safe(() => App.renderDealsSummaryStats(filtered), 'dealsSummaryStats');
      safe(() => App.renderDeals(filtered), 'deals');
      safe(() => App.renderLeadership(filtered), 'leadership');
      safe(() => App.renderLeadershipBadge(filtered), 'leadershipBadge');
      safe(() => App.renderCompetitiveMoves(filtered), 'competitiveMoves');
      safe(() => App.renderStakeholderInsights(filtered), 'stakeholderInsights');
      safe(() => App.renderWatchlist(filtered), 'watchlist');
      safe(() => App.renderAmSummaryStats(filtered), 'amSummaryStats');
      safe(() => App.renderAmOpportunities(filtered), 'amOpportunities');
    }
    // Update charts
    safe(() => Charts.updateFiltered(filtered), 'charts');
    // Save to localStorage
    this.saveToLocalStorage();
  },

  resetAll() {
    this.selectedCompanies = new Set(DataUtils.getAllCompanyIds());
    this.subCategory = 'all';
    this.performance = 'all';
    this.timePeriod = 'latest';
    this.revenueRange = 'all';

    // Reset UI
    document.getElementById('subCategoryFilter').value = 'all';
    document.getElementById('performanceFilter').value = 'all';
    document.getElementById('timePeriodFilter').value = 'latest';
    document.getElementById('revenueFilter').value = 'all';

    const dropdown = document.getElementById('companyFilterDropdown');
    dropdown.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    this.updateTriggerLabel();
    this.applyFilters();
  },

  saveToLocalStorage() {
    try {
      localStorage.setItem('cdi_filters', JSON.stringify({
        companies: [...this.selectedCompanies],
        subCategory: this.subCategory,
        performance: this.performance,
        timePeriod: this.timePeriod,
        revenueRange: this.revenueRange,
      }));
    } catch (e) { /* ignore */ }
  },

  loadFromLocalStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem('cdi_filters'));
      if (!saved) return;
      this.selectedCompanies = new Set(saved.companies || DataUtils.getAllCompanyIds());
      this.subCategory = saved.subCategory || 'all';
      this.performance = saved.performance || 'all';
      this.timePeriod = saved.timePeriod || 'latest';
      this.revenueRange = saved.revenueRange || 'all';

      // Update UI
      document.getElementById('subCategoryFilter').value = this.subCategory;
      document.getElementById('performanceFilter').value = this.performance;
      document.getElementById('timePeriodFilter').value = this.timePeriod;
      document.getElementById('revenueFilter').value = this.revenueRange;

      const dropdown = document.getElementById('companyFilterDropdown');
      dropdown.querySelectorAll('.multi-select-option').forEach(opt => {
        const id = opt.dataset.id;
        const cb = opt.querySelector('input[type="checkbox"]');
        if (id === '__all') {
          cb.checked = this.selectedCompanies.size === DATA.companies.length;
        } else {
          cb.checked = this.selectedCompanies.has(id);
        }
      });
      this.updateTriggerLabel();
    } catch (e) { /* ignore */ }
  },
};
