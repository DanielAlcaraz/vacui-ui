export interface Heading {
  level: number;
  text: string;
}

/**
 * Extracts headings from Markdown content.
 * @param content The Markdown content as a string.
 * @returns An array of Heading objects.
 */
export function extractMarkdownHeadings(content: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim()
    });
  }

  return headings;
}
