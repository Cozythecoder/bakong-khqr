/**
 * EMV Parser for extracting tag-value pairs from EMV QR strings.
 */
export class EMVParser {
  public readonly raw: string;
  private readonly parsed: Map<string, string>;

  constructor(emvString: string) {
    this.raw = emvString;
    this.parsed = this.parseTags();
  }

  /**
   * Parse the EMV string into tag-value pairs.
   * @returns Map of tags to values
   */
  private parseTags(): Map<string, string> {
    let index = 0;
    const tags = new Map<string, string>();

    while (index < this.raw.length) {
      const tag = this.raw.slice(index, index + 2);
      const length = parseInt(this.raw.slice(index + 2, index + 4), 10);
      const value = this.raw.slice(index + 4, index + 4 + length);
      tags.set(tag, value);
      index += 4 + length;
    }

    return tags;
  }

  /**
   * Get the value for a specific tag.
   * @param tag - The 2-character tag code
   * @returns The value for the tag, or undefined if not found
   */
  public get(tag: string): string | undefined {
    return this.parsed.get(tag);
  }

  /**
   * Get all parsed tags.
   * @returns Map of all parsed tag-value pairs
   */
  public getAll(): Map<string, string> {
    return new Map(this.parsed);
  }
}
