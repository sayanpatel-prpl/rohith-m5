// ---------------------------------------------------------------------------
// Intl.NumberFormat instances at MODULE SCOPE (expensive to construct;
// reuse across all calls per RESEARCH.md anti-pattern guidance)
// ---------------------------------------------------------------------------

const indianNumberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

const indianIntegerFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

// ---------------------------------------------------------------------------
// INR Formatters
// ---------------------------------------------------------------------------

/**
 * Format amount in INR Crore.
 * @example formatINRCr(1500) => "INR 1,500 Cr"
 * @example formatINRCr(0.5)  => "INR 0.5 Cr"
 */
export function formatINRCr(amountInCr: number): string {
  // For values >= 100, drop fractional part for cleaner display
  if (Math.abs(amountInCr) >= 100) {
    return `INR ${indianIntegerFormatter.format(Math.round(amountInCr))} Cr`;
  }
  return `INR ${indianNumberFormatter.format(amountInCr)} Cr`;
}

/**
 * Format amount in INR Lakh.
 * @example formatINRLakh(45.2) => "INR 45.2 L"
 */
export function formatINRLakh(amountInLakh: number): string {
  return `INR ${indianNumberFormatter.format(amountInLakh)} L`;
}

/**
 * Auto-select Crore or Lakh based on magnitude (input always in Crore).
 * Values < 1 Cr are converted to Lakh for readability.
 * @example formatINRAuto(1500) => "INR 1,500 Cr"
 * @example formatINRAuto(0.5)  => "INR 50 L"
 */
export function formatINRAuto(amountInCr: number): string {
  if (Math.abs(amountInCr) < 1) {
    return formatINRLakh(amountInCr * 100);
  }
  return formatINRCr(amountInCr);
}

// ---------------------------------------------------------------------------
// Percentage & Basis Point Formatters
// ---------------------------------------------------------------------------

/**
 * Format percentage with explicit sign.
 * @example formatPercent(12.5)  => "+12.5%"
 * @example formatPercent(-3.2)  => "-3.2%"
 * @example formatPercent(0)     => "0.0%"
 */
export function formatPercent(value: number, decimals = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format basis points with explicit sign.
 * @example formatBps(180) => "+180 bps"
 * @example formatBps(-50) => "-50 bps"
 */
export function formatBps(bps: number): string {
  const sign = bps > 0 ? "+" : "";
  return `${sign}${Math.round(bps)} bps`;
}

/**
 * Format growth rate (input as decimal fraction) with period.
 * @example formatGrowthRate(0.125)        => "+12.5% YoY"
 * @example formatGrowthRate(0.125, "QoQ") => "+12.5% QoQ"
 * @example formatGrowthRate(-0.032)       => "-3.2% YoY"
 */
export function formatGrowthRate(
  rate: number,
  period: "QoQ" | "YoY" = "YoY",
): string {
  return `${formatPercent(rate * 100)} ${period}`;
}

// ---------------------------------------------------------------------------
// Generic Indian Number Formatter
// ---------------------------------------------------------------------------

/**
 * Format a number with Indian grouping (no currency symbol).
 * Uses the standard ##,##,### pattern for numbers >= 1000.
 * @example formatIndianNumber(150000) => "1,50,000"
 */
export function formatIndianNumber(value: number): string {
  return indianNumberFormatter.format(value);
}
