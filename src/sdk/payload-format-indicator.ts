import { EMV } from "./emv";

/**
 * Payload Format Indicator for KHQR codes.
 */
export class PayloadFormatIndicator {
  private readonly payloadFormatIndicator: string;
  private readonly defaultPayloadFormatIndicator: string;

  constructor() {
    this.payloadFormatIndicator = EMV.payloadFormatIndicator;
    this.defaultPayloadFormatIndicator = EMV.defaultPayloadFormatIndicator;
  }

  /**
   * Construct and retrieve the payload format indicator value.
   * @returns The constructed payload format indicator value
   */
  public value(): string {
    const length = this.defaultPayloadFormatIndicator.length;
    const lengthStr = length.toString().padStart(2, "0");

    return `${this.payloadFormatIndicator}${lengthStr}${this.defaultPayloadFormatIndicator}`;
  }
}
