/** Detect stored HTML (legacy or pasted from rich sources) vs Markdown/plain text */
export function isHtmlContent(content: string): boolean {
  const trimmed = content.trim();
  if (!trimmed.startsWith("<")) return false;
  return /<(p|div|h[1-6]|ul|ol|table|blockquote|pre|br|span)\b/i.test(trimmed);
}
