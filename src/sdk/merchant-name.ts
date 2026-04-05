import { EMV } from "./emv";

/**
 * Merchant Name formatter for KHQR codes.
 */
export class MerchantName {
  private readonly merchantNameTag: string;
  private readonly maxLength: number;

  constructor() {
    this.merchantNameTag = EMV.merchantName;
    this.maxLength = EMV.invalidLengthMerchantName;
  }

  /**
   * Construct and retrieve the merchant name value with its length.
   * @param merchantName - The name of the merchant
   * @returns The constructed merchant name value with its length
   */
  public value(merchantName: string): string {
    if (!merchantName) {
      throw new Error("Merchant Name cannot be empty.");
    }

    const lengthOfMerchantName = merchantName.length;

    if (lengthOfMerchantName > this.maxLength) {
      throw new Error(
        `Merchant Name cannot exceed ${this.maxLength} characters. ` +
          `Your input length: ${lengthOfMerchantName} characters.`
      );
    }

    const lengthStr = lengthOfMerchantName.toString().padStart(2, "0");
    return `${this.merchantNameTag}${lengthStr}${merchantName}`;
  }
}
