export type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | { [k: string]: any };

function toClassString(v: ClassValue): string {
  if (!v) return "";

  if (typeof v === "string" || typeof v === "number") return String(v);

  if (Array.isArray(v)) {
    return v.map(toClassString).filter(Boolean).join(" ");
  }

  if (typeof v === "object") {
    const out: string[] = [];
    for (const [k, val] of Object.entries(v)) {
      if (val) out.push(k);
    }
    return out.join(" ");
  }

  return "";
}

/**
 * cn(...) - tiny className combiner (clsx-like)
 * Keeps this package lightweight and dependency-free.
 */
export function cn(...values: ClassValue[]): string {
  return values.map(toClassString).filter(Boolean).join(" ");
}
