import type { LeadershipGovernanceData } from "../../types/sections";

const data: LeadershipGovernanceData = {
  section: "leadership-governance",
  dataAsOf: "Q3 FY25",
  lastUpdated: "2025-01-15T00:00:00Z",
  cxoChanges: [
    {
      company: "Voltas",
      role: "Chief Financial Officer",
      incoming: "Rajesh Sharma",
      outgoing: "Anil Mehra",
      effectiveDate: "2024-12-01",
      context:
        "Planned succession; Anil Mehra retiring after 12-year tenure. Rajesh Sharma promoted from SVP Finance with experience in Tata group treasury operations.",
    },
    {
      company: "Crompton Greaves",
      role: "Chief Marketing Officer",
      incoming: "Priya Nair",
      outgoing: null,
      effectiveDate: "2024-11-15",
      context:
        "New role created to drive D2C and brand consolidation post-Butterfly acquisition. Priya Nair joins from Unilever with 15 years in FMCG marketing.",
    },
    {
      company: "Orient Electric",
      role: "Managing Director & CEO",
      incoming: null,
      outgoing: "Rakesh Khanna",
      effectiveDate: "2025-01-31",
      context:
        "Sudden departure -- Rakesh Khanna stepping down citing 'personal reasons'. Board yet to announce successor. Interim charge with CFO Deepak Jain. Promoter pledge increase context raises concerns.",
    },
    {
      company: "Dixon Technologies",
      role: "Chief Operating Officer",
      incoming: "Sanjay Gupta",
      outgoing: "Vikram Reddy",
      effectiveDate: "2024-10-15",
      context:
        "Vikram Reddy moving to advisory role. Sanjay Gupta brings Samsung India manufacturing experience -- critical for the white goods OEM strategy.",
    },
  ],
  boardReshuffles: [
    {
      company: "IFB Industries",
      change:
        "Independent Director M.R. Sundaresan resigned; board strength falls to minimum required. Replacement appointment pending.",
      date: "2024-10-28",
      significance: "high",
    },
    {
      company: "Symphony",
      change:
        "Added two independent directors with private equity background; signals potential subsidiary restructuring or fundraise",
      date: "2024-11-20",
      significance: "medium",
    },
    {
      company: "Bajaj Electricals",
      change:
        "Post-EPC demerger board reconstituted; 3 new independent directors with consumer sector expertise appointed",
      date: "2024-12-05",
      significance: "low",
    },
  ],
  promoterStakeChanges: [
    {
      company: "Orient Electric",
      promoterGroup: "CK Birla Group",
      previousPct: 37.2,
      currentPct: 36.8,
      changePct: -0.4,
      context:
        "Promoter pledge increased from 12% to 19% of holding; 0.4% stake sold via open market transactions. Combined with MD departure, raises concern about promoter group financial position.",
      amServiceLineImplication:
        "Declining promoter + stress signals = Turnaround Advisory opportunity",
    },
    {
      company: "TTK Prestige",
      promoterGroup: "TTK Group",
      previousPct: 71.5,
      currentPct: 70.8,
      changePct: -0.7,
      context:
        "Minor stake dilution via GIC block deal; TTK family maintaining 70%+ holding. Strategic intent to improve free-float and institutional ownership mix.",
      amServiceLineImplication:
        "Strategic dilution with institutional entry = PE Advisory / Transaction Support",
    },
    {
      company: "Havells India",
      promoterGroup: "QRG Enterprises (Gupta family)",
      previousPct: 59.4,
      currentPct: 59.4,
      changePct: 0,
      context:
        "Promoter holding stable at 59.4%; zero pledge. Strongest promoter governance profile in coverage universe.",
      amServiceLineImplication:
        "Stable holding + zero pledge = Growth Strategy / M&A support for acquisitions",
    },
    {
      company: "V-Guard Industries",
      promoterGroup: "Kochouseph Chittilappilly family",
      previousPct: 55.2,
      currentPct: 54.8,
      changePct: -0.4,
      context:
        "Minor dilution through Sunflame deal consideration; promoter remains firmly in control. Chittilappilly family has strong track record of capital allocation.",
      amServiceLineImplication:
        "Minor deal-driven dilution = Integration Advisory support",
    },
  ],
  auditorFlags: [
    {
      company: "IFB Industries",
      flag: "Qualification on related-party transactions with engineering division entities linked to promoter group",
      severity: "high",
      details:
        "Auditor (Deloitte) qualified opinion on INR 85 Cr of inter-company transactions between IFB Home Appliances and IFB Automotive (promoter-linked). Transfer pricing methodology questioned.",
    },
    {
      company: "Butterfly Gandhimathi",
      flag: "Emphasis of matter on going concern; three consecutive quarters of negative operating cash flow",
      severity: "medium",
      details:
        "Auditor highlighted liquidity risk despite Crompton parent support. Working capital facility utilization at 92% of sanctioned limit. Crompton board has provided comfort letter.",
    },
  ],
  aiRiskFlags: [
    {
      company: "Orient Electric",
      riskType: "Leadership Vacuum + Promoter Stress",
      confidence: "high",
      explanation:
        "Convergence of MD departure, rising promoter pledges, and potential stake sale creates multi-dimensional governance risk. No successor announced increases uncertainty. Recommend heightened monitoring.",
    },
    {
      company: "IFB Industries",
      riskType: "Governance + Audit Concern",
      confidence: "high",
      explanation:
        "Independent director resignation + auditor qualification on related-party transactions is a classic governance deterioration pattern. Board oversight capacity reduced. Institutional investors may reduce positions.",
    },
    {
      company: "Butterfly Gandhimathi",
      riskType: "Liquidity + Integration Risk",
      confidence: "medium",
      explanation:
        "Negative cash flow + near-full working capital facility utilization, despite being part of Crompton group. Integration synergies slower than expected. If Crompton support is withdrawn, standalone viability is questionable.",
    },
  ],
  governanceRiskScores: [
    {
      company: "Orient Electric",
      score: "red",
      factors: [
        "MD departure without successor",
        "Promoter pledge increase 12% to 19%",
        "Potential stake sale discussions",
      ],
      amServiceLine: "Restructuring / Turnaround",
    },
    {
      company: "IFB Industries",
      score: "red",
      factors: [
        "Independent director resignation",
        "Auditor qualification on related-party transactions",
        "Board below minimum strength",
      ],
      amServiceLine: "Restructuring / Governance Advisory",
    },
    {
      company: "Butterfly Gandhimathi",
      score: "amber",
      factors: [
        "Going concern emphasis",
        "Negative operating cash flow x3 quarters",
        "Working capital facility at 92%",
      ],
      amServiceLine: "Turnaround / Performance Improvement",
    },
    {
      company: "Symphony",
      score: "amber",
      factors: [
        "Board additions with PE background",
        "International subsidiary losses",
        "Potential restructuring signals",
      ],
      amServiceLine: "Corporate Restructuring",
    },
    {
      company: "Havells India",
      score: "green",
      factors: [
        "Stable promoter at 59.4%",
        "Zero pledge",
        "Strong governance track record",
      ],
      amServiceLine: "Growth Strategy / M&A Advisory",
    },
    {
      company: "Voltas",
      score: "green",
      factors: [
        "Planned CFO succession",
        "Tata group governance framework",
      ],
      amServiceLine: "Operations Excellence",
    },
  ],
};

export default data;
