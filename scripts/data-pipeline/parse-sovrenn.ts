/**
 * Sovrenn Data Parser
 *
 * Extracts structured financial and business intelligence data from
 * Sovrenn markdown files for the Industry Landscape Intelligence platform.
 */

import fs from 'fs';
import path from 'path';

interface QuarterlyResult {
  date: string;
  quarter: string; // e.g., "Q1FY26", "Mar-25"
  salesCr: number | null;
  salesGrowthYoY: number | null;
  salesGrowthQoQ: number | null;
  netProfitCr: number | null;
  profitGrowthYoY: number | null;
  profitGrowthQoQ: number | null;
  tag: string | null; // "EXCELLENT RESULTS", "GOOD RESULTS", etc.
  rawText: string;
}

interface DealActivity {
  date: string;
  type: 'acquisition' | 'investment' | 'ipo' | 'qip' | 'partnership' | 'other';
  description: string;
  valueCr: number | null;
}

interface CompanyIntelligence {
  companyId: string;
  companyName: string;
  description: string;
  clients: string[];
  keyGrowthTriggers: string[];
  quarterlyResults: QuarterlyResult[];
  dealActivity: DealActivity[];
  concallHighlights: Array<{
    date: string;
    quarter: string;
    points: string[];
  }>;
  shareholding: Array<{
    date: string;
    holder: string;
    stake: number;
  }>;
}

export class SovrennParser {
  /**
   * Parse a Sovrenn markdown file and extract structured intelligence
   */
  static parseFile(filePath: string, companyId: string): CompanyIntelligence {
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

  /**
   * Extract company name from content or use fallback
   */
  private static extractCompanyName(content: string, companyId: string): string {
    // Try to extract from "Company Description:" section
    const match = content.match(/\*\*Company Description:\*\* ([^\.]+)/);
    if (match) {
      return match[1].trim();
    }

    // Fallback to titlecase company ID
    return companyId.charAt(0).toUpperCase() + companyId.slice(1);
  }

  /**
   * Extract company description
   */
  private static extractDescription(content: string): string {
    const match = content.match(/\*\*Company Description:\*\* (.+?)(?=\n\n|\*\*)/s);
    return match ? match[1].trim() : '';
  }

  /**
   * Extract client list
   */
  private static extractClients(content: string): string[] {
    const match = content.match(/\*\*Clients\*\*:\s*(.+?)(?=\n|$)/);
    if (!match) return [];

    return match[1]
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);
  }

  /**
   * Extract key growth triggers
   */
  private static extractGrowthTriggers(content: string): string[] {
    const match = content.match(/\*\*Key Growth Triggers.*?\*\*:\s*\n([\s\S]+?)(?=\n\*\*|$)/);
    if (!match) return [];

    // Extract numbered points
    const triggerText = match[1];
    const triggers: string[] = [];

    const regex = /\d+\.(.+?)(?=\n\d+\.|$)/gs;
    let m;
    while ((m = regex.exec(triggerText)) !== null) {
      triggers.push(m[1].trim());
    }

    return triggers;
  }

