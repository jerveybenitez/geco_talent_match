export function toTitleCase(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => (word.length === 0 ? word : word[0].toUpperCase() + word.slice(1).toLowerCase()))
    .join(" ");
}

/**
 * Splits a comma-separated string (or array of raw strings) into title-cased,
 * de-duplicated names (case-insensitive de-dupe, first occurrence wins the casing).
 */
export function parseUniqueTitleCaseNames(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];

  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const cased = toTitleCase(item);
    if (!cased) continue;
    const key = cased.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(cased);
  }
  return result;
}
