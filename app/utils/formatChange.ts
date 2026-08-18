export function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";

  return `${sign}${change.toFixed(2)}%`;
}