  /**
   * Extract quarterly financial results
   */
  private static extractQuarterlyResults(content: string): QuarterlyResult[] {
    const results: QuarterlyResult[] = [];

    // Pattern: **DATE:** (TAG) For the quarter ending QUARTER, Sales ... Net Profit ...
    const regex = /\*\*(\d+\w+ \w+ \d{4}):\*\* (\([A-Z\s]+\) )?For the quarter ending ([A-Za-z0-9-]+), Sales (up|down) (\d+)% YoY from INR ([\d,]+) Cr.*?to INR ([\d,]+) Cr.*?Net Profit (up|down) (\d+)% from INR ([\d,]+) Cr to INR ([\d,]+) Cr.*?QoQ.*?Sales (up|down) (\d+)%.*?Net Profit (up|down) ([\d.x]+)/gi;

    let match;
    while ((match = regex.exec(content)) !== null) {
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

    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Extract deal activity (acquisitions, fundraising, etc.)
   */
  private static extractDealActivity(content: string): DealActivity[] {
    const deals: DealActivity[] = [];

    // Look for dated entries with deal-related keywords
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const dateMatch = line.match(/^\*\*(\d+\w+ \w+ \d{4}):\*\* (.+)/);

      if (!dateMatch) continue;

      const [_, date, description] = dateMatch;
      const lowerDesc = description.toLowerCase();

      // Classify deal type
      let type: DealActivity['type'] = 'other';
      if (lowerDesc.includes('acquire') || lowerDesc.includes('acquisition')) {
        type = 'acquisition';
      } else if (lowerDesc.includes('raise') || lowerDesc.includes('raised') || lowerDesc.includes('qip')) {
        type = lowerDesc.includes('qip') ? 'qip' : 'investment';
      } else if (lowerDesc.includes('ipo')) {
        type = 'ipo';
      } else if (lowerDesc.includes('partnership') || lowerDesc.includes('jv') || lowerDesc.includes('joint venture')) {
        type = 'partnership';
      }

      // Extract value (INR XXX Cr)
      const valueMatch = description.match(/INR\s*([\d,]+)\s*Cr/i);
      const valueCr = valueMatch ? this.parseNumber(valueMatch[1]) : null;

      // Only add if it's a significant deal (has value or is an acquisition/partnership)
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

  /**
   * Extract concall highlights
   */
  private static extractConcallHighlights(content: string): Array<{ date: string; quarter: string; points: string[] }> {
    const concalls: Array<{ date: string; quarter: string; points: string[] }> = [];

    // Pattern: **DATE:** (QUARTER Concall)
    const regex = /\*\*(\d+\w+ \w+ \d{4}):\*\* \(([QH]\d+FY\d+) Concall\)\s*\n([\s\S]+?)(?=\n\*\*|\n\n)/gi;

    let match;
    while ((match = regex.exec(content)) !== null) {
      const [_, date, quarter, pointsText] = match;

      const points: string[] = [];
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

  /**
   * Extract shareholding information
   */
  private static extractShareholding(content: string): Array<{ date: string; holder: string; stake: number }> {
    const holdings: Array<{ date: string; holder: string; stake: number }> = [];

    // Pattern: **DATE**: HOLDER is holding X.X%
    const regex = /\*\*(\d+\w+ \w+ \d{4})\*\*:([^*]+(?:is holding|holds)\s+[\d.]+%[^.]*)/gi;

    let match;
    while ((match = regex.exec(content)) !== null) {
      const [_, date, text] = match;

      // Extract individual holdings from the text
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

  /**
   * Parse number with commas
   */
  private static parseNumber(str: string): number {
    return parseFloat(str.replace(/,/g, ''));
  }

  /**
   * Parse QoQ growth (handles "3.2x" format)
   */
  private static parseQoQGrowth(direction: string, value: string): number {
    if (value.includes('x')) {
      const multiplier = parseFloat(value.replace('x', ''));
      return (multiplier - 1) * 100; // Convert 3.2x to 220% growth
    }
    return (direction === 'up' ? 1 : -1) * parseFloat(value);
  }
}

/**
 * Process all Sovrenn files in the data-sources directory
 */
export async function processAllSovrennFiles(dataSourcesDir: string): Promise<CompanyIntelligence[]> {
  const quarterlyReportsDir = path.join(dataSourcesDir, 'quarterly-reports');
  const companies: CompanyIntelligence[] = [];

  // List all company directories
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

    // Use the first .md file found
    const filePath = path.join(companyDir, files[0]);
    console.log(`✓ Parsing ${companyId} from ${files[0]}`);

    try {
      const intelligence = SovrennParser.parseFile(filePath, companyId);
      companies.push(intelligence);

      console.log(`  → Found ${intelligence.quarterlyResults.length} quarterly results`);
      console.log(`  → Found ${intelligence.dealActivity.length} deal activities`);
      console.log(`  → Found ${intelligence.concallHighlights.length} concall summaries`);
    } catch (error) {
      console.error(`❌ Error parsing ${companyId}:`, error);
    }
  }

  return companies;
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const dataSourcesDir = path.join(process.cwd(), 'data-sources');

  processAllSovrennFiles(dataSourcesDir).then(companies => {
    console.log(`\n✓ Processed ${companies.length} companies`);

    // Save to JSON
    const outputPath = path.join(dataSourcesDir, 'extracted', 'sovrenn-intelligence.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(companies, null, 2));

    console.log(`✓ Saved to ${outputPath}`);
  }).catch(console.error);
}
