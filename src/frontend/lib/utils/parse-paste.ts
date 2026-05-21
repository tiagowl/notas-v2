export function parsePastedContent(raw: string): { title: string; content: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { title: "Sem título", content: "" };

  const lines = trimmed.split("\n");
  const first = lines[0]?.trim() ?? "";

  if (first.startsWith("# ")) {
    return {
      title: first.slice(2).trim() || "Sem título",
      content: lines.slice(1).join("\n").trim() || trimmed,
    };
  }

  if (first.length > 0 && first.length <= 80 && lines.length > 1) {
    return { title: first, content: lines.slice(1).join("\n").trim() };
  }

  const words = trimmed.split(/\s+/).slice(0, 8).join(" ");
  return {
    title: words.length > 60 ? `${words.slice(0, 60)}…` : words || "Sem título",
    content: trimmed,
  };
}
