import { EMV } from "./emv";

/**
 * Amount formatter for KHQR transaction amounts.
 */
export class Amount {
  private readonly transactionAmount: string;
  private readonly maxLength: number;

  constructor() {
    this.transactionAmount = EMV.transactionAmount;
    this.maxLength = EMV.invalidLengthAmount;
  }

  /**
   * Get the formatted amount value.
   * @param amount - The transaction amount to be formatted
   * @returns Formatted string including transaction amount tag, length, and amount
   */
  public value(amount: number | string): string {
    if (typeof amount !== "number" && typeof amount !== "string") {
      throw new Error("Amount must be a number or numeric string");
    }

    let amountFloat: number;
    try {
      amountFloat = parseFloat(String(amount));
      if (isNaN(amountFloat)) {
        throw new Error();
      }
    } catch {
      throw new Error(
        `Invalid amount value: ${amount}. Amount must be a number or a string representing a number.`
      );
    }

    // Format amount (no trailing zeros)
    let amountStr = amountFloat.toFixed(2);
    amountStr = amountStr.replace(/0+$/, "").replace(/\.$/, "");

    // EMV length = length of VALUE ONLY
    const lengthOfAmount = amountStr.length;

    if (lengthOfAmount > this.maxLength) {
      throw new Error(
        `Formatted Amount exceeds maximum length of ${this.maxLength} characters. ` +
          `Your input length: ${lengthOfAmount} characters.`
      );
    }

    const lengthStr = lengthOfAmount.toString().padStart(2, "0");

    return `${this.transactionAmount}${lengthStr}${amountStr}`;
  }
}
