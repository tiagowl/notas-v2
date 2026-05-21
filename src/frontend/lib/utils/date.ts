import { format, formatDistanceToNow, subDays, startOfMonth, parseISO, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatNoteDate(iso: string): string {
  return format(parseISO(iso), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatRelativeDate(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: ptBR });
}

export function formatShortDate(iso: string): string {
  return format(parseISO(iso), "d MMM yyyy", { locale: ptBR });
}

export function toDateInputValue(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd");
}

export function getDateRangeFromPreset(
  preset: "all" | "7d" | "30d" | "month"
): { from?: string; to?: string } {
  const now = new Date();
  if (preset === "all") return {};
  if (preset === "7d") return { from: subDays(now, 7).toISOString(), to: now.toISOString() };
  if (preset === "30d") return { from: subDays(now, 30).toISOString(), to: now.toISOString() };
  if (preset === "month") return { from: startOfMonth(now).toISOString(), to: now.toISOString() };
  return {};
}

export function isInDateRange(
  publishedAt: string,
  from?: string,
  to?: string
): boolean {
  if (!from && !to) return true;
  const date = parseISO(publishedAt);
  const start = from ? parseISO(from) : new Date(0);
  const end = to ? parseISO(to) : new Date();
  return isWithinInterval(date, { start, end });
}
