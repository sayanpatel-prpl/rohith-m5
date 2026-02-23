/**
 * Sovrenn Data Parser - ES Module version
 * Extracts structured intelligence from Sovrenn markdown files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class SovrennParser {
  static parseFile(filePath, companyId) {
    const content = fs.readFileSync(filePath, 'utf-8');

    return {
      companyId,
      companyName: this.extractCompanyName(content, companyId),
      description: this.extractDescription(content),
      clients: this.extractClients(content),
      keyGrowthTriggers: this.extractGrowthTriggers(content),
      quarterlyResults: this.extractQuarterlyResults(content),
      dealActivity: this.extractDealActivity(content),
      concallHighlights: this.extractConcallHighlights(content),
      shareholding: this.extractShareholding(content),
    };
  }

  static extractCompanyName(content, companyId) {
    const match = content.match(/\*\*Company Description:\*\* ([^\.]+)/);
    if (match) {
      return match[1].trim();
    }
    return companyId.charAt(0).toUpperCase() + companyId.slice(1);
  }

  static extractDescription(content) {
    const match = content.match(/\*\*Company Description:\*\* (.+?)(?=\n\n|\*\*)/s);
    return match ? match[1].trim() : '';
  }

  static extractClients(content) {
    const match = content.match(/\*\*Clients\*\*:\s*(.+?)(?=\n|$)/);
    if (!match) return [];

    return match[1]
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);
  }

  static extractGrowthTriggers(content) {
    const match = content.match(/\*\*Key Growth Triggers.*?\*\*:\s*\n([\s\S]+?)(?=\n\*\*|$)/);
    if (!match) return [];

    const triggerText = match[1];
    const triggers = [];

    const regex = /\d+\.(.+?)(?=\n\d+\.|$)/gs;
    let m;
    while ((m = regex.exec(triggerText)) !== null) {
      triggers.push(m[1].trim());
    }

    return triggers;
  }

  static extractQuarterlyResults(content) {
    const results = [];

    // Pattern 1: Amber format - **DATE:** (TAG) For the quarter ending QUARTER, Sales up/down X% YoY from INR Y Cr to INR Z Cr
    const regex1 = /\*\*(\d+\w+ \w+ \d{4}):\*\* (\([A-Z\s]+\) )?For the quarter ending ([A-Za-z0-9-]+), Sales (up|down) (\d+)% YoY from INR ([\d,]+) Cr.*?to INR ([\d,]+) Cr.*?Net Profit (up|down) (\d+)% from INR ([\d,]+) Cr to INR ([\d,]+) Cr.*?QoQ.*?Sales (up|down) (\d+)%.*?Net Profit (up|down) ([\d.x]+)/gi;

    let match;
    while ((match = regex1.exec(content)) !== null) {
      const [
        _, date, tagRaw, quarter,
        salesYoYDir, salesYoYPct, salesPrevYoY, salesCurrent,
        profitYoYDir, profitYoYPct, profitPrevYoY, profitCurrent,
        salesQoQDir, salesQoQPct, profitQoQDir, profitQoQPct
      ] = match;

      const tag = tagRaw ? tagRaw.replace(/[()]/g, '').trim() : null;

      results.push({
        date,
        quarter,
        salesCr: this.parseNumber(salesCurrent),
        salesGrowthYoY: (salesYoYDir === 'up' ? 1 : -1) * parseFloat(salesYoYPct),
        salesGrowthQoQ: (salesQoQDir === 'up' ? 1 : -1) * parseFloat(salesQoQPct),
        netProfitCr: this.parseNumber(profitCurrent),
        profitGrowthYoY: (profitYoYDir === 'up' ? 1 : -1) * parseFloat(profitYoYPct),
        profitGrowthQoQ: this.parseQoQGrowth(profitQoQDir, profitQoQPct),
        tag,
        rawText: match[0]
      });
    }

    // Pattern 2: Voltas/Bajaj format - **DATE:** (TAG) For the quarter ending QUARTER, Sales increased/decreased by X% from Y Cr to Z Cr
    const regex2 = /\*\*(\d+\w+ \w+ \d{4}):\*\* (\([A-Z\s]+\) )?For the quarter ending ([A-Za-z0-9'\s]+), Sales (increased|decreased) by ([\d.]+)% from ([\d,]+) Cr.*?to ([\d,]+) Cr.*?Net Profit (increased|decreased|from) (?:by ([\d.]+)% )?from ([\d,]+) Cr to ([\d,]+) Cr/gi;

    while ((match = regex2.exec(content)) !== null) {
      const [
        _, date, tagRaw, quarter,
        salesDir, salesPct, salesPrev, salesCurrent,
        profitDir, profitPct, profitPrev, profitCurrent
      ] = match;

      const tag = tagRaw ? tagRaw.replace(/[()]/g, '').trim() : null;

      results.push({
        date,
        quarter,
        salesCr: this.parseNumber(salesCurrent),
        salesGrowthYoY: (salesDir === 'increased' ? 1 : -1) * parseFloat(salesPct || '0'),
        salesGrowthQoQ: null,
        netProfitCr: this.parseNumber(profitCurrent),
        profitGrowthYoY: profitPct ? (profitDir === 'increased' ? 1 : -1) * parseFloat(profitPct) : null,
        profitGrowthQoQ: null,
        tag,
        rawText: match[0]
      });
    }

    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static extractDealActivity(content) {
    const deals = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const dateMatch = line.match(/^\*\*(\d+\w+ \w+ \d{4}):\*\* (.+)/);

      if (!dateMatch) continue;

      const [_, date, description] = dateMatch;
      const lowerDesc = description.toLowerCase();

      let type = 'other';
      if (lowerDesc.includes('acquire') || lowerDesc.includes('acquisition')) {
        type = 'acquisition';
      } else if (lowerDesc.includes('raise') || lowerDesc.includes('raised') || lowerDesc.includes('qip')) {
        type = lowerDesc.includes('qip') ? 'qip' : 'investment';
      } else if (lowerDesc.includes('ipo')) {
        type = 'ipo';
      } else if (lowerDesc.includes('partnership') || lowerDesc.includes('jv') || lowerDesc.includes('joint venture')) {
        type = 'partnership';
      }

      const valueMatch = description.match(/INR\s*([\d,]+)\s*Cr/i);
      const valueCr = valueMatch ? this.parseNumber(valueMatch[1]) : null;

      if (valueCr !== null || type === 'acquisition' || type === 'partnership') {
        deals.push({
          date,
          type,
          description: description.trim(),
          valueCr
        });
      }
    }

    return deals;
  }

  static extractConcallHighlights(content) {
    const concalls = [];

    const regex = /\*\*(\d+\w+ \w+ \d{4}):\*\* \(([QH]\d+FY\d+) Concall\)\s*\n([\s\S]+?)(?=\n\*\*|\n\n)/gi;

    let match;
    while ((match = regex.exec(content)) !== null) {
      const [_, date, quarter, pointsText] = match;

      const points = [];
      const pointRegex = /\d+\.(.+?)(?=\n\d+\.|\n\n|$)/gs;
      let pointMatch;

      while ((pointMatch = pointRegex.exec(pointsText)) !== null) {
        points.push(pointMatch[1].trim());
      }

      if (points.length > 0) {
        concalls.push({ date, quarter, points });
      }
    }

    return concalls;
  }

  static extractShareholding(content) {
    const holdings = [];

    const regex = /\*\*(\d+\w+ \w+ \d{4})\*\*:([^*]+(?:is holding|holds)\s+[\d.]+%[^.]*)/gi;

    let match;
    while ((match = regex.exec(content)) !== null) {
      const [_, date, text] = match;

      const holdingRegex = /([\w\s]+?)\s+(?:is holding|holds)\s+([\d.]+)%/gi;
      let holdingMatch;

      while ((holdingMatch = holdingRegex.exec(text)) !== null) {
        holdings.push({
          date,
          holder: holdingMatch[1].trim(),
          stake: parseFloat(holdingMatch[2])
        });
      }
    }

    return holdings;
  }

  static parseNumber(str) {
    return parseFloat(str.replace(/,/g, ''));
  }

  static parseQoQGrowth(direction, value) {
    if (value.includes('x')) {
      const multiplier = parseFloat(value.replace('x', ''));
      return (multiplier - 1) * 100;
    }
    return (direction === 'up' ? 1 : -1) * parseFloat(value);
  }
}

async function processAllSovrennFiles(dataSourcesDir) {
  const quarterlyReportsDir = path.join(dataSourcesDir, 'quarterly-reports');
  const companies = [];

  const companyDirs = fs.readdirSync(quarterlyReportsDir)
    .filter(name => {
      const fullPath = path.join(quarterlyReportsDir, name);
      return fs.statSync(fullPath).isDirectory();
    });

  for (const companyId of companyDirs) {
    const companyDir = path.join(quarterlyReportsDir, companyId);
    const files = fs.readdirSync(companyDir)
      .filter(f => f.endsWith('.md'));

    if (files.length === 0) {
      console.log(`⚠️  No markdown files found for ${companyId}`);
      continue;
    }

    const filePath = path.join(companyDir, files[0]);
    console.log(`✓ Parsing ${companyId} from ${files[0]}`);

    try {
      const intelligence = SovrennParser.parseFile(filePath, companyId);
      companies.push(intelligence);

      console.log(`  → Found ${intelligence.quarterlyResults.length} quarterly results`);
      console.log(`  → Found ${intelligence.dealActivity.length} deal activities`);
      console.log(`  → Found ${intelligence.concallHighlights.length} concall summaries`);
    } catch (error) {
      console.error(`❌ Error parsing ${companyId}:`, error.message);
    }
  }

  return companies;
}

// Run
const dataSourcesDir = path.join(__dirname, '..', '..', 'data-sources');

processAllSovrennFiles(dataSourcesDir).then(companies => {
  console.log(`\n✅ Processed ${companies.length} companies\n`);

  // Save to JSON
  const outputPath = path.join(dataSourcesDir, 'extracted', 'sovrenn-intelligence.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(companies, null, 2));

  console.log(`✅ Saved to ${outputPath}`);

  // Show summary
  companies.forEach(c => {
    console.log(`\n${c.companyName} (${c.companyId}):`);
    console.log(`  Clients: ${c.clients.join(', ') || 'None listed'}`);
    console.log(`  Quarterly Results: ${c.quarterlyResults.length}`);
    console.log(`  Deal Activity: ${c.dealActivity.length}`);
    console.log(`  Concall Highlights: ${c.concallHighlights.length}`);
  });
}).catch(console.error);
