import { EMV } from "./emv";

/**
 * Merchant City formatter for KHQR codes.
 */
export class MerchantCity {
  private readonly merchantCityTag: string;
  private readonly maxLength: number;

  constructor() {
    this.merchantCityTag = EMV.merchantCity;
    this.maxLength = EMV.invalidLengthMerchantCity;
  }

  /**
   * Construct and retrieve the merchant city value with its length.
   * @param merchantCity - The name of the merchant's city
   * @returns The constructed merchant city value with its length
   */
  public value(merchantCity: string): string {
    if (!merchantCity) {
      throw new Error("Merchant city cannot be empty.");
    }

    const lengthOfMerchantCity = merchantCity.length;

    if (lengthOfMerchantCity > this.maxLength) {
      throw new Error(
        `Merchant City cannot exceed ${this.maxLength} characters. ` +
          `Your input length: ${lengthOfMerchantCity} characters.`
      );
    }

    const lengthStr = lengthOfMerchantCity.toString().padStart(2, "0");
    return `${this.merchantCityTag}${lengthStr}${merchantCity}`;
  }
}
