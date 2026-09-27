// Accept persisted JSON as well as editor JSON without trusting its shape.
export function imageSources(value: unknown): Set<string> {
  const sources = new Set<string>();
  function visit(node: unknown) {
    if (!node || typeof node !== "object") return;
    const item = node as Record<string, unknown>;
    const attrs = item.attrs as Record<string, unknown> | undefined;
    if (item.type === "image" && typeof attrs?.src === "string") {
      sources.add(attrs.src);
    }
    if (Array.isArray(item.content)) item.content.forEach(visit);
  }
  visit(value);
  return sources;
}

export function uploadThingKey(source: string): string | null {
  try {
    const url = new URL(source);
    if (url.protocol !== "https:" ||
      !(url.hostname === "utfs.io" || url.hostname.endsWith(".ufs.sh"))) return null;
    return /^\/f\/([^/]+)$/.exec(url.pathname)?.[1] || null;
  } catch {
    return null;
  }
}
