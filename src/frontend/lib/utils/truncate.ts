export function truncate(text: string, max = 150): string {
  const plain = text.replace(/[#*`_~\[\]()]/g, "").replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).trim()}…`;
}
