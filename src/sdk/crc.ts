import { EMV } from "./emv";

/**
 * CRC (Cyclic Redundancy Check) utility class for KHQR codes.
 * Uses CRC-CCITT polynomial for generating checksums.
 */
export class CRC {
  private readonly crcTag: string;
  private readonly defaultCrcTag: string;

  constructor() {
    this.crcTag = EMV.crc;
    this.defaultCrcTag = EMV.defaultCrcTag;
  }

  /**
   * Calculate CRC-16 using the CRC-CCITT polynomial.
   * @param data - Input data as a string
   * @returns Computed CRC-16 value
   */
  private calculateCrc16(data: string): number {
    let crc = 0xffff; // Initial CRC value
    const polynomial = 0x1021; // CRC-CCITT polynomial

    for (const byte of Buffer.from(data, "utf-8")) {
      crc ^= byte << 8;
      for (let i = 0; i < 8; i++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc <<= 1;
        }
        crc &= 0xffff; // Ensure it stays 16-bit
      }
    }
    return crc;
  }

  /**
   * Get the CRC-16 value in hexadecimal format.
   * @param data - Input data as a string
   * @returns CRC-16 value as a hexadecimal string (4 characters)
   */
  private crc16Hex(data: string): string {
    const crc16Result = this.calculateCrc16(data);
    return crc16Result.toString(16).toUpperCase().padStart(4, "0");
  }

  /**
   * Compute the CRC-16 value including the CRC tag and format it.
   * @param data - Input data as a string
   * @returns Formatted string including CRC tag and CRC value
   */
  public value(data: string): string {
    const crc16Hex = this.crc16Hex(data + this.defaultCrcTag);
    const lengthOfCrc = crc16Hex.length.toString().padStart(2, "0");
    return `${this.crcTag}${lengthOfCrc}${crc16Hex}`;
  }
}
