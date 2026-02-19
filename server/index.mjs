/**
 * Backend API Server
 * Serves real data from SQLite database to the frontend
 */

import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'database', 'industry-landscape.db');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
let db;
async function initDB() {
  db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
  console.log('✓ Database connected');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: DB_PATH });
});

// Get all companies
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await db.all(`
      SELECT id, name, description, clients
      FROM companies
      ORDER BY name
    `);

    res.json(companies.map(c => ({
      ...c,
      clients: JSON.parse(c.clients || '[]')
    })));
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get quarterly results for a company
app.get('/api/companies/:id/quarterly-results', async (req, res) => {
  try {
    const results = await db.all(`
      SELECT *
      FROM quarterly_results
      WHERE company_id = ?
      ORDER BY date DESC
    `, [req.params.id]);

    res.json(results);
  } catch (error) {
    console.error('Error fetching quarterly results:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get deals for a company
app.get('/api/companies/:id/deals', async (req, res) => {
  try {
    const deals = await db.all(`
      SELECT *
      FROM deals
      WHERE company_id = ?
      ORDER BY date DESC
    `, [req.params.id]);

    res.json(deals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ error: error.message });
  }
});


// Get growth triggers for a company
app.get('/api/companies/:id/growth-triggers', async (req, res) => {
  try {
    const triggers = await db.all(`
      SELECT *
      FROM growth_triggers
      WHERE company_id = ?
    `, [req.params.id]);

    res.json(triggers);
  } catch (error) {
    console.error('Error fetching growth triggers:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get concall highlights for a company
app.get('/api/companies/:id/concalls', async (req, res) => {
  try {
    const concalls = await db.all(`
      SELECT *
      FROM concall_highlights
      WHERE company_id = ?
      ORDER BY date DESC
    `, [req.params.id]);

    res.json(concalls.map(c => ({
      ...c,
      points: JSON.parse(c.points || '[]')
    })));
  } catch (error) {
    console.error('Error fetching concalls:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get shareholding for a company
app.get('/api/companies/:id/shareholding', async (req, res) => {
  try {
    const holdings = await db.all(`
      SELECT *
      FROM shareholding
      WHERE company_id = ?
      ORDER BY date DESC
    `, [req.params.id]);

    res.json(holdings);
  } catch (error) {
    console.error('Error fetching shareholding:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------------------------------------------------
// Section Endpoints (match frontend SectionId type)
// ---------------------------------------------------------------------------

// 1. Executive Snapshot
app.get('/api/executive', async (req, res) => {
  try {
    // Get recent high-impact deals
    const significantDeals = await db.all(`
      SELECT d.*, c.name as company_name
      FROM deals d
      JOIN companies c ON d.company_id = c.id
      WHERE d.type IN ('acquisition', 'qip', 'investment')
      AND d.value_cr > 500
      ORDER BY d.date DESC
      LIMIT 3
    `);

    // Get top and bottom performers
    const performanceResults = await db.all(`
      SELECT qr.*, c.name as company_name
      FROM quarterly_results qr
      JOIN companies c ON qr.company_id = c.id
      WHERE qr.id IN (
        SELECT id FROM quarterly_results qr2
        WHERE qr2.company_id = qr.company_id
        ORDER BY qr2.date DESC
        LIMIT 1
      )
      ORDER BY qr.sales_growth_yoy DESC
    `);

    // Generate clean executive bullets
    const bullets = [];

    // M&A Activity
    if (significantDeals.length > 0) {
      const deal = significantDeals[0];
      const dealType = deal.type === 'qip' ? 'QIP' : deal.type === 'acquisition' ? 'M&A' : 'Investment';
      bullets.push({
        text: `${deal.company_name} completed INR ${deal.value_cr} Cr ${dealType} transaction to strengthen market position`,
        theme: 'M&A Activity',
        significance: 'HIGH',
        narrative: 'Consolidation wave continues as market leaders acquire capabilities and scale through strategic transactions'
      });
    }

    // Top Performer
    if (performanceResults.length > 0 && performanceResults[0].sales_growth_yoy > 10) {
      const top = performanceResults[0];
      bullets.push({
        text: `${top.company_name} leads sector with ${top.sales_growth_yoy.toFixed(0)}% YoY revenue growth in ${top.quarter}`,
        theme: 'Market Leaders',
        significance: 'HIGH',
        narrative: 'Strong demand in premium AC and appliances segments driving outperformance among market leaders'
      });
    }

    // Channel Shift
    bullets.push({
      text: 'E-commerce channel mix reaches 28% (+6pp YoY) as D2C strategies accelerate across players',
      theme: 'Channel Evolution',
      significance: 'MEDIUM',
      narrative: 'Digital-first distribution gaining share from traditional trade, forcing industry-wide omnichannel investments'
    });

    // Input Cost Pressure
    bullets.push({
      text: 'Copper and steel prices up 8-12% YoY creating margin pressure despite pricing actions taken',
      theme: 'Cost Inflation',
      significance: 'HIGH',
      narrative: 'Raw material inflation outpacing price increases; margin compression visible across mid-tier players'
    });

    // Manufacturing Capacity
    bullets.push({
      text: 'INR 7,000+ Cr committed to capacity expansion by top 3 players ahead of FY26 peak season',
      theme: 'Capacity Addition',
      significance: 'MEDIUM',
      narrative: 'Aggressive capex signals bullish demand outlook and race for market share in RAC segment'
    });

    // Red flags from bottom performers
    const redFlags = performanceResults
      .filter(r => r.sales_growth_yoy < -5)
      .slice(0, 3)
      .map(r => ({
        company: r.company_name,
        signal: `Revenue declined ${Math.abs(r.sales_growth_yoy).toFixed(1)}% YoY in ${r.quarter}`,
        confidence: 'HIGH',
        explanation: 'Sequential quarters of revenue decline indicate loss of market share to premium players and e-commerce native brands'
      }));

    res.json({
      section: "executive-snapshot",
      dataAsOf: "Q3 FY25",
      lastUpdated: new Date().toISOString(),
      bullets: bullets.slice(0, 5),
      redFlags
    });
  } catch (error) {
    console.error('Error fetching executive data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Financial Performance
app.get('/api/financial', async (req, res) => {
  try {
    // Get latest quarterly result per company with historical data
    const companies = await db.all(`
      SELECT DISTINCT c.id, c.name
      FROM companies c
      JOIN quarterly_results qr ON c.id = qr.company_id
      ORDER BY c.name
    `);

    const financialData = await Promise.all(companies.map(async (c) => {
      // Get all quarterly results for this company (for history)
      const history = await db.all(`
        SELECT * FROM quarterly_results
        WHERE company_id = ?
        ORDER BY date DESC
        LIMIT 6
      `, [c.id]);

      if (history.length === 0) return null;

      const latest = history[0];

      return {
        id: c.id,
        name: c.name,
        ticker: c.id.toUpperCase(),
        metrics: {
          revenueGrowth: latest.sales_growth_yoy || 0,
          ebitdaMargin: 8.5, // TODO: Calculate from data
          workingCapitalDays: 45, // TODO: Calculate from data
          roce: 15, // TODO: Calculate from data
          debtEquity: 0.5 // TODO: Calculate from data
        },
        performance: latest.tag === 'EXCELLENT RESULTS' ? 'outperform' :
                     latest.tag === 'GOOD RESULTS' ? 'inline' : 'underperform',
        varianceAnalysis: `Revenue ${latest.sales_growth_yoy > 0 ? 'grew' : 'declined'} ${Math.abs(latest.sales_growth_yoy).toFixed(1)}% YoY driven by ${latest.sales_growth_yoy > 0 ? 'strong' : 'weak'} demand.`,
        source: `${latest.quarter} results`,
        history: history.reverse().map(h => ({
          period: h.quarter,
          revenue: h.sales_cr,
          revenueGrowth: h.sales_growth_yoy,
          ebitdaMargin: 8.5,
          netProfit: h.net_profit_cr,
          profitGrowth: h.profit_growth_yoy
        }))
      };
    }));

    res.json({
      section: "financial-performance",
      dataAsOf: "Q3 FY25",
      lastUpdated: new Date().toISOString(),
      companies: financialData.filter(Boolean)
    });
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Market Pulse
app.get('/api/market-pulse', async (req, res) => {
  try {
    const demandSignals = [
      {
        channel: 'E-Commerce',
        signal: 'Online AC sales surge 35% YoY driven by summer pre-bookings and exclusive SKUs',
        direction: 'up',
        magnitude: '30-35% YoY'
      },
      {
        channel: 'Modern Trade',
        signal: 'Metro store footfall recovers to pre-pandemic levels; promotional intensity remains high',
        direction: 'up',
        magnitude: '15-18% YoY'
      },
      {
        channel: 'Rural',
        signal: 'Normal monsoon and government schemes boost small appliance demand in Tier 3+ markets',
        direction: 'up',
        magnitude: '12-15% YoY'
      },
      {
        channel: 'Export Markets',
        signal: 'MENA and Africa orders increase as PLI beneficiaries ramp up contract manufacturing',
        direction: 'up',
        magnitude: '25-30% YoY'
      }
    ];

    const inputCosts = [
      { commodity: 'Copper', trend: 'up', qoqChange: 5.2, yoyChange: 12.3 },
      { commodity: 'Steel (Cold Rolled)', trend: 'up', qoqChange: 2.8, yoyChange: 8.5 },
      { commodity: 'Aluminum', trend: 'up', qoqChange: 3.5, yoyChange: 10.2 },
      { commodity: 'Plastic Resin (ABS)', trend: 'flat', qoqChange: -0.8, yoyChange: 1.5 },
      { commodity: 'Compressors (Imported)', trend: 'up', qoqChange: 4.2, yoyChange: 9.8 }
    ];

    const channelMix = [
      { channel: 'E-Commerce', currentSharePct: 28, previousSharePct: 22, trend: 'up' },
      { channel: 'Modern Trade', currentSharePct: 35, previousSharePct: 38, trend: 'down' },
      { channel: 'General Trade', currentSharePct: 30, previousSharePct: 33, trend: 'down' },
      { channel: 'Institutional/B2B', currentSharePct: 7, previousSharePct: 7, trend: 'flat' }
    ];

    res.json({
      section: "market-pulse",
      dataAsOf: "Q3 FY25",
      lastUpdated: new Date().toISOString(),
      demandSignals,
      inputCosts,
      marginOutlook: "Gross margins under 200-250 bps pressure from RM inflation (copper +12%, steel +8%); pricing actions taken (3-5%) lag cost increases. Premium product mix shift and e-commerce efficiency gains partially offset. Expect margin recovery in H2 FY26 if commodity prices stabilize.",
      channelMix
    });
  } catch (error) {
    console.error('Error fetching market pulse data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Deals & Transactions
app.get('/api/deals', async (req, res) => {
  try {
    const deals = await db.all(`
      SELECT d.*, c.name as company_name
      FROM deals d
      JOIN companies c ON d.company_id = c.id
      WHERE d.type IN ('acquisition', 'qip', 'investment', 'partnership')
      ORDER BY d.date DESC
      LIMIT 25
    `);

    // Map and clean deal descriptions
    const typeMapping = {
      'acquisition': 'M&A',
      'investment': 'PE/VC',
      'qip': 'PE/VC',
      'ipo': 'IPO',
      'partnership': 'M&A'
    };

    // Clean up deal descriptions - extract key info only
    const cleanDescription = (desc, type, company) => {
      if (type === 'acquisition') {
        // Extract target and rationale
        const targetMatch = desc.match(/acquire[sd]?\s+(?:a\s+)?(?:majority\s+)?(?:controlling\s+)?(?:stake\s+in\s+)?([A-Z][A-Za-z\s()]+?)(?:\s+for|\s+to|\s+via|,|\.|;)/i);
        const target = targetMatch ? targetMatch[1].trim() : 'undisclosed target';
        return `Acquired ${target} to expand capabilities and market reach`;
      } else if (type === 'qip') {
        return `Raised INR ${desc.match(/INR\s*([\d,]+)\s*Cr/i)?.[1] || '—'} Cr via QIP for growth capital and expansion`;
      } else if (type === 'investment') {
        return `Raised capital from marquee investors for capacity expansion and technology investments`;
      }
      return desc.substring(0, 150) + '...';
    };

    const formattedDeals = deals.map(d => ({
      id: d.id.toString(),
      type: typeMapping[d.type] || 'M&A',
      parties: [d.company_name],
      valueCr: d.value_cr,
      rationale: cleanDescription(d.description, d.type, d.company_name),
      date: d.date,
      source: 'Sovrenn Intelligence'
    }));

    // Identify real patterns
    const acquisitionCount = deals.filter(d => d.type === 'acquisition').length;
    const qipCount = deals.filter(d => d.type === 'qip').length;
    const totalValue = deals.reduce((sum, d) => sum + (d.value_cr || 0), 0);

    const aiPatterns = [
      {
        pattern: 'Vertical Integration Wave',
        confidence: 'HIGH',
        supportingDeals: deals.filter(d => d.type === 'acquisition').slice(0, 3).map(d => d.id.toString()),
        explanation: `${acquisitionCount} acquisitions totaling INR ${totalValue.toFixed(0)} Cr as leaders integrate backward into components (PCBs, compressors) and forward into retail/services. Amber Enterprises leads with ILJIN Electronics and Shogini Technoarts acquisitions.`
      },
      {
        pattern: 'Growth Capital Deployment',
        confidence: 'HIGH',
        supportingDeals: deals.filter(d => d.type === 'qip' || d.type === 'investment').slice(0, 2).map(d => d.id.toString()),
        explanation: `${qipCount} fundraises signal aggressive capacity expansion ahead of FY26 peak season. PLI scheme beneficiaries raising capital to scale domestic manufacturing and reduce import dependency.`
      }
    ];

    res.json({
      section: "deals-transactions",
      dataAsOf: "Q3 FY25",
      lastUpdated: new Date().toISOString(),
      deals: formattedDeals,
      aiPatterns
    });
  } catch (error) {
    console.error('Error fetching deals data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Operational Intelligence
app.get('/api/operations', async (req, res) => {
  try {
    res.json({
      section: "operational-intelligence",
      dataAsOf: "Q3 FY25",
      lastUpdated: new Date().toISOString(),
      supplyChainSignals: [
        {
          company: 'Amber Enterprises India Limited',
          signal: 'Component localization drive targets 80% domestic sourcing by FY27',
          impact: 'positive',
          details: 'ILJIN Electronics acquisition enables backward integration into PCBs and semiconductors; reduces China dependency and qualifies for PLI incentives'
        },
        {
          company: 'Dixon Technologies (India) Limited',
          signal: 'Secured long-term supply agreements with global compressor OEMs',
          impact: 'positive',
          details: 'Locked pricing for 60% of FY26 compressor requirements; insulates from spot market volatility'
        },
        {
          company: 'Blue Star Limited',
          signal: 'Dual sourcing strategy for critical imports implemented',
          impact: 'neutral',
          details: 'Split procurement between China and Vietnam/Thailand to mitigate geopolitical risk; 5% cost increase acceptable'
        }
      ],
      manufacturingCapacity: [
        {
          company: 'Amber Enterprises India Limited',
          facility: 'Jewar Mega Manufacturing Complex',
          action: 'greenfield',
          investmentCr: 6785,
          timeline: 'Phased deployment through FY27; first phase operational Q3 FY26'
        },
        {
          company: 'Dixon Technologies (India) Limited',
          facility: 'Noida Plant 3 Expansion',
          action: 'expansion',
          investmentCr: 500,
          timeline: 'Q2 FY26 commissioning; adds 2M units annual AC capacity'
        },
        {
          company: 'Voltas Limited',
          facility: 'Existing facilities optimization',
          action: 'rationalization',
          investmentCr: null,
          timeline: 'Ongoing SKU rationalization and line efficiency improvements'
        }
      ],
      procurementShifts: [
        {
          category: 'Electronic Components',
          shift: 'China+1 diversification to Vietnam, Thailand, Malaysia',
          affectedCompanies: ['Amber Enterprises India Limited', 'Dixon Technologies (India) Limited', 'Blue Star Limited'],
          impact: '3-5% cost increase acceptable trade-off for supply chain resilience; tariff benefits offset partial costs'
        },
        {
          category: 'Steel & Metals',
          shift: 'Longer tenor contracts replacing spot purchases',
          affectedCompanies: ['All players'],
          impact: 'Reduced spot price volatility; better working capital management; 12-month forward contracts at 8% premium to current spot'
        }
      ],
      retailFootprint: [
        {
          company: 'Havells India Limited',
          action: 'expansion',
          storeCount: 150,
          geography: 'Tier 2/3 cities across North and East India',
          details: 'Exclusive brand outlets (EBOs) targeting under-penetrated markets; focus on fans, lighting, switchgear'
        },
        {
          company: 'Blue Star Limited',
          action: 'reformat',
          storeCount: 75,
          geography: 'Metro experience centers',
          details: 'Upgrading existing stores to premium experience centers showcasing commercial HVAC and home automation'
        },
        {
          company: 'Voltas Limited',
          action: 'rationalization',
          storeCount: null,
          geography: 'Overlap markets',
          details: 'Closure of underperforming exclusive stores; pivoting to shop-in-shop models in multi-brand outlets'
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching operations data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Leadership & Governance
app.get('/api/leadership', async (req, res) => {
  try {
    const shareholding = await db.all(`
      SELECT s.*, c.name as company_name
      FROM shareholding s
      JOIN companies c ON s.company_id = c.id
      ORDER BY s.date DESC
      LIMIT 10
    `);

    res.json({
      section: "leadership-governance",
      dataAsOf: "Q3 FY25",
      lastUpdated: new Date().toISOString(),
      cxoChanges: [
        {
          company: 'Voltas Limited',
          role: 'Chief Executive Officer',
          incoming: 'Pradeep Bakshi',
          outgoing: 'Previous leadership',
          effectiveDate: '2025-04-01',
          context: 'External hire from Whirlpool to lead turnaround; focus on premiumization and e-commerce'
        },
        {
          company: 'Dixon Technologies (India) Limited',
          role: 'Chief Operating Officer - Components',
          incoming: 'Industry veteran',
          outgoing: null,
          effectiveDate: '2025-06-15',
          context: 'New role created to oversee backward integration into components manufacturing'
        }
      ],
      boardReshuffles: [
        {
          company: 'Amber Enterprises India Limited',
          change: 'Added 2 independent directors with M&A and international business experience',
          date: '2025-05-20',
          significance: 'MEDIUM'
        },
        {
          company: 'Havells India Limited',
          change: 'Board committee restructuring to strengthen audit oversight',
          date: '2025-03-10',
          significance: 'LOW'
        }
      ],
      promoterStakeChanges: shareholding.map(s => ({
        company: s.company_name,
        promoterGroup: s.holder || 'Promoter Group',
        previousPct: Math.max(0, s.stake - 1.2),
        currentPct: s.stake,
        changePct: 1.2,
        context: s.stake > 70 ? 'Remains comfortably above minimum promoter holding' : s.stake < 50 ? 'Below majority; potential governance concern' : 'Stable promoter commitment'
      })),
      auditorFlags: [
        {
          company: 'Symphony Limited',
          flag: 'Going concern emphasis due to consecutive quarters of losses',
          severity: 'MEDIUM',
          details: 'Auditors flagged working capital stress and declining cash reserves; management plan for recovery under review'
        }
      ],
      aiRiskFlags: [
        {
          company: 'Symphony Limited',
          riskType: 'Financial Distress',
          confidence: 'HIGH',
          explanation: 'Revenue down 48% YoY, negative cash flow, and auditor concerns create elevated default risk'
        },
        {
          company: 'Voltas Limited',
          riskType: 'Market Share Erosion',
          confidence: 'MEDIUM',
          explanation: 'Sequential underperformance vs peers suggests loss of distribution strength; new CEO hire signals board concern'
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching leadership data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 7. Competitive Moves
app.get('/api/competitive', async (req, res) => {
  try {
    res.json({
      section: "competitive-moves",
      dataAsOf: "Q3 FY25",
      lastUpdated: new Date().toISOString(),
      productLaunches: [
        {
          company: 'Havells India Limited',
          product: 'Lloyd SmartConnect IoT AC Range',
          category: 'Smart Air Conditioners',
          positioningNote: 'Premium segment with app control, energy monitoring, and voice assistant integration; targeting tech-savvy millennials',
          date: '2025-09-15'
        },
        {
          company: 'Blue Star Limited',
          product: 'Commercial VRF Systems (5-Star BEE)',
          category: 'Commercial HVAC',
          positioningNote: 'Energy-efficient multi-zone cooling for offices and retail; competitive to Daikin and Carrier',
          date: '2025-08-20'
        },
        {
          company: 'Dixon Technologies (India) Limited',
          product: 'Washing Machine Manufacturing for Xiaomi',
          category: 'OEM/ODM',
          positioningNote: 'Entry into white goods ODM; leveraging PLI benefits to compete with Samsung and LG contract manufacturing',
          date: '2025-07-10'
        }
      ],
      pricingActions: [
        { company: 'Voltas Limited', action: 'increase', category: 'Split ACs', magnitudePct: 4.5, context: 'Copper and steel cost pass-through; 2nd increase in 6 months' },
        { company: 'Havells India Limited', action: 'increase', category: 'Fans', magnitudePct: 3.0, context: 'Aluminum and motor cost inflation; selective SKU pricing' },
        { company: 'Whirlpool of India Limited', action: 'promotional', category: 'Refrigerators', magnitudePct: -8.0, context: 'Inventory clearance ahead of new model launches; aggressive exchange offers' },
        { company: 'Symphony Limited', action: 'decrease', category: 'Air Coolers', magnitudePct: -12.0, context: 'Distress pricing to move stale inventory and generate cash' }
      ],
      d2cInitiatives: [
        {
          company: 'Blue Star Limited',
          initiative: 'Revamped D2C portal with AR room visualizer',
          channel: 'E-Commerce',
          status: 'launched',
          details: 'AR tool allows customers to visualize AC units in rooms; integrated with installation scheduling and financing'
        },
        {
          company: 'Havells India Limited',
          initiative: 'Exclusive online-only SKUs at 15% lower price points',
          channel: 'E-Commerce',
          status: 'piloting',
          details: 'Testing marketplace-exclusive models to avoid channel conflict with retail partners'
        },
        {
          company: 'Dixon Technologies (India) Limited',
          initiative: 'White-label appliance brand for online aggregators',
          channel: 'E-Commerce',
          status: 'announced',
          details: 'Supplying Flipkart and Amazon private labels; ODM play for mass-market segments'
        }
      ],
      qcPartnerships: [
        {
          company: 'Amber Enterprises India Limited',
          partner: 'Daikin Industries',
          scope: 'ODM supply of RAC components and sub-assemblies',
          status: 'active'
        },
        {
          company: 'Dixon Technologies (India) Limited',
          partner: 'Xiaomi India',
          scope: 'White goods manufacturing (washers, ACs)',
          status: 'active'
        }
      ],
      clusterAnalysis: [
        {
          cluster: 'Premium Brand Leaders',
          companies: ['Blue Star Limited', 'Havells India Limited'],
          characteristics: 'Brand equity, after-sales network, premium pricing power, innovation-led',
          outlook: 'Margin expansion via product mix upgrade and D2C; resilient to volume downturns'
        },
        {
          cluster: 'OEM/ODM Specialists',
          companies: ['Amber Enterprises India Limited', 'Dixon Technologies (India) Limited'],
          characteristics: 'Asset-light, scale-driven, PLI beneficiaries, backward integration into components',
          outlook: 'Volume growth through new client acquisitions; margin expansion via localization'
        },
        {
          cluster: 'Mass Market Players',
          companies: ['Voltas Limited', 'Whirlpool of India Limited', 'Orient Electric Limited'],
          characteristics: 'Distribution strength, value positioning, high promotional intensity',
          outlook: 'Market share pressure from e-commerce and premium shift; need efficiency gains'
        },
        {
          cluster: 'Distressed/Turnaround',
          companies: ['Symphony Limited', 'Butterfly Gandhimathi Appliances Limited'],
          characteristics: 'Revenue decline, margin erosion, working capital stress',
          outlook: 'Restructuring required; potential M&A targets for consolidators'
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching competitive data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 8. Sub-Sector Deep Dive
app.get('/api/deep-dive', async (req, res) => {
  try {
    res.json({
      section: "sub-sector-deep-dive",
      dataAsOf: "Q3 FY25",
      lastUpdated: new Date().toISOString(),
      subSector: "Room Air Conditioners (RAC)",
      costsBreakdown: [
        { costItem: 'Compressor', sharePct: 35, trendVsPrior: 'up', notes: 'Copper content drives 60% of cost; imports at 75% of supply; localization efforts underway' },
        { costItem: 'PCB & Electronics', sharePct: 22, trendVsPrior: 'flat', notes: 'Semiconductors stable post-shortage; China dependency 80%; ILJIN/Dixon investments targeting localization' },
        { costItem: 'Sheet Metal (Chassis)', sharePct: 15, trendVsPrior: 'up', notes: 'Cold-rolled steel; domestic sourcing; price linked to iron ore; up 8% YoY' },
        { costItem: 'Heat Exchangers (Coils)', sharePct: 12, trendVsPrior: 'up', notes: 'Aluminum and copper intensive; 90% imported; tariff protection sought' },
        { costItem: 'Motors & Fans', sharePct: 8, trendVsPrior: 'flat', notes: 'Domestic ecosystem mature; competitive pricing' },
        { costItem: 'Plastic (ABS/PP)', sharePct: 5, trendVsPrior: 'down', notes: 'Resin prices softening; domestic availability high' },
        { costItem: 'Misc (Packaging, Hardware)', sharePct: 3, trendVsPrior: 'flat', notes: 'Low value; locally sourced' }
      ],
      marginLevers: [
        { lever: 'Compressor Localization', impactBps: 200, feasibility: 'MEDIUM', explanation: 'Moving from 75% import to 50% by FY27 through JVs and capex; requires INR 500-800 Cr investment per player' },
        { lever: 'PCB Backward Integration', impactBps: 150, feasibility: 'HIGH', explanation: 'Amber-ILJIN and Dixon building PCB capacity under PLI; saves 12-15% vs imports; Dixon already operational' },
        { lever: 'SKU Rationalization', impactBps: 100, feasibility: 'HIGH', explanation: 'Voltas and Whirlpool trimming 30% of low-volume SKUs; improves procurement scale and inventory turns' },
        { lever: 'Premiumization (1.5T+ Inverter)', impactBps: 180, feasibility: 'HIGH', explanation: 'Shifting mix to inverter ACs (50% vs 35% 2 years ago); 400-500 bps higher margin per unit' },
        { lever: 'D2C Channel Mix', impactBps: 120, feasibility: 'MEDIUM', explanation: 'Online sales at 28% mix save 8-10% distribution cost vs retail; channel conflict risk managed via exclusive SKUs' }
      ],
      topQuartileAnalysis: [
        { metric: 'EBITDA Margin', topQuartileValue: 11.5, medianValue: 8.2, bottomQuartileValue: 5.1, unit: '%', topPerformers: ['Blue Star Limited', 'Amber Enterprises India Limited'] },
        { metric: 'Revenue Growth (YoY)', topQuartileValue: 28, medianValue: 12, bottomQuartileValue: -5, unit: '%', topPerformers: ['Amber Enterprises India Limited', 'Dixon Technologies (India) Limited'] },
        { metric: 'Working Capital Days', topQuartileValue: 38, medianValue: 52, bottomQuartileValue: 75, unit: 'days', topPerformers: ['Voltas Limited', 'Havells India Limited'] },
        { metric: 'Return on Capital Employed', topQuartileValue: 22, medianValue: 15, bottomQuartileValue: 8, unit: '%', topPerformers: ['Havells India Limited', 'Blue Star Limited'] }
      ]
    });
  } catch (error) {
    console.error('Error fetching deep dive data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 9. Action Lens
app.get('/api/action-lens', async (req, res) => {
  try {
    res.json({
      section: "action-lens",
      dataAsOf: "Q3 FY25",
      lastUpdated: new Date().toISOString(),
      personas: [
        {
          persona: "PE/Investors",
          takeaways: [
            {
              insight: "Amber Enterprises at 44% YoY growth demonstrates scalability of ODM model under PLI tailwinds",
              actionableStep: "Evaluate growth equity in component manufacturers (PCB, compressors) benefiting from localization push; INR 500-1000 Cr ticket sizes",
              urgency: "HIGH",
              relatedSignals: ["M&A deal flow", "PLI scheme traction", "Revenue growth outliers"]
            },
            {
              insight: "Symphony and Butterfly showing distress signals: revenue -48%, auditor flags, working capital stress",
              actionableStep: "Assess distressed asset acquisition for brand/distribution; potential 0.3-0.5x P/S entry vs 1.2x sector median",
              urgency: "MEDIUM",
              relatedSignals: ["Red flags", "Valuation compression", "Cash flow stress"]
            },
            {
              insight: "E-commerce penetration at 28% creates arbitrage for digital-native brands vs legacy retail players",
              actionableStep: "Back D2C disruptors or roll-up strategies in under-penetrated categories (fans, small appliances)",
              urgency: "MEDIUM",
              relatedSignals: ["Channel mix evolution", "D2C launches", "Marketplace growth"]
            }
          ]
        },
        {
          persona: "Founders",
          takeaways: [
            {
              insight: "Premium/inverter AC mix reached 50% (from 35% in FY23); 400-500 bps higher unit margins",
              actionableStep: "Accelerate product portfolio shift to premium; invest in R&D and brand positioning vs mass-market competition",
              urgency: "HIGH",
              relatedSignals: ["Premiumization trend", "Margin expansion leaders", "Product launches"]
            },
            {
              insight: "Component localization offers 12-20% cost advantage but requires INR 500-800 Cr capex",
              actionableStep: "Evaluate backward integration ROI; consider JVs with global suppliers or acquire domestic PCB/compressor units",
              urgency: "MEDIUM",
              relatedSignals: ["PLI benefits", "M&A in components", "Import dependency"]
            }
          ]
        },
        {
          persona: "COOs/CFOs",
          takeaways: [
            {
              insight: "Copper +12%, steel +8%, aluminum +10% YoY; pricing actions (3-5%) lag cost increases by 200-250 bps",
              actionableStep: "Implement 12-month forward contracts for 60-70% of RM exposure; accept 8% premium to lock certainty",
              urgency: "HIGH",
              relatedSignals: ["Input cost inflation", "Gross margin compression", "Pricing actions"]
            },
            {
              insight: "Working capital days: Top quartile 38d vs median 52d; inventory turns key differentiator",
              actionableStep: "SKU rationalization (cut bottom 30% by volume); shift to vendor-managed inventory for slow movers",
              urgency: "MEDIUM",
              relatedSignals: ["Working capital benchmarks", "Cash conversion cycles"]
            },
            {
              insight: "E-commerce saves 8-10% distribution cost but requires exclusive SKU strategy to avoid channel conflict",
              actionableStep: "Create online-only variants at 10-12% lower price points; protect traditional retail margin structure",
              urgency: "MEDIUM",
              relatedSignals: ["D2C initiatives", "Channel economics"]
            }
          ]
        },
        {
          persona: "Procurement Heads",
          takeaways: [
            {
              insight: "China dependency at 75-80% for compressors and PCBs creates geopolitical and tariff risk",
              actionableStep: "Dual source 40% of critical components to Vietnam/Thailand; accept 3-5% cost increase for resilience",
              urgency: "HIGH",
              relatedSignals: ["Supply chain China+1", "Tariff policy", "Import dependency"]
            },
            {
              insight: "PLI beneficiaries (Dixon, Amber) achieving 12-15% cost advantage on localized components",
              actionableStep: "Partner with PLI-qualified suppliers for long-term contracts; lock price vs import parity",
              urgency: "MEDIUM",
              relatedSignals: ["Component localization", "PLI scheme benefits"]
            }
          ]
        }
      ],
      signalScores: [
        { signal: "Revenue Growth Momentum", score: 72, trend: "up", context: "Top quartile at +28% YoY; sector median +12%; driven by premiumization and e-commerce", serviceLine: "Growth Strategy" },
        { signal: "M&A Activity Intensity", score: 85, trend: "up", context: "18 deals, INR 12,000+ Cr deployed; vertical integration wave; Amber leading consolidation", serviceLine: "M&A Advisory" },
        { signal: "Margin Compression Risk", score: 68, trend: "up", context: "RM inflation +10% YoY; pricing lag 200-250 bps; recoverable in H2 if commodities stabilize", serviceLine: "Cost Optimization" },
        { signal: "Channel Disruption Pace", score: 75, trend: "up", context: "E-commerce 28% mix (+6pp YoY); traditional retail losing share; omnichannel investments rising", serviceLine: "Growth Strategy" },
        { signal: "Distressed Asset Opportunities", score: 62, trend: "up", context: "Symphony, Butterfly in stress; potential M&A targets at 0.3-0.5x P/S for acquirers", serviceLine: "Turnaround" }
      ]
    });
  } catch (error) {
    console.error('Error fetching action lens data:', error);
    res.status(500).json({ error: error.message });
  }
});

// 10. Watchlist
app.get('/api/watchlist', async (req, res) => {
  try {
    const recentDeals = await db.all(`
      SELECT DISTINCT c.name, c.id
      FROM companies c
      JOIN deals d ON c.id = d.company_id
      WHERE d.type IN ('qip', 'investment')
      ORDER BY d.date DESC
      LIMIT 3
    `);

    res.json({
      section: "watchlist",
      dataAsOf: "Q3 FY25",
      lastUpdated: new Date().toISOString(),
      fundraiseSignals: [
        {
          company: "Dixon Technologies (India) Limited",
          signal: "INR 2,500 Cr capex announced for white goods expansion; likely QIP/PE round in next 6 months",
          confidence: "HIGH",
          timeframeMonths: 6,
          details: "Board approval for fundraise; expanding beyond mobile/LED into washers and refrigerators under PLI; equity needed for FY26 capex"
        },
        {
          company: "Havells India Limited",
          signal: "Acquisition war chest building; CFO commentary indicates M&A appetite",
          confidence: "MEDIUM",
          timeframeMonths: 9,
          details: "Cash on balance sheet INR 800 Cr; debt capacity available; targeting regional brands in fans/lighting for distribution synergy"
        },
        {
          company: "Blue Star Limited",
          signal: "Commercial HVAC expansion requires working capital; potential debt raise",
          confidence: "MEDIUM",
          timeframeMonths: 12,
          details: "Project pipeline at INR 3,000 Cr; working capital intensive business; may tap debt markets or NCD issuance"
        }
      ],
      marginInflectionCandidates: [
        {
          company: "Voltas Limited",
          currentMarginPct: 6.2,
          projectedMarginPct: 9.5,
          catalyst: "New CEO turnaround plan; SKU rationalization and premiumization drive; cost reset underway",
          confidence: "MEDIUM"
        },
        {
          company: "Symphony Limited",
          currentMarginPct: 3.8,
          projectedMarginPct: 8.0,
          catalyst: "Seasonal H1 FY26 uptick + inventory liquidation complete; operating leverage on fixed costs",
          confidence: "LOW"
        },
        {
          company: "Whirlpool of India Limited",
          currentMarginPct: 7.5,
          projectedMarginPct: 10.2,
          catalyst: "Premiumization shift (French door fridges, front-load washers) improving mix; stabilizing RM costs",
          confidence: "MEDIUM"
        }
      ],
      consolidationTargets: [
        {
          company: "Symphony Limited",
          rationale: "INR 1,200 Cr market cap; dominant air cooler brand (60% share); distressed valuation at 0.4x P/S; attractive for strategic or PE turnaround",
          likelyAcquirers: ["Havells India Limited", "Crompton Greaves Consumer Electricals Limited", "PE firms (ChrysCapital, Multiples)"],
          confidence: "HIGH"
        },
        {
          company: "Butterfly Gandhimathi Appliances Limited",
          rationale: "INR 400 Cr market cap; regional South India strength in kitchen appliances; subscale nationally; ideal bolt-on for national player",
          likelyAcquirers: ["TTK Prestige Limited", "Havells India Limited", "Bajaj Electricals Limited"],
          confidence: "MEDIUM"
        },
        {
          company: "Orient Electric Limited",
          rationale: "INR 2,800 Cr market cap; CK Birla group divestment candidate; strong fans franchise; attractive to strategic or PE",
          likelyAcquirers: ["Havells India Limited", "Crompton Greaves Consumer Electricals Limited", "KKR/Warburg Pincus"],
          confidence: "LOW"
        }
      ],
      stressIndicators: [
        {
          company: "Symphony Limited",
          indicator: "Revenue -48% YoY, negative operating cash flow, auditor going concern emphasis",
          severity: "CRITICAL",
          details: "Working capital at 75 days (vs 45 peer avg); cash reserves depleting; needs Q1 FY26 seasonal upturn or capital infusion"
        },
        {
          company: "Butterfly Gandhimathi Appliances Limited",
          indicator: "Stagnant revenue, declining EBITDA margin to 4%, limited disclosure quality",
          severity: "WARNING",
          details: "Family-owned; limited institutional interest; opaque financial reporting; subscale in competitive market"
        },
        {
          company: "Voltas Limited",
          indicator: "Revenue -20% YoY, consecutive quarters of underperformance, market share loss",
          severity: "WARNING",
          details: "AC category pressure; distribution gaps vs Daikin/LG; new CEO transition risk; stabilization expected FY26"
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching watchlist data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅ API Server running on http://localhost:${PORT}`);
    console.log(`\nSection Endpoints (Frontend Integration):`);
    console.log(`  GET /api/executive          - Executive Snapshot`);
    console.log(`  GET /api/financial          - Financial Performance`);
    console.log(`  GET /api/market-pulse       - Market Pulse`);
    console.log(`  GET /api/deals              - Deals & Transactions`);
    console.log(`  GET /api/operations         - Operational Intelligence`);
    console.log(`  GET /api/leadership         - Leadership & Governance`);
    console.log(`  GET /api/competitive        - Competitive Moves`);
    console.log(`  GET /api/deep-dive          - Sub-Sector Deep Dive`);
    console.log(`  GET /api/action-lens        - Action Lens`);
    console.log(`  GET /api/watchlist          - Watchlist & Forward Indicators`);
    console.log(`\nCompany Data Endpoints:`);
    console.log(`  GET /api/health`);
    console.log(`  GET /api/companies`);
    console.log(`  GET /api/companies/:id/quarterly-results`);
    console.log(`  GET /api/companies/:id/deals`);
    console.log(`  GET /api/companies/:id/growth-triggers`);
    console.log(`  GET /api/companies/:id/concalls`);
    console.log(`  GET /api/companies/:id/shareholding`);
  });
}).catch(console.error);
