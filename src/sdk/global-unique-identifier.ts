import { EMV } from "./emv";

/**
 * Global Unique Identifier (GUID) for merchant account information.
 */
export class GlobalUniqueIdentifier {
  private readonly payloadFormatIndicator: string;
  private readonly merchantAccountInformationIndividual: string;
  private readonly maxLength: number;

  constructor() {
    this.payloadFormatIndicator = EMV.payloadFormatIndicator;
    this.merchantAccountInformationIndividual = EMV.merchantAccountInformationIndividual;
    this.maxLength = EMV.invalidLengthBakongAccount;
  }

  /**
   * Generate the global unique identifier based on the bank account.
   * @param bankAccount - The bank account number
   * @returns The formatted global unique identifier
   */
  public value(bankAccount: string): string {
    if (typeof bankAccount !== "string") {
      throw new TypeError("Bank account must be a string.");
    }

    const lengthOfBankAccount = bankAccount.length;

    if (lengthOfBankAccount > this.maxLength) {
      throw new Error(
        `Bank account cannot exceed ${this.maxLength} characters. ` +
          `Your input length: ${lengthOfBankAccount} characters.`
      );
    }

    const lengthStr = lengthOfBankAccount.toString().padStart(2, "0");

    const result = `${this.payloadFormatIndicator}${lengthStr}${bankAccount}`;

    const lengthResult = result.length.toString().padStart(2, "0");

    return `${this.merchantAccountInformationIndividual}${lengthResult}${result}`;
  }
}
