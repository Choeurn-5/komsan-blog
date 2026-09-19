export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&rsquo;": "'",
    "&lsquo;": "'",
    "&rdquo;": '"',
    "&ldquo;": '"',
    "&mdash;": "-",
    "&ndash;": "-",
    "&#8211;": "-",
    "&#8212;": "-",
    "&#8216;": "'",
    "&#8217;": "'",
    "&#8220;": '"',
    "&#8221;": '"',
    "&#038;": "&",
  };
  return text.replace(/&[a-zA-Z0-9#]+;/g, (match) => entities[match] || " ");
}

export function cleanExcerpt(html: string, maxWords: number = 30): string {
  if (!html) return "";

  // 1. Remove dangerous or visual-breaking tags completely
  let cleanText = html.replace(/<(script|style|iframe|form|button)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, "");
  
  // 2. Remove common Elementor/builder structural wrappers
  cleanText = cleanText.replace(/<div[^>]*class="[^"]*(elementor|wp-block)[^"]*"[^>]*>/gi, "");
  
  // 3. Strip all HTML
  cleanText = stripHtml(cleanText);

  // 4. Decode entities
  cleanText = decodeHtmlEntities(cleanText);

  // 5. Truncate to word limit
  const words = cleanText.split(" ").filter(Boolean);
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(" ") + "...";
  }

  return words.join(" ");
}

export function cleanArticleContent(html: string): string {
  if (!html) return "";

  // 1. Remove dangerous tags and their content
  let safeHtml = html.replace(/<(script|style|iframe|form|button|object|embed|applet)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, "");

  // 2. Remove inline event handlers (e.g., onclick, onmouseover)
  safeHtml = safeHtml.replace(/\bon[a-z]+\s*=\s*(['"])(?:(?!\1)[^\\]|\\.)*\1/gi, "");

  // 3. Attempt to strip Elementor layout wrappers but keep content
  // Note: For a robust solution, we'd use isomorphic-dompurify or JSDOM. 
  // Since we want to keep the bundle lean and we're parsing server-side, we use regex carefully.
  // We remove elementor classes from div tags, or just rely on the frontend CSS to override them.
  // We'll clean out obviously bad attributes.
  safeHtml = safeHtml.replace(/<div\s+([^>]*)class="([^"]*elementor[^"]*)"([^>]*)>/gi, "<div $1 $3>");

  // 4. Fix potentially broken image URLs or strip bad src
  safeHtml = safeHtml.replace(/javascript:/gi, "#");

  return safeHtml;
}

export function calculateReadingTime(html: string): number {
  if (!html) return 1;
  const text = stripHtml(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
