/**
 * TVW-01: Talk vs Walk standalone interface.
 *
 * Represents a single management claim cross-referenced against actual
 * financial data to detect disconnects (red flags) or stealth improvements
 * (green flags). Used by the A&M Value-Add section for credibility checks.
 */

export interface TalkVsWalk {
  /** Company display name */
  company: string;
  /** Canonical company ID */
  companyId: string;
  /** Management claim text */
  claim: string;
  /** Source of the claim, e.g. "Sovrenn concall highlights" */
  claimSource: string;
  /** Whether actual data confirms, contradicts, or cannot verify the claim */
  dataVerification: "confirmed" | "contradicted" | "unverifiable";
  /** What the data actually shows */
  verificationData: string;
  /** Source of verification data, e.g. "Screener.in Q3 FY2026" */
  verificationSource: string;
  /** Red flag (disconnect) or green flag (stealth improvement) */
  signal: "disconnect" | "stealth";
  /** Claim category, e.g. "Revenue Growth", "Margin Trajectory" */
  category: string;
}
