export function formatPrice(amount: number, currency = "FCFA"): string {
  return new Intl.NumberFormat("fr-BJ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " " + currency;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-BJ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Encode a local image path so browsers and Next.js Image can handle
 * filenames with spaces, commas, % signs and other special characters.
 * External URLs (http/https) are returned as-is.
 */
export function safeImageUrl(path: string): string {
  if (!path || path.startsWith("http")) return path;
  // Encode each segment while preserving the leading slashes
  return path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}
