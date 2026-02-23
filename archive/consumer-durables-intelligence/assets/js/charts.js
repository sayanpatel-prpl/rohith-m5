/*
 * Charts Module — Chart.js Visualizations
 * Following Kompete color scheme
 */

const CHART_COLORS = [
  '#3B82F6','#0D9488','#F59E0B','#9333EA','#EF4444',
  '#22C55E','#EC4899','#8B5CF6','#06B6D4','#F97316',
  '#14B8A6','#A855F7','#E11D48','#0EA5E9','#84CC16',
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

// Disable datalabels globally — only enable per-chart via plugins: [ChartDataLabels]
Chart.defaults.set('plugins.datalabels', { display: false });

const chartInstances = {};

// Trim leading empty quarters — find first index where ANY company has data
function trimLeadingNulls(companies, metric, start, end) {
  for (let q = start; q <= end; q++) {
    if (companies.some(id => DATA.financials[id][metric][q] !== null && DATA.financials[id][metric][q] !== undefined)) {
      return q;
    }
  }
  return start;
}

// Shared hover-highlight handler for multi-line trend charts
// Hovering a line → bold + full opacity; all others dim. Mouse out → restore.
function trendChartHoverHandler(event, elements, chart) {
  const datasets = chart.data.datasets;
  if (elements.length > 0) {
    const hoveredIdx = elements[0].datasetIndex;
    datasets.forEach((ds, i) => {
      ds.borderWidth = i === hoveredIdx ? 3 : 1.2;
      ds.borderColor = ds.baseColor + (i === hoveredIdx ? '' : '55');
      ds.pointRadius = i === hoveredIdx ? 3 : 0;
    });
  } else {
    datasets.forEach(ds => {
      ds.borderWidth = 1.5;
      ds.borderColor = ds.baseColor + '99';
      ds.pointRadius = 0;
    });
  }
  chart.update('none');
}

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
    const ds = DATA.marketPulse.demandSignals;
    const datasets = [];
    // Use sectorRevenueGrowthYoY as primary demand signal (real data)
    if (ds.sectorRevenueGrowthYoY) {
      datasets.push({
        label: 'Sector Revenue Growth YoY %',
        data: ds.sectorRevenueGrowthYoY,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59,130,246,0.08)',
        fill: true,
        borderWidth: 2,
        spanGaps: true,
      });
    }
    // Volume/price growth only if available (currently null)
    if (ds.volumeGrowth) {
      datasets.push({ label: 'Volume Growth %', data: ds.volumeGrowth, borderColor: '#22C55E', borderWidth: 2, spanGaps: true });
    }
    if (ds.priceGrowth) {
      datasets.push({ label: 'Price Growth %', data: ds.priceGrowth, borderColor: '#F59E0B', borderWidth: 2, spanGaps: true });
    }
    if (!datasets.length) { ctx.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94A3B8;">No demand signal data available</div>'; return; }
    // Find first quarter index with non-null data across all datasets
    let startIdx = 0;
    for (let i = 0; i < DATA.quarters.length; i++) {
      if (datasets.some(d => d.data[i] !== null && d.data[i] !== undefined)) { startIdx = i; break; }
    }
    const trimmedLabels = DATA.quarters.slice(startIdx);
    datasets.forEach(d => { d.data = d.data.slice(startIdx); });
    chartInstances.demand = new Chart(ctx, {
      type: 'line',
      data: { labels: trimmedLabels, datasets },
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
    // Check if any cost data is available
    if (!d.copper && !d.steel && !d.aluminum && !d.polymer) {
      ctx.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94A3B8;font-size:13px;text-align:center;padding:20px;">Input cost index data not available.<br>No commodity price tracking in source data.</div>';
      return;
    }
    const datasets = [];
    if (d.copper) datasets.push({ label: 'Copper', data: d.copper, borderColor: '#EF4444', borderWidth: 2.5 });
    if (d.steel) datasets.push({ label: 'Steel', data: d.steel, borderColor: '#3B82F6', borderWidth: 2 });
    if (d.aluminum) datasets.push({ label: 'Aluminum', data: d.aluminum, borderColor: '#9333EA', borderWidth: 2 });
    if (d.polymer) datasets.push({ label: 'Polymer', data: d.polymer, borderColor: '#F59E0B', borderWidth: 1.5, borderDash: [4,2] });
    chartInstances.inputCosts = new Chart(ctx, {
      type: 'line',
      data: { labels: DATA.quarters, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, title: { display: true, text: 'Index (Q1 FY23 = 100)' } },
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
    // Find first quarter index with non-null data
    let startIdx = 0;
    const allSeries = [m.topQuartile, m.sectorAvgEbitda, m.bottomQuartile];
    for (let i = 0; i < DATA.quarters.length; i++) {
      if (allSeries.some(s => s[i] !== null && s[i] !== undefined)) { startIdx = i; break; }
    }
    chartInstances.marginBands = new Chart(ctx, {
      type: 'line',
      data: {
        labels: DATA.quarters.slice(startIdx),
        datasets: [
          {
            label: 'Top Quartile',
            data: m.topQuartile.slice(startIdx),
            borderColor: '#22C55E',
            backgroundColor: 'rgba(34,197,94,0.06)',
            fill: '+1',
            borderWidth: 2,
          },
          {
            label: 'Sector Average',
            data: m.sectorAvgEbitda.slice(startIdx),
            borderColor: '#3B82F6',
            borderWidth: 2,
            borderDash: [5, 3],
          },
          {
            label: 'Bottom Quartile',
            data: m.bottomQuartile.slice(startIdx),
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
    const period = typeof Filters !== 'undefined' ? Filters.timePeriod : 'all';
    const [rangeStart, end] = DataUtils.getQuarterRangeForPeriod(period);
    const start = trimLeadingNulls(companies, 'revenue', rangeStart, end);
    const labels = DATA.quarters.slice(start, end + 1);

    const datasets = companies.map((id, i) => {
      const color = CHART_COLORS[i % CHART_COLORS.length];
      return {
        label: DataUtils.getCompany(id).name.split(' ')[0],
        data: DATA.financials[id].revenue.slice(start, end + 1),
        borderColor: color + '99',
        baseColor: color,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        spanGaps: true,
      };
    });

    // Compute Y-axis bounds from sliced data
    const allVals = companies.flatMap(id => DATA.financials[id].revenue.slice(start, end + 1).filter(v => v !== null));
    const dataMin = allVals.length ? Math.min(...allVals) : 0;
    const dataMax = allVals.length ? Math.max(...allVals) : 1000;
    const yMin = Math.max(0, Math.floor(dataMin * 0.8 / 100) * 100);
    const yMax = Math.ceil(dataMax * 1.1 / 100) * 100;

    chartInstances.revenueTrend = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'nearest', intersect: false },
        onHover: trendChartHoverHandler,
        plugins: {
          legend: { position: 'top', labels: { font: { size: 10 }, boxWidth: 12, padding: 8 } },
          tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ₹' + (ctx.parsed.y >= 1000 ? (ctx.parsed.y/1000).toFixed(1) + 'K' : ctx.parsed.y) + ' Cr' } },
        },
        scales: {
          y: {
            min: yMin,
            max: yMax,
            grid: { color: 'rgba(0,0,0,0.04)' },
            title: { display: true, text: '₹ Cr' },
            ticks: { callback: v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v },
          },
          x: {
            grid: {
              display: true,
              color: (ctx) => labels[ctx.index]?.startsWith('Q1') ? 'rgba(0,0,0,0.08)' : 'transparent',
              drawTicks: false,
            },
            ticks: {
              font: { size: 10 },
              maxRotation: 0,
              autoSkip: true,
              callback: function(value) { return this.getLabelForValue(value).replace(' FY', "'"); },
            },
          },
        },
      },
    });
  },

  renderEbitdaTrendChart(filteredCompanies) {
    destroyChart('ebitdaTrend');
    const ctx = document.getElementById('chartEbitdaTrend');
    if (!ctx) return;
    const companies = filteredCompanies || DataUtils.getAllCompanyIds();
    const period = typeof Filters !== 'undefined' ? Filters.timePeriod : 'all';
    const [rangeStart, end] = DataUtils.getQuarterRangeForPeriod(period);
    const start = trimLeadingNulls(companies, 'ebitdaMargin', rangeStart, end);
    const labels = DATA.quarters.slice(start, end + 1);

    const datasets = companies.map((id, i) => {
      const color = CHART_COLORS[i % CHART_COLORS.length];
      return {
        label: DataUtils.getCompany(id).name.split(' ')[0],
        data: DATA.financials[id].ebitdaMargin.slice(start, end + 1),
        borderColor: color + '99',
        baseColor: color,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        spanGaps: true,
      };
    });

    // Compute Y-axis bounds from sliced data
    const allVals = companies.flatMap(id => DATA.financials[id].ebitdaMargin.slice(start, end + 1).filter(v => v !== null));
    const dataMin = allVals.length ? Math.min(...allVals) : 0;
    const dataMax = allVals.length ? Math.max(...allVals) : 20;
    const yMin = Math.floor(dataMin - 2);
    const yMax = Math.ceil(dataMax + 2);

    chartInstances.ebitdaTrend = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'nearest', intersect: false },
        onHover: trendChartHoverHandler,
        plugins: {
          legend: { position: 'top', labels: { font: { size: 10 }, boxWidth: 12, padding: 8 } },
          tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y + '%' } },
        },
        scales: {
          y: {
            min: yMin,
            max: yMax,
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { callback: v => v + '%' },
          },
          x: {
            grid: {
              display: true,
              color: (ctx) => labels[ctx.index]?.startsWith('Q1') ? 'rgba(0,0,0,0.08)' : 'transparent',
              drawTicks: false,
            },
            ticks: {
              font: { size: 10 },
              maxRotation: 0,
              autoSkip: true,
              callback: function(value) { return this.getLabelForValue(value).replace(' FY', "'"); },
            },
          },
        },
      },
    });
  },

  renderRoceChart(filteredCompanies) {
    destroyChart('roce');
    const ctx = document.getElementById('chartRoce');
    if (!ctx) return;
    const allIds = filteredCompanies || DataUtils.getAllCompanyIds();
    const qIdx = DataUtils.getQuarterIndexForPeriod(typeof Filters !== 'undefined' ? Filters.timePeriod : 'latest');

    // Build pairs, filter nulls, sort descending
    const pairs = allIds
      .map(id => ({ id, val: DataUtils.getValueAt(id, 'roce', qIdx) }))
      .filter(p => p.val !== null)
      .sort((a, b) => b.val - a.val);

    const labels = pairs.map(p => DataUtils.getCompany(p.id).name.replace(/ of India| Consumer| Greaves| Industries| Electricals| Electric/g, ''));
    const values = pairs.map(p => p.val);
    const colors = values.map(v => v >= 25 ? '#16A34A' : v >= 18 ? '#22C55E' : v >= 15 ? '#3B82F6' : v >= 10 ? '#F59E0B' : '#EF4444');

    // Sector average
    const avg = values.length ? +(values.reduce((s, v) => s + v, 0) / values.length).toFixed(1) : 0;

    // Dynamic height: 36px per bar, minimum 200px
    const barHeight = 36;
    const chartHeight = Math.max(200, pairs.length * barHeight + 60);
    const container = ctx.parentElement;
    container.style.height = chartHeight + 'px';

    chartInstances.roce = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'ROCE %',
          data: values,
          backgroundColor: colors,
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        layout: { padding: { right: 40, left: 4 } },
        plugins: {
          legend: { display: false },
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'right',
            color: '#334155',
            font: { size: 11, weight: '600' },
            formatter: v => v + '%',
          },
          annotation: undefined,
          tooltip: {
            callbacks: {
              label: ctx => 'ROCE: ' + ctx.parsed.x + '%' + (ctx.parsed.x >= avg ? '  (above avg)' : '  (below avg)'),
              afterBody: () => 'Sector Avg: ' + avg + '%',
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { callback: v => v + '%', font: { size: 11 } },
            title: { display: true, text: 'ROCE %', font: { size: 12 } },
            beginAtZero: true,
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 12, weight: '500' }, padding: 6, crossAlign: 'far' },
          },
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

    // Quadrant labels plugin
    const quadrantPlugin = {
      id: 'quadrantLabels',
      beforeDraw(chart) {
        const { ctx: c, chartArea: { left, right, top, bottom }, scales: { x, y } } = chart;
        const midX = x.getPixelForValue(70);
        const midY = y.getPixelForValue(70);

        // Draw quadrant backgrounds
        c.save();
        // Bottom-Left: Restructuring (red)
        c.fillStyle = 'rgba(239,68,68,0.04)';
        c.fillRect(left, midY, midX - left, bottom - midY);
        // Bottom-Right: Import Risk (amber)
        c.fillStyle = 'rgba(245,158,11,0.04)';
        c.fillRect(midX, midY, right - midX, bottom - midY);
        // Top-Left: Underutilized (blue)
        c.fillStyle = 'rgba(59,130,246,0.04)';
        c.fillRect(left, top, midX - left, midY - top);
        // Top-Right: Operational Leaders (green)
        c.fillStyle = 'rgba(34,197,94,0.04)';
        c.fillRect(midX, top, right - midX, midY - top);

        // Draw quadrant labels
        c.font = 'italic 10px Inter, sans-serif';
        c.textAlign = 'center';
        const pad = 14;
        // Bottom-Left
        c.fillStyle = 'rgba(239,68,68,0.6)';
        c.fillText('Restructuring', (left + midX) / 2, bottom - pad);
        c.fillText('Candidates', (left + midX) / 2, bottom - pad + 12);
        // Bottom-Right
        c.fillStyle = 'rgba(245,158,11,0.6)';
        c.fillText('Import Risk', (midX + right) / 2, bottom - pad);
        // Top-Left
        c.fillStyle = 'rgba(59,130,246,0.6)';
        c.fillText('Underutilized', (left + midX) / 2, top + pad);
        c.fillText('Assets', (left + midX) / 2, top + pad + 12);
        // Top-Right
        c.fillStyle = 'rgba(34,197,94,0.6)';
        c.fillText('Operational', (midX + right) / 2, top + pad);
        c.fillText('Leaders', (midX + right) / 2, top + pad + 12);

        // Draw divider lines
        c.strokeStyle = 'rgba(100,116,139,0.2)';
        c.lineWidth = 1;
        c.setLineDash([4, 3]);
        c.beginPath();
        c.moveTo(midX, top);
        c.lineTo(midX, bottom);
        c.moveTo(left, midY);
        c.lineTo(right, midY);
        c.stroke();
        c.setLineDash([]);
        c.restore();
      },
    };

    chartInstances.capacity = new Chart(ctx, {
      type: 'scatter',
      plugins: [quadrantPlugin],
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
          x: { title: { display: true, text: 'Capacity Utilization %' }, grid: { color: 'rgba(0,0,0,0.04)' }, min: 45, max: 95 },
          y: { title: { display: true, text: 'Localization %' }, grid: { color: 'rgba(0,0,0,0.04)' }, min: 45, max: 95 },
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

  renderImportRiskChart(filteredCompanies) {
    destroyChart('importRisk');
    const ctx = document.getElementById('chartImportRisk');
    if (!ctx) return;
    const companies = filteredCompanies || DataUtils.getAllCompanyIds();
    const labels = companies.map(id => DataUtils.getCompany(id).name.split(' ')[0]);
    const impDep = companies.map(id => DATA.operationalMetrics.importDependency[id] || 0);
    // Color-code by risk: >35% red, >25% amber, <=25% green
    const colors = impDep.map(v => v > 35 ? '#EF4444' : v > 25 ? '#F59E0B' : '#22C55E');
    chartInstances.importRisk = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Import Dependency %',
          data: impDep,
          backgroundColor: colors,
          borderRadius: 4,
          barPercentage: 0.65,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: { anchor: 'end', align: 'end', formatter: v => v + '%', font: { size: 11, weight: 500 }, color: '#64748B' },
          annotation: {
            annotations: {
              riskLine: { type: 'line', xMin: 30, xMax: 30, borderColor: '#EF4444', borderWidth: 1.5, borderDash: [4,3], label: { display: true, content: 'High Risk (30%)', position: 'start', font: { size: 10 } } },
            },
          },
        },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%' }, max: 50 },
          y: { grid: { display: false } },
        },
      },
    });

    // Populate A&M insight below the chart
    const insightEl = document.getElementById('importRiskInsight');
    if (insightEl) {
      const aboveThreshold = companies.filter(id => (DATA.operationalMetrics.importDependency[id] || 0) > 30);
      const total = companies.length;
      const avgImp = impDep.length ? (impDep.reduce((a, b) => a + b, 0) / impDep.length).toFixed(1) : '0';
      const highRiskNames = aboveThreshold.map(id => DataUtils.getCompany(id).name.split(' ')[0]).join(', ');

      if (aboveThreshold.length > 0) {
        insightEl.innerHTML = `<strong style="color:var(--navy);">${aboveThreshold.length} of ${total} companies</strong> exceed the 30% import dependency threshold. Average exposure: <strong>${avgImp}%</strong>. A&M supply chain de-risking and localization advisory relevant for: <strong style="color:#EF4444;">${highRiskNames}</strong>.`;
      } else {
        insightEl.innerHTML = `All ${total} companies are below the 30% import dependency threshold. Average exposure: <strong>${avgImp}%</strong>. Sector in healthy localization range.`;
      }
    }
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
    // Filter to companies with sentiment data
    const withData = companies.filter(id => DATA.sentimentScores[id]?.overall !== null);
    if (!withData.length) { ctx.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94A3B8;">No sentiment data available</div>'; return; }
    const labels = withData.map(id => DataUtils.getCompany(id).name.split(' ')[0]);
    const values = withData.map(id => DATA.sentimentScores[id].overall);
    const colors = values.map(v => v >= 70 ? '#22C55E' : v >= 50 ? '#3B82F6' : v >= 35 ? '#F59E0B' : '#EF4444');
    chartInstances.sentiment = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Earnings Quality Score',
          data: values,
          backgroundColor: colors,
          borderRadius: 4,
          barPercentage: 0.7,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => 'Score: ' + ctx.parsed.y + '/100',
              afterBody: () => 'Source: Sovrenn quarterly result tags',
            },
          },
        },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, max: 100, min: 0, title: { display: true, text: 'Score (0-100)' } },
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
            label: 'Market Size (₹ 000 Cr)',
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
    // Filter to categories that have data (non-null)
    const allCats = ['totalExpenses', 'rawMaterials', 'employeeCost', 'otherExpenses'];
    const labelsMap = { totalExpenses: 'Total Expenses', rawMaterials: 'Raw Materials', employeeCost: 'Employee Cost', otherExpenses: 'Other Expenses' };
    const cats = allCats.filter(c => cb[c] !== null && cb[c] !== undefined);
    if (!cats.length) { ctx.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94A3B8;">No cost breakdown data available</div>'; return; }

    chartInstances.costBenchmark = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cats.map(c => labelsMap[c] || c),
        datasets: [
          { label: 'Best (Top Quartile OPM)', data: cats.map(c => cb[c].topQuartile), backgroundColor: '#22C55E', borderRadius: 4 },
          { label: 'Median', data: cats.map(c => cb[c].median), backgroundColor: '#3B82F6', borderRadius: 4 },
          { label: 'Worst (Bottom Quartile OPM)', data: cats.map(c => cb[c].bottomQuartile), backgroundColor: '#EF4444', borderRadius: 4 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y + '% of revenue' } },
        },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%' }, title: { display: true, text: '% of Revenue' } },
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
    const qIdx = DataUtils.getQuarterIndexForPeriod(typeof Filters !== 'undefined' ? Filters.timePeriod : 'latest');
    chartInstances.scaleProfit = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: companies.map((id, i) => {
          const rev = DataUtils.getValueAt(id, 'revenue', qIdx) || 0;
          const ebitda = DataUtils.getValueAt(id, 'ebitdaMargin', qIdx) || 0;
          const roce = DataUtils.getValueAt(id, 'roce', qIdx) || 12;
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
  renderSentimentRadar(filteredCompanies) {
    destroyChart('sentimentRadar');
    const ctx = document.getElementById('chartSentimentRadar');
    if (!ctx) return;
    // With only overall score available, render as horizontal bar chart sorted by score
    const allIds = filteredCompanies || DataUtils.getAllCompanyIds();
    const withData = allIds.filter(id => DATA.sentimentScores[id]?.overall !== null);
    if (!withData.length) { ctx.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94A3B8;">No sentiment data available</div>'; return; }
    const sorted = [...withData].sort((a, b) => (DATA.sentimentScores[b].overall || 0) - (DATA.sentimentScores[a].overall || 0));
    const labels = sorted.map(id => DataUtils.getCompany(id).name.split(' ')[0]);
    const values = sorted.map(id => DATA.sentimentScores[id].overall);
    const colors = values.map(v => v >= 70 ? '#22C55E' : v >= 50 ? '#3B82F6' : v >= 35 ? '#F59E0B' : '#EF4444');
    chartInstances.sentimentRadar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Earnings Quality',
          data: values,
          backgroundColor: colors,
          borderRadius: 4,
          barPercentage: 0.75,
          categoryPercentage: 0.85,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          datalabels: {
            display: true,
            anchor: 'end',
            align: 'right',
            color: '#334155',
            font: { size: 11, weight: '600' },
            formatter: v => v,
          },
          tooltip: { callbacks: { afterBody: () => 'Source: Sovrenn quarterly result tags' } },
        },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.05)' }, max: 100, min: 0, title: { display: true, text: 'Score (0-100)' } },
          y: { grid: { display: false }, ticks: { font: { size: 11 } } },
        },
      },
    });
  },

  // ============================================================
  // RENDER ALL
  // ============================================================
  renderAll(filteredCompanies) {
    const safe = (fn) => { try { fn(); } catch(e) { console.error('Chart error:', e); } };
    safe(() => this.renderDemandChart());
    safe(() => this.renderInputCostsChart());
    safe(() => this.renderMarginBandsChart());
    safe(() => this.renderChannelMixChart(filteredCompanies));
    safe(() => this.renderSeasonalChart());
    safe(() => this.renderRevenueTrendChart(filteredCompanies));
    safe(() => this.renderEbitdaTrendChart(filteredCompanies));
    safe(() => this.renderRoceChart(filteredCompanies));
    safe(() => this.renderCapacityChart(filteredCompanies));
    safe(() => this.renderProductMixChart(filteredCompanies));
    safe(() => this.renderImportRiskChart(filteredCompanies));
    safe(() => this.renderPromoterChart(filteredCompanies));
    safe(() => this.renderSentimentChart(filteredCompanies));
    safe(() => this.renderSegmentsChart());
    safe(() => this.renderCostBenchmarkChart());
    safe(() => this.renderScaleProfitChart(filteredCompanies));
    safe(() => this.renderSentimentRadar(filteredCompanies));
  },

  // Re-render charts that depend on filtered companies
  updateFiltered(filteredCompanies) {
    const safe = (fn) => { try { fn(); } catch(e) { console.error('Chart update error:', e); } };
    safe(() => this.renderChannelMixChart(filteredCompanies));
    safe(() => this.renderRevenueTrendChart(filteredCompanies));
    safe(() => this.renderEbitdaTrendChart(filteredCompanies));
    safe(() => this.renderRoceChart(filteredCompanies));
    safe(() => this.renderCapacityChart(filteredCompanies));
    safe(() => this.renderProductMixChart(filteredCompanies));
    safe(() => this.renderImportRiskChart(filteredCompanies));
    safe(() => this.renderPromoterChart(filteredCompanies));
    safe(() => this.renderSentimentChart(filteredCompanies));
    safe(() => this.renderScaleProfitChart(filteredCompanies));
    safe(() => this.renderSentimentRadar(filteredCompanies));
  },
};
