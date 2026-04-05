import { EMV } from "./emv";

/**
 * Additional Data Field for KHQR codes (store label, phone number, bill number, terminal label).
 */
export class AdditionalDataField {
  private readonly additionalDataTag: string;
  private readonly storeLabelTag: string;
  private readonly mobileNumberTag: string;
  private readonly billNumberTag: string;
  private readonly terminalLabelTag: string;
  private readonly storeLabelMax: number;
  private readonly mobileMax: number;
  private readonly billMax: number;
  private readonly terminalMax: number;

  constructor() {
    this.additionalDataTag = EMV.additionDataTag;
    this.storeLabelTag = EMV.storeLabel;
    this.mobileNumberTag = EMV.additionDataFieldMobileNumber;
    this.billNumberTag = EMV.billnumberTag;
    this.terminalLabelTag = EMV.terminalLabel;

    this.storeLabelMax = EMV.invalidLengthStoreLabel;
    this.mobileMax = EMV.invalidLengthMobileNumber;
    this.billMax = EMV.invalidLengthBillNumber;
    this.terminalMax = EMV.invalidLengthTerminalLabel;
  }

  /**
   * Format a single sub-field: TAG + LENGTH (02) + VALUE
   */
  private formatField(tag: string, value: string): string {
    const valueStr = value.trim();
    if (!valueStr) {
      return "";
    }
    const length = valueStr.length.toString().padStart(2, "0");
    return `${tag}${length}${valueStr}`;
  }

  /**
   * Validate the length of a field value.
   */
  private validateLength(value: string, maxLength: number, fieldName: string): void {
    if (value.length > maxLength) {
      throw new Error(
        `${fieldName} cannot exceed ${maxLength} characters. ` +
          `Your input length: ${value.length} characters.`
      );
    }
  }

  /**
   * Normalize Khmer phone number to standard format (0XXXXXXXXX).
   */
  private normalizePhoneNumber(phoneNumber: string): string {
    let digits = phoneNumber.replace(/\D/g, "");
    if (digits.startsWith("855")) {
      digits = digits.slice(3);
    }
    if (!digits.startsWith("0")) {
      digits = "0" + digits;
    }
    return digits;
  }

  /**
   * Combine all formatted values into a single string with a length prefix.
   * @param storeLabel - The store label
   * @param phoneNumber - The phone number
   * @param billNumber - The bill number
   * @param terminalLabel - The terminal label
   * @returns Combined formatted string with length prefix, or empty string if no additional data
   */
  public value(
    storeLabel?: string,
    phoneNumber?: string,
    billNumber?: string,
    terminalLabel?: string
  ): string {
    const subFields: string[] = [];

    if (storeLabel) {
      this.validateLength(storeLabel, this.storeLabelMax, "Store label");
      subFields.push(this.formatField(this.storeLabelTag, storeLabel));
    }

    if (phoneNumber) {
      const normalizedPhone = this.normalizePhoneNumber(phoneNumber);
      this.validateLength(normalizedPhone, this.mobileMax, "Phone number");
      subFields.push(this.formatField(this.mobileNumberTag, normalizedPhone));
    }

    if (billNumber) {
      this.validateLength(billNumber, this.billMax, "Bill number");
      subFields.push(this.formatField(this.billNumberTag, billNumber));
    }

    if (terminalLabel) {
      this.validateLength(terminalLabel, this.terminalMax, "Terminal label");
      subFields.push(this.formatField(this.terminalLabelTag, terminalLabel));
    }

    if (subFields.length === 0) {
      return "";
    }

    const combined = subFields.join("");
    const totalLength = combined.length.toString().padStart(2, "0");

    return `${this.additionalDataTag}${totalLength}${combined}`;
  }
}
