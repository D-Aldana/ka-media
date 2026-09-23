/** "52pts/10reb vs lord tweedsmuir" reads as two lines in the design. */
export function splitStatLine(statLine: string): string[] {
  const at = statLine.indexOf(" vs ");
  if (at === -1) return [statLine];
  return [statLine.slice(0, at), statLine.slice(at + 1)];
}
