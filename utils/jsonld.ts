export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aightai.in";

export interface CollectionItem {
  url: string;
  name: string;
}

export interface CollectionLdInput {
  path: string;
  name: string;
  description: string;
  items: CollectionItem[];
  itemType?: string;
}

export function buildCollectionLd({
  path,
  name,
  description,
  items,
  itemType = "Thing",
}: CollectionLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "url": `${SITE_URL}${path}`,
    "name": name,
    "description": description,
    "isPartOf": { "@type": "WebSite", "url": SITE_URL, "name": "AIght" },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": items.length,
      "itemListElement": items.slice(0, 50).map((item, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
        "name": item.name,
        "item": {
          "@type": itemType,
          "name": item.name,
          "url": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
        },
      })),
    },
  };
}
