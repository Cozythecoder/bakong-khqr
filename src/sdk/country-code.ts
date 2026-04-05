import { EMV } from "./emv";

/**
 * Country Code formatter for KHQR codes.
 */
export class CountryCode {
  private readonly countryCodeTag: string;
  private readonly defaultCountryCode: string;

  constructor() {
    this.countryCodeTag = EMV.countryCode;
    this.defaultCountryCode = EMV.defaultCountryCode;
  }

  /**
   * Get the formatted country code value.
   * @param countryCode - Optional custom country code. If not provided, the default is used.
   * @returns Formatted string including country code and its length
   */
  public value(countryCode?: string): string {
    const code = countryCode || this.defaultCountryCode;
    const lengthOfCountryCode = code.length.toString().padStart(2, "0");
    return `${this.countryCodeTag}${lengthOfCountryCode}${code}`;
  }
}
