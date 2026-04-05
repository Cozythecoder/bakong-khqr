import { EMV } from "./emv";

/**
 * Timestamp formatter for KHQR QR codes.
 */
export class TimeStamp {
  private readonly languagePreference: string;
  private readonly languagePreferenceExp: string;
  private readonly timestampTag: string;

  constructor() {
    this.languagePreference = EMV.languagePerference;
    this.languagePreferenceExp = EMV.languagePerferenceExp;
    this.timestampTag = EMV.timestampTag;
  }

  /**
   * Generate the QR code data for the current timestamp.
   * @param static - Whether the QR code is static (true) or dynamic (false)
   * @param expiration - Expiration time in days (default: 1 day). Only used when static=false.
   * @returns Formatted QR code data including language preference, timestamp, and expiration (for dynamic QR only)
   */
  public value(staticQr: boolean, expiration: number = 1): string {
    // Get current timestamp in milliseconds
    const timestamp = Date.now().toString();
    const lengthOfTimestamp = timestamp.length.toString().padStart(2, "0");

    // Start building the result with language preference + timestamp
    let result = `${this.languagePreference}${lengthOfTimestamp}${timestamp}`;

    // Only add expiration part for dynamic QR codes (static=false)
    if (!staticQr) {
      if (expiration < 1) {
        throw new Error(
          `Expiration time cannot be less than 1 day. Your input: ${expiration} days.`
        );
      }

      // Convert expiration from days to milliseconds
      const expMs = expiration * 86400 * 1000;
      const expirationTime = (Date.now() + expMs).toString();
      const lengthOfExpirationTime = expirationTime.length.toString().padStart(2, "0");

      // Append expiration section
      result += `${this.languagePreferenceExp}${lengthOfExpirationTime}${expirationTime}`;
    }

    // Format the total length of the result
    const lengthResult = result.length.toString().padStart(2, "0");

    // Return final formatted string with timestamp tag
    return `${this.timestampTag}${lengthResult}${result}`;
  }
}
