import { EMV } from "./emv";

/**
 * Merchant Category Code (MCC) for KHQR codes.
 */
export class MCC {
  private readonly merchantCategoryCodeTag: string;
  private readonly defaultMerchantCategoryCode: string;

  constructor() {
    this.merchantCategoryCodeTag = EMV.merchantCategoryCode;
    this.defaultMerchantCategoryCode = EMV.defaultMerchantCategoryCode;
  }

  /**
   * Construct and retrieve the merchant category code value with its length.
   * @param categoryCode - The merchant category code. If not provided, uses the default value.
   * @returns The constructed merchant category code value with its length
   */
  public value(categoryCode?: string): string {
    const code = categoryCode || this.defaultMerchantCategoryCode;

    if (!/^\d{4,}$/.test(code)) {
      throw new Error("Category code must be a numeric string with at least 4 digits.");
    }

    const lengthStr = code.length.toString().padStart(2, "0");

    return `${this.merchantCategoryCodeTag}${lengthStr}${code}`;
  }
}
