/*
 * Charts Module — Chart.js Visualizations
 * Following Kompete color scheme
 */

const CHART_COLORS = [
  '#3B82F6','#0D9488','#F59E0B','#9333EA','#EF4444',
  '#22C55E','#EC4899','#8B5CF6','#06B6D4','#F97316',
];

const chartDefaults = {
  font: { family: "'Inter', system-ui, sans-serif", size: 11 },
  color: '#64748B',
};

Chart.defaults.font.family = chartDefaults.font.family;
Chart.defaults.font.size = chartDefaults.font.size;
Chart.defaults.color = chartDefaults.color;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyleWidth = 8;
Chart.defaults.plugins.legend.labels.padding = 16;
Chart.defaults.elements.line.tension = 0.3;
Chart.defaults.elements.point.radius = 2;
Chart.defaults.elements.point.hoverRadius = 5;

const chartInstances = {};

function destroyChart(key) {
  if (chartInstances[key]) {
    chartInstances[key].destroy();
    delete chartInstances[key];
  }
}

const Charts = {

  // ============================================================
  // MARKET PULSE CHARTS
  // ============================================================
  renderDemandChart() {
    destroyChart('demand');
    const ctx = document.getElementById('chartDemand');
    if (!ctx) return;
    chartInstances.demand = new Chart(ctx, {
      type: 'line',
      data: {
        labels: DATA.quarters,
        datasets: [
          {
            label: 'Volume Growth %',
            data: DATA.marketPulse.demandSignals.volumeGrowth,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59,130,246,0.08)',
            fill: true,
            borderWidth: 2,
          },
          {
            label: 'Price Growth %',
            data: DATA.marketPulse.demandSignals.priceGrowth,
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245,158,11,0.08)',
            fill: true,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%' } },
          x: { grid: { display: false } },
        },
      },
    });
  },

  renderInputCostsChart() {
    destroyChart('inputCosts');
    const ctx = document.getElementById('chartInputCosts');
    if (!ctx) return;
    const d = DATA.marketPulse.inputCosts;
    chartInstances.inputCosts = new Chart(ctx, {
      type: 'line',
      data: {
        labels: DATA.quarters,
        datasets: [
          { label: 'Copper', data: d.copper, borderColor: '#EF4444', borderWidth: 2 },
          { label: 'Steel', data: d.steel, borderColor: '#3B82F6', borderWidth: 2 },
          { label: 'Plastics', data: d.plastic, borderColor: '#9333EA', borderWidth: 2 },
          { label: 'Logistics', data: d.logistics, borderColor: '#F59E0B', borderWidth: 2 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' } },
          x: { grid: { display: false } },
        },
      },
    });
  },

  renderMarginBandsChart() {
    destroyChart('marginBands');
    const ctx = document.getElementById('chartMarginBands');
    if (!ctx) return;
    const m = DATA.marketPulse.marginOutlook;
    chartInstances.marginBands = new Chart(ctx, {
      type: 'line',
      data: {
        labels: DATA.quarters,
        datasets: [
          {
            label: 'Top Quartile',
            data: m.topQuartile,
            borderColor: '#22C55E',
            backgroundColor: 'rgba(34,197,94,0.06)',
            fill: '+1',
            borderWidth: 2,
          },
          {
            label: 'Sector Average',
            data: m.sectorAvgEbitda,
            borderColor: '#3B82F6',
            borderWidth: 2,
            borderDash: [5, 3],
          },
          {
            label: 'Bottom Quartile',
            data: m.bottomQuartile,
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239,68,68,0.06)',
            fill: '-1',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%' } },
          x: { grid: { display: false } },
        },
      },
    });
  },

  renderChannelMixChart(filteredCompanies) {
    destroyChart('channelMix');
    const ctx = document.getElementById('chartChannelMix');
    if (!ctx) return;
    const companies = filteredCompanies || DataUtils.getAllCompanyIds();
    const labels = companies.map(id => DataUtils.getCompany(id).name.replace(' of India','').replace(' Consumer','').replace(' Greaves','').replace(' Industries','').replace(' Electricals','').replace(' Electric',''));
    const gt = companies.map(id => DATA.channelMix[id].gt);
    const mt = companies.map(id => DATA.channelMix[id].mt);
    const ecom = companies.map(id => DATA.channelMix[id].ecommerce);
    const d2c = companies.map(id => DATA.channelMix[id].d2c);

    chartInstances.channelMix = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Gen. Trade', data: gt, backgroundColor: '#3B82F6' },
          { label: 'Modern Trade', data: mt, backgroundColor: '#0D9488' },
          { label: 'E-Commerce', data: ecom, backgroundColor: '#F59E0B' },
          { label: 'D2C', data: d2c, backgroundColor: '#9333EA' },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%' }, max: 100 },
        },
      },
    });
  },

  renderSeasonalChart() {
    destroyChart('seasonal');
    const ctx = document.getElementById('chartSeasonal');
    if (!ctx) return;
    const s = DATA.seasonalPatterns;
    chartInstances.seasonal = new Chart(ctx, {
      type: 'line',
      data: {
        labels: s.months,
        datasets: [
          { label: 'ACs', data: s.ac, borderColor: '#3B82F6', borderWidth: 2 },
          { label: 'Refrigerators', data: s.refrigerator, borderColor: '#0D9488', borderWidth: 2 },
          { label: 'Fans', data: s.fan, borderColor: '#F59E0B', borderWidth: 2 },
          { label: 'Water Heaters', data: s.waterHeater, borderColor: '#EF4444', borderWidth: 2 },
          { label: 'Air Coolers', data: s.airCooler, borderColor: '#9333EA', borderWidth: 2 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, title: { display: true, text: 'Index (100 = Avg)' } },
          x: { grid: { display: false } },
        },
      },
    });
  },

  // ============================================================
  // FINANCIAL TRACKER CHARTS
  // ============================================================
  renderRevenueTrendChart(filteredCompanies) {
    destroyChart('revenueTrend');
    const ctx = document.getElementById('chartRevenueTrend');
    if (!ctx) return;
    const companies = filteredCompanies || DataUtils.getAllCompanyIds();
    const datasets = companies.map((id, i) => ({
      label: DataUtils.getCompany(id).name.split(' ')[0],
      data: DATA.financials[id].revenue,
      borderColor: CHART_COLORS[i % CHART_COLORS.length],
      borderWidth: 1.5,
      pointRadius: 1,
    }));
    chartInstances.revenueTrend = new Chart(ctx, {
      type: 'line',
      data: { labels: DATA.quarters, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, title: { display: true, text: '₹ Cr' } },
          x: { grid: { display: false } },
        },
      },
    });
  },

  renderEbitdaTrendChart(filteredCompanies) {
    destroyChart('ebitdaTrend');
    const ctx = document.getElementById('chartEbitdaTrend');
    if (!ctx) return;
    const companies = filteredCompanies || DataUtils.getAllCompanyIds();
    const datasets = companies.map((id, i) => ({
      label: DataUtils.getCompany(id).name.split(' ')[0],
      data: DATA.financials[id].ebitdaMargin,
      borderColor: CHART_COLORS[i % CHART_COLORS.length],
      borderWidth: 1.5,
      pointRadius: 1,
    }));
    chartInstances.ebitdaTrend = new Chart(ctx, {
      type: 'line',
      data: { labels: DATA.quarters, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%' } },
          x: { grid: { display: false } },
        },
      },
    });
  },

  renderRoceChart(filteredCompanies) {
    destroyChart('roce');
    const ctx = document.getElementById('chartRoce');
    if (!ctx) return;
    const companies = filteredCompanies || DataUtils.getAllCompanyIds();
    const labels = companies.map(id => {
      const n = DataUtils.getCompany(id).name;
      return n.split(' ')[0];
    });
    const latestRoce = companies.map(id => DataUtils.getLatestValue(id, 'roce'));
    const colors = latestRoce.map(v => v >= 20 ? '#22C55E' : v >= 15 ? '#3B82F6' : v >= 10 ? '#F59E0B' : '#EF4444');

    chartInstances.roce = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'ROCE %',
          data: latestRoce,
          backgroundColor: colors,
          borderRadius: 4,
          barPercentage: 0.6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%' } },
          y: { grid: { display: false } },
        },
      },
    });
  },

  // ============================================================
  // OPERATIONAL CHARTS
  // ============================================================
  renderCapacityChart(filteredCompanies) {
    destroyChart('capacity');
    const ctx = document.getElementById('chartCapacity');
    if (!ctx) return;
    const companies = filteredCompanies || DataUtils.getAllCompanyIds();
    const labels = companies.map(id => DataUtils.getCompany(id).name.split(' ')[0]);
    chartInstances.capacity = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: companies.map((id, i) => ({
          label: labels[i],
          data: [{
            x: DATA.operationalMetrics.capacityUtilization[id],
            y: DATA.operationalMetrics.localizationPct[id],
          }],
          backgroundColor: CHART_COLORS[i],
          pointRadius: 8,
          pointHoverRadius: 12,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
        scales: {
          x: { title: { display: true, text: 'Capacity Utilization %' }, grid: { color: 'rgba(0,0,0,0.04)' }, min: 50, max: 95 },
          y: { title: { display: true, text: 'Localization %' }, grid: { color: 'rgba(0,0,0,0.04)' }, min: 50, max: 95 },
        },
      },
    });
  },

  renderProductMixChart(filteredCompanies) {
    destroyChart('productMix');
    const ctx = document.getElementById('chartProductMix');
    if (!ctx) return;
    const companies = filteredCompanies || DataUtils.getAllCompanyIds();
    const labels = companies.map(id => DataUtils.getCompany(id).name.split(' ')[0]);
    chartInstances.productMix = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Premium', data: companies.map(id => DATA.productMix[id].premium), backgroundColor: '#3B82F6' },
          { label: 'Mass', data: companies.map(id => DATA.productMix[id].mass), backgroundColor: '#F59E0B' },
          { label: 'Economy', data: companies.map(id => DATA.productMix[id].economy), backgroundColor: '#94A3B8' },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%' }, max: 100 },
        },
      },
    });
  },

  // ============================================================
  // LEADERSHIP & GOVERNANCE CHARTS
  // ============================================================
  renderPromoterChart(filteredCompanies) {
    destroyChart('promoter');
    const ctx = document.getElementById('chartPromoter');
    if (!ctx) return;
    const companies = filteredCompanies || DataUtils.getAllCompanyIds();
    const labels = companies.map(id => DataUtils.getCompany(id).name.split(' ')[0]);
    const holdings = companies.map(id => DataUtils.getCompany(id).promoterHolding);
    const colors = holdings.map(v => v >= 50 ? '#22C55E' : v >= 30 ? '#3B82F6' : v > 0 ? '#F59E0B' : '#94A3B8');

    chartInstances.promoter = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Promoter Holding %',
          data: holdings,
          backgroundColor: colors,
          borderRadius: 4,
          barPercentage: 0.6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%' }, max: 80 },
          x: { grid: { display: false } },
        },
      },
    });
  },

  renderSentimentChart(filteredCompanies) {
    destroyChart('sentiment');
    const ctx = document.getElementById('chartSentiment');
    if (!ctx) return;
    const companies = filteredCompanies || DataUtils.getAllCompanyIds();
    const labels = companies.map(id => DataUtils.getCompany(id).name.split(' ')[0]);
    chartInstances.sentiment = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'News', data: companies.map(id => DATA.sentimentScores[id].news), backgroundColor: '#3B82F6' },
          { label: 'Analyst', data: companies.map(id => DATA.sentimentScores[id].analyst), backgroundColor: '#0D9488' },
          { label: 'Social', data: companies.map(id => DATA.sentimentScores[id].social), backgroundColor: '#F59E0B' },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, max: 100 },
          x: { grid: { display: false } },
        },
      },
    });
  },

  // ============================================================
  // SUB-SECTOR DEEP DIVE CHARTS
  // ============================================================
  renderSegmentsChart() {
    destroyChart('segments');
    const ctx = document.getElementById('chartSegments');
    if (!ctx) return;
    const segs = DATA.subSectorDeepDive.segments;
    chartInstances.segments = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: segs.map(s => s.name),
        datasets: [
          {
            label: 'Market Size (₹ '000 Cr)',
            data: segs.map(s => s.size / 1000),
            backgroundColor: '#3B82F6',
            borderRadius: 4,
            yAxisID: 'y',
          },
          {
            label: 'Growth %',
            data: segs.map(s => s.growth),
            type: 'line',
            borderColor: '#EF4444',
            backgroundColor: '#EF4444',
            pointRadius: 5,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { position: 'left', grid: { color: 'rgba(0,0,0,0.04)' }, title: { display: true, text: '₹ \'000 Cr' } },
          y1: { position: 'right', grid: { display: false }, title: { display: true, text: 'Growth %' }, ticks: { callback: v => v + '%' } },
          x: { grid: { display: false } },
        },
      },
    });
  },

  renderCostBenchmarkChart() {
    destroyChart('costBenchmark');
    const ctx = document.getElementById('chartCostBenchmark');
    if (!ctx) return;
    const cb = DATA.subSectorDeepDive.costStructureBenchmark;
    const cats = Object.keys(cb);
    const labelsMap = { rawMaterials: 'Raw Materials', labor: 'Labor', logistics: 'Logistics', marketing: 'Marketing', overhead: 'Overhead' };

    chartInstances.costBenchmark = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cats.map(c => labelsMap[c]),
        datasets: [
          { label: 'Top Quartile', data: cats.map(c => cb[c].topQuartile), backgroundColor: '#22C55E', borderRadius: 4 },
          { label: 'Median', data: cats.map(c => cb[c].median), backgroundColor: '#3B82F6', borderRadius: 4 },
          { label: 'Bottom Quartile', data: cats.map(c => cb[c].bottomQuartile), backgroundColor: '#EF4444', borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%' } },
          x: { grid: { display: false } },
        },
      },
    });
  },

  renderScaleProfitChart(filteredCompanies) {
    destroyChart('scaleProfit');
    const ctx = document.getElementById('chartScaleProfit');
    if (!ctx) return;
    const companies = filteredCompanies || DataUtils.getAllCompanyIds();
    chartInstances.scaleProfit = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: companies.map((id, i) => {
          const rev = DataUtils.getLatestValue(id, 'revenue');
          const ebitda = DataUtils.getLatestValue(id, 'ebitdaMargin');
          const roce = DataUtils.getLatestValue(id, 'roce');
          return {
            label: DataUtils.getCompany(id).name.split(' ')[0],
            data: [{ x: rev, y: ebitda, r: Math.max(roce / 3, 4) }],
            backgroundColor: CHART_COLORS[i] + '99',
            borderColor: CHART_COLORS[i],
            borderWidth: 1,
          };
        }),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { font: { size: 10 } } },
          tooltip: {
            callbacks: {
              label: ctx => {
                const d = ctx.raw;
                return `${ctx.dataset.label}: Rev ₹${d.x} Cr, EBITDA ${d.y}%, ROCE ${(d.r * 3).toFixed(0)}%`;
              },
            },
          },
        },
        scales: {
          x: { title: { display: true, text: 'Revenue (₹ Cr)' }, grid: { color: 'rgba(0,0,0,0.04)' } },
          y: { title: { display: true, text: 'EBITDA Margin %' }, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%' } },
        },
      },
    });
  },

  // ============================================================
  // WATCHLIST — SENTIMENT RADAR
  // ============================================================
  renderSentimentRadar() {
    destroyChart('sentimentRadar');
    const ctx = document.getElementById('chartSentimentRadar');
    if (!ctx) return;
    const topCompanies = ['havells', 'bluestar', 'voltas', 'vguard', 'crompton'];
    const labels = topCompanies.map(id => DataUtils.getCompany(id).name.split(' ')[0]);
    chartInstances.sentimentRadar = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['News', 'Analyst', 'Social', 'Overall'],
        datasets: topCompanies.map((id, i) => ({
          label: labels[i],
          data: [
            DATA.sentimentScores[id].news,
            DATA.sentimentScores[id].analyst,
            DATA.sentimentScores[id].social,
            DATA.sentimentScores[id].overall,
          ],
          borderColor: CHART_COLORS[i],
          backgroundColor: CHART_COLORS[i] + '15',
          borderWidth: 2,
          pointRadius: 3,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { stepSize: 20, font: { size: 9 } },
            grid: { color: 'rgba(0,0,0,0.06)' },
          },
        },
        plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } },
      },
    });
  },

  // ============================================================
  // RENDER ALL
  // ============================================================
  renderAll(filteredCompanies) {
    this.renderDemandChart();
    this.renderInputCostsChart();
    this.renderMarginBandsChart();
    this.renderChannelMixChart(filteredCompanies);
    this.renderSeasonalChart();
    this.renderRevenueTrendChart(filteredCompanies);
    this.renderEbitdaTrendChart(filteredCompanies);
    this.renderRoceChart(filteredCompanies);
    this.renderCapacityChart(filteredCompanies);
    this.renderProductMixChart(filteredCompanies);
    this.renderPromoterChart(filteredCompanies);
    this.renderSentimentChart(filteredCompanies);
    this.renderSegmentsChart();
    this.renderCostBenchmarkChart();
    this.renderScaleProfitChart(filteredCompanies);
    this.renderSentimentRadar();
  },

  // Re-render charts that depend on filtered companies
  updateFiltered(filteredCompanies) {
    this.renderChannelMixChart(filteredCompanies);
    this.renderRevenueTrendChart(filteredCompanies);
    this.renderEbitdaTrendChart(filteredCompanies);
    this.renderRoceChart(filteredCompanies);
    this.renderCapacityChart(filteredCompanies);
    this.renderProductMixChart(filteredCompanies);
    this.renderPromoterChart(filteredCompanies);
    this.renderSentimentChart(filteredCompanies);
    this.renderScaleProfitChart(filteredCompanies);
  },
};
