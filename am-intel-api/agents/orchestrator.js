import financialAnalystAgent from './financialAnalystAgent.js';
import transcriptIntelAgent from './transcriptIntelAgent.js';
import strategicMovesAgent from './strategicMovesAgent.js';
import governanceRiskAgent from './governanceRiskAgent.js';
import sectorMacroAgent from './sectorMacroAgent.js';
import synthesisAdvisoryAgent from './synthesisAdvisoryAgent.js';
import sectorSignalRepository from '../repositories/sectorSignalRepository.js';

/**
 * II Orchestrator — Event-driven trigger model.
 * Unlike CI (daily cron), II runs on specific triggers:
 * - Quarterly earnings filing
 * - Document ingestion (/intel skill)
 * - BSE filing (corporate announcement)
 * - Commodity spike (monthly threshold breach)
 * - Policy change (government announcement)
 * - Manual trigger (user requests sector refresh)
 * - Weekly watchlist re-scoring
 */

const AGENTS = {
  financial: financialAnalystAgent,
  transcript: transcriptIntelAgent,
  strategic: strategicMovesAgent,
  governance: governanceRiskAgent,
  sector: sectorMacroAgent,
  synthesis: synthesisAdvisoryAgent,
};

// Trigger → Agent mapping
const TRIGGER_AGENTS = {
  quarterly_earnings: ['financial', 'transcript', 'synthesis'],
  document_ingestion: ['transcript', 'strategic', 'governance', 'synthesis'],
  bse_filing: ['strategic', 'governance'],
  commodity_spike: ['sector', 'synthesis'],
  policy_change: ['sector', 'synthesis'],
  manual_refresh: ['financial', 'transcript', 'strategic', 'governance', 'sector', 'synthesis'],
  weekly_watchlist: ['synthesis'],
};

/**
 * Run agents based on trigger type
 */
async function handleTrigger(triggerType, options = {}) {
  const { companyId = null } = options;

  const agentNames = TRIGGER_AGENTS[triggerType];
  if (!agentNames) {
    throw new Error(`Unknown trigger type: ${triggerType}. Valid: ${Object.keys(TRIGGER_AGENTS).join(', ')}`);
  }

  console.log(`[II-Orchestrator] Handling trigger: ${triggerType}, agents: ${agentNames.join(', ')}`);

  const results = {};

  for (const agentName of agentNames) {
    const agent = AGENTS[agentName];
    if (!agent) continue;

    try {
      console.log(`[II-Orchestrator] Running ${agentName} agent`);
      results[agentName] = await agent.run(companyId);
    } catch (err) {
      console.error(`[II-Orchestrator] ${agentName} agent failed:`, err.message);
      results[agentName] = { error: err.message, signals: 0 };
    }
  }

  const totalSignals = Object.values(results).reduce((sum, r) => sum + (r.signals || 0), 0);
  console.log(`[II-Orchestrator] Trigger ${triggerType} complete. ${totalSignals} total signals.`);

  return { trigger: triggerType, results, totalSignals };
}

/**
 * Run a specific agent directly
 */
async function runAgent(agentName, companyId = null) {
  const agent = AGENTS[agentName];
  if (!agent) throw new Error(`Unknown agent: ${agentName}. Valid: ${Object.keys(AGENTS).join(', ')}`);

  console.log(`[II-Orchestrator] Running single agent: ${agentName}`);
  return await agent.run(companyId);
}

/**
 * Full sector refresh — runs all agents in sequence
 */
async function fullSectorRefresh() {
  return await handleTrigger('manual_refresh');
}

/**
 * Get sector signal feed with filters
 */
async function getSectorSignals(filters = {}) {
  return await sectorSignalRepository.findAll(filters);
}

/**
 * Get cross-dimensional patterns
 */
async function getPatterns(filters = {}) {
  return await sectorSignalRepository.findPatterns(filters);
}

/**
 * Get signals affecting a specific company
 */
async function getCompanySignals(companyId) {
  return await sectorSignalRepository.findByCompany(companyId);
}

/**
 * Get advisory pipeline — maps sector signals to service line opportunities
 */
async function getAdvisoryPipeline() {
  const patterns = await sectorSignalRepository.findPatterns({});

  // Group by service line
  const byServiceLine = {};
  for (const pattern of patterns) {
    for (const sl of (pattern.service_lines || [])) {
      if (!byServiceLine[sl]) byServiceLine[sl] = [];
      byServiceLine[sl].push(pattern);
    }
  }

  return byServiceLine;
}

export default {
  handleTrigger,
  runAgent,
  fullSectorRefresh,
  getSectorSignals,
  getPatterns,
  getCompanySignals,
  getAdvisoryPipeline,
  AGENTS,
  TRIGGER_AGENTS,
};
