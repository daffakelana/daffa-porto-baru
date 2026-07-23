export const DEFAULT_COLLECTION_SLUG = "general";

/** Slug yang dipakai route statis — tidak boleh jadi slug koleksi. */
const RESERVED_SLUGS = new Set([
  "work",
  "resume",
  "blog",
  "creative-space",
  "coming-soon",
  "api",
  "images",
  "fonts",
  "favicon.ico",
  "_next",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}