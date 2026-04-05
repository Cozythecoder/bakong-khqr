import { EMV } from "./emv";

/**
 * Point of Initiation method for KHQR QR codes (static or dynamic).
 */
export class PointOfInitiation {
  private readonly dynamicQr: string;
  private readonly staticQr: string;

  constructor() {
    this.dynamicQr = EMV.defaultDynamicQr;
    this.staticQr = EMV.defaultStaticQr;
  }

  /**
   * Retrieve the dynamic QR code setting.
   * @returns The dynamic QR code setting
   */
  public dynamic(): string {
    return this.dynamicQr;
  }

  /**
   * Retrieve the static QR code setting.
   * @returns The static QR code setting
   */
  public static(): string {
    return this.staticQr;
  }
}
