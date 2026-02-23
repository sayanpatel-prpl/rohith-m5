/**
 * PDF export utility.
 *
 * Uses the browser's native print dialog which allows the user to
 * "Save as PDF". No external PDF library required.
 */
export function triggerPDFExport(): void {
  window.print();
}
