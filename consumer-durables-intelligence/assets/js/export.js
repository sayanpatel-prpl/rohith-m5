/*
 * Export Module — PDF, Excel, PNG export capabilities
 * Uses jsPDF for PDF and SheetJS (xlsx) for Excel
 */

const ExportUtils = {

  init() {
    document.getElementById('exportPdfBtn')?.addEventListener('click', () => this.exportPDF());
    document.getElementById('exportExcelBtn')?.addEventListener('click', () => this.exportExcel());
  },

  // ============================================================
  // PDF EXPORT
  // ============================================================
  exportPDF() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      alert('PDF library not loaded. Please check your internet connection.');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let y = margin;

    // Helper: add text and manage page breaks
    const addText = (text, size, style, color, maxWidth) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style || 'normal');
      doc.setTextColor(...(color || [15, 31, 61]));
      const lines = doc.splitTextToSize(text, maxWidth || contentWidth);
      if (y + lines.length * (size * 0.5) > 280) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.45) + 2;
    };

    const addLine = () => {
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 4;
    };

    // Title Page
    doc.setFillColor(15, 31, 61);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Consumer Durables', margin, 25);
    doc.text('Intelligence Report', margin, 35);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('February 2026 | Prepared by Kompete Intelligence', margin, 48);
    y = 70;

    // Executive Snapshot
    doc.setTextColor(15, 31, 61);
    addText('Executive Snapshot', 16, 'bold');
    addLine();
    DATA.executiveSnapshot.bullets.forEach((b, i) => {
      addText(`${i + 1}. ${b}`, 9, 'normal', [51, 65, 85]);
    });

    y += 4;
    addText('Big Themes', 12, 'bold');
    DATA.executiveSnapshot.bigThemes.forEach(t => {
      addText(`• ${t}`, 9, 'normal', [51, 65, 85]);
    });

    y += 4;
    addText('Red Flags', 12, 'bold');
    DATA.executiveSnapshot.redFlags.forEach(f => {
      addText(`[${f.severity}] ${f.flag}: ${f.detail}`, 9, 'normal', f.severity === 'High' ? [239, 68, 68] : [245, 158, 11]);
    });

    // Financial Summary
    doc.addPage();
    y = margin;
    addText('Financial Performance Summary (Latest Quarter)', 16, 'bold');
    addLine();

    // Table header
    const colWidths = [40, 20, 18, 18, 18, 18, 18, 18, 18];
    const headers = ['Company', 'Rev ₹Cr', 'YoY %', 'EBITDA%', 'WC Days', 'Inv Days', 'Debt/E', 'ROCE%', 'Rating'];
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    let xPos = margin;
    headers.forEach((h, i) => {
      doc.text(h, xPos, y);
      xPos += colWidths[i];
    });
    y += 5;
    addLine();

    const filtered = Filters.getFilteredCompanyIds();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    filtered.forEach(id => {
      if (y > 275) { doc.addPage(); y = margin; }
      const c = DataUtils.getCompany(id);
      const rev = DataUtils.getLatestValue(id, 'revenue');
      const yoy = DataUtils.getYoYGrowth(id, 'revenue');
      const ebitda = DataUtils.getLatestValue(id, 'ebitdaMargin');
      const wc = DataUtils.getLatestValue(id, 'workingCapDays');
      const inv = DataUtils.getLatestValue(id, 'inventoryDays');
      const debt = DataUtils.getLatestValue(id, 'netDebtEbitda');
      const roce = DataUtils.getLatestValue(id, 'roce');
      const rating = DATA.performanceRatings[id].rating;

      doc.setTextColor(15, 31, 61);
      xPos = margin;
      const vals = [c.name.substring(0, 22), `${rev}`, `${yoy}%`, `${ebitda}%`, `${wc}`, `${inv}`, `${debt}x`, `${roce}%`, rating];
      vals.forEach((v, i) => {
        doc.text(v.toString(), xPos, y);
        xPos += colWidths[i];
      });
      y += 4;
    });

    // A&M Value Add
    doc.addPage();
    y = margin;
    addText('A&M Value-Add Opportunities', 16, 'bold');
    addLine();

    DATA.amValueAdd.forEach(opp => {
      addText(opp.opportunity, 11, 'bold');
      addText(`Type: ${opp.type} | Urgency: ${opp.urgency} | Confidence: ${opp.confidence}%`, 8, 'normal', [100, 116, 139]);
      addText(`Value: ${opp.estimatedValue}`, 9, 'bold', [13, 148, 136]);
      addText(opp.detail, 8, 'normal', [51, 65, 85]);
      y += 3;
    });

    // Footer on each page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('Consumer Durables Intelligence | Kompete by Kompete | Confidential', margin, 290);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, 290);
    }

    doc.save('Consumer_Durables_Intelligence_Feb2026.pdf');
  },

  // ============================================================
  // EXCEL EXPORT
  // ============================================================
  exportExcel() {
    if (!window.XLSX) {
      alert('Excel library not loaded. Please check your internet connection.');
      return;
    }

    const wb = XLSX.utils.book_new();
    const filtered = Filters.getFilteredCompanyIds();

    // Sheet 1: Financial Summary
    const financialData = filtered.map(id => {
      const c = DataUtils.getCompany(id);
      return {
        'Company': c.name,
        'Ticker': c.ticker,
        'Sub-Category': c.subCategory,
        'Market Cap (₹ Cr)': c.marketCap,
        'Revenue Latest (₹ Cr)': DataUtils.getLatestValue(id, 'revenue'),
        'YoY Revenue Growth %': parseFloat(DataUtils.getYoYGrowth(id, 'revenue')),
        'QoQ Revenue Growth %': parseFloat(DataUtils.getQoQGrowth(id, 'revenue')),
        'EBITDA Margin %': DataUtils.getLatestValue(id, 'ebitdaMargin'),
        'PAT Margin %': DataUtils.getLatestValue(id, 'patMargin'),
        'Working Capital Days': DataUtils.getLatestValue(id, 'workingCapDays'),
        'Inventory Days': DataUtils.getLatestValue(id, 'inventoryDays'),
        'Net Debt/EBITDA': DataUtils.getLatestValue(id, 'netDebtEbitda'),
        'Capex Intensity %': DataUtils.getLatestValue(id, 'capexIntensity'),
        'ROCE %': DataUtils.getLatestValue(id, 'roce'),
        'Performance Rating': DATA.performanceRatings[id].rating,
        'Rating Rationale': DATA.performanceRatings[id].reason,
      };
    });
    const ws1 = XLSX.utils.json_to_sheet(financialData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Financial Summary');

    // Sheet 2: Quarterly Revenue
    const quarterlyRevData = filtered.map(id => {
      const row = { Company: DataUtils.getCompany(id).name };
      DATA.quarters.forEach((q, i) => {
        row[q] = DATA.financials[id].revenue[i];
      });
      return row;
    });
    const ws2 = XLSX.utils.json_to_sheet(quarterlyRevData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Quarterly Revenue');

    // Sheet 3: Operational Metrics
    const opsData = filtered.map(id => {
      const c = DataUtils.getCompany(id);
      return {
        'Company': c.name,
        'Capacity Utilization %': DATA.operationalMetrics.capacityUtilization[id],
        'Localization %': DATA.operationalMetrics.localizationPct[id],
        'Contract Mfg %': DATA.operationalMetrics.contractManufacturingPct[id],
        'After-Sales Cost %': DATA.operationalMetrics.afterSalesCostPct[id],
        'Import Dependency %': DataUtils.getLatestValue(id, 'importDependency'),
        'Vendor Consolidation Index': DATA.operationalMetrics.vendorConsolidationIndex[id],
        'Warranty Cost %': DataUtils.getLatestValue(id, 'warrantyPct'),
        'Dealer Productivity (₹ Cr)': DataUtils.getLatestValue(id, 'dealerProductivity'),
        'Promoter Holding %': c.promoterHolding,
        'Export Revenue %': c.exportRevenuePct,
        'Dealer Network': c.dealerNetwork,
        'Plants': c.plants,
        'Employees': c.employees,
      };
    });
    const ws3 = XLSX.utils.json_to_sheet(opsData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Operational Metrics');

    // Sheet 4: Channel Mix
    const chData = filtered.map(id => {
      const c = DataUtils.getCompany(id);
      const ch = DATA.channelMix[id];
      return {
        'Company': c.name,
        'General Trade %': ch.gt,
        'Modern Trade %': ch.mt,
        'E-Commerce %': ch.ecommerce,
        'D2C %': ch.d2c,
        'B2B %': ch.b2b || 0,
      };
    });
    const ws4 = XLSX.utils.json_to_sheet(chData);
    XLSX.utils.book_append_sheet(wb, ws4, 'Channel Mix');

    // Sheet 5: Deals
    const dealsData = DATA.deals.map(d => ({
      'Date': d.date,
      'Type': d.type,
      'Company': d.company,
      'Target': d.target,
      'Deal Size (₹ Cr)': d.dealSize,
      'Valuation Multiple': d.valuationMultiple,
      'Buyer': d.buyer,
      'Status': d.status,
      'Rationale': d.rationale,
    }));
    const ws5 = XLSX.utils.json_to_sheet(dealsData);
    XLSX.utils.book_append_sheet(wb, ws5, 'Deals & Transactions');

    // Sheet 6: Sentiment
    const sentData = filtered.map(id => ({
      'Company': DataUtils.getCompany(id).name,
      'News Sentiment': DATA.sentimentScores[id].news,
      'Analyst Sentiment': DATA.sentimentScores[id].analyst,
      'Social Sentiment': DATA.sentimentScores[id].social,
      'Overall Sentiment': DATA.sentimentScores[id].overall,
    }));
    const ws6 = XLSX.utils.json_to_sheet(sentData);
    XLSX.utils.book_append_sheet(wb, ws6, 'Sentiment');

    XLSX.writeFile(wb, 'Consumer_Durables_Intelligence_Feb2026.xlsx');
  },

  // ============================================================
  // CHART PNG EXPORT (per chart)
  // ============================================================
  exportChartPNG(chartKey) {
    const instance = chartInstances[chartKey];
    if (!instance) return;
    const link = document.createElement('a');
    link.download = `chart_${chartKey}_${new Date().toISOString().slice(0,10)}.png`;
    link.href = instance.toBase64Image();
    link.click();
  },
};
