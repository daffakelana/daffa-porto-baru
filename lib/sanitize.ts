import "server-only";
import sanitizeHtml from "sanitize-html";

/** Whitelist ketat: hanya markup inline yang dihasilkan editor. */
export function cleanRichText(dirty: string): string {
  const clean = sanitizeHtml(dirty, {
    allowedTags: ["p","br","strong","em","u","s","a","ul","ol","li","span"],
    allowedAttributes: {
      a: ["href","target","rel"],
      span: ["style"],
      p: ["style"],
    },
    allowedStyles: {
      "*": {
        color: [
          /^#(0x)?[0-9a-fA-F]+$/,
          /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
          /^var\(--[a-zA-Z0-9-]+\)$/,
        ],
      },
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

  if (clean === "" || clean === "<p></p>") return "";
  return clean;
}