import "server-only";
import sanitizeHtml from "sanitize-html";

/** Whitelist ketat: hanya markup inline yang dihasilkan editor. */
export function cleanRichText(dirty: string): string {
  const clean = sanitizeHtml(dirty, {
    allowedTags: ["p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
    },
  }).trim();

  // Anggap kosong kalau cuma paragraf hampa.
  if (clean === "" || clean === "<p></p>") return "";
  return clean;
}