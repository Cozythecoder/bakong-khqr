import QRCode from "qrcode";
import { EMVParser } from "./sdk/emv-parser";

/** Image format options for QR code export */
export type ImageFormat = "png" | "jpeg" | "webp" | "svg" | "base64" | "data-uri" | "buffer";

/** Result of QR image generation with multiple export options */
export interface QRImageResult {
  /** Raw canvas or buffer data (implementation dependent on environment) */
  data: Buffer | string;
  /** Export the image to various formats */
  toBuffer(): Promise<Buffer>;
  toBase64(): Promise<string>;
  toDataURI(): Promise<string>;
  toPNG(path?: string): Promise<string>;
  toJPEG(path?: string): Promise<string>;
  toWebP(path?: string): Promise<string>;
  toSVG(): Promise<string>;
}

/**
 * QR Image Generator for creating styled KHQR images.
 * This is a simplified implementation using the qrcode library.
 * For full styling like the Python version, additional canvas libraries would be needed.
 */
export class QRImageGenerator {
  /**
   * Parse the QR string to extract merchant info and amount.
   */
  private parseQRString(qrString: string): {
    merchantName: string;
    amount: number;
    currency: string;
  } {
    const parser = new EMVParser(qrString);
    const merchantName = parser.get("59") || "Unknown";
    const amountStr = parser.get("54") || "0";
    const currencyCode = parser.get("53") || "840";
    const currency = currencyCode === "840" ? "USD" : "KHR";
    return { merchantName, amount: parseFloat(amountStr) || 0, currency };
  }

  /**
   * Format amount with proper grouping for display.
   */
  private formatAmount(amount: number, currency: string): string {
    if (amount <= 0) {
      return "0";
    }
    if (currency === "USD") {
      const parts = amount.toFixed(2).split(".");
      const grouped = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return `${grouped},${parts[1]}`;
    } else {
      return amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
  }

  /**
   * Generate a QR code image from the QR string.
   * @param qrString - The QR code string from createQR()
   * @returns QRImageResult with export methods
   */
  public async generate(qrString: string): Promise<QRImageResult> {
    const { merchantName, amount, currency } = this.parseQRString(qrString);

    // Generate QR code as data URI
    const dataUri = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: "L",
      margin: 4,
      width: 280,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    const result: QRImageResult = {
      data: dataUri,
      toBuffer: async (): Promise<Buffer> => {
        const base64 = dataUri.replace(/^data:image\/png;base64,/, "");
        return Buffer.from(base64, "base64");
      },
      toBase64: async (): Promise<string> => {
        return dataUri.replace(/^data:image\/png;base64,/, "");
      },
      toDataURI: async (): Promise<string> => dataUri,
      toPNG: async (path?: string): Promise<string> => {
        if (path) {
          await QRCode.toFile(path, qrString, {
            errorCorrectionLevel: "L",
            margin: 4,
            width: 280,
          });
          return path;
        }
        return dataUri;
      },
      toJPEG: async (path?: string): Promise<string> => {
        // JPEG is not directly supported by qrcode lib, would need canvas conversion
        throw new Error("JPEG export requires canvas library. Use PNG or use toBuffer() and convert manually.");
      },
      toWebP: async (path?: string): Promise<string> => {
        // WebP is not directly supported by qrcode lib
        throw new Error("WebP export requires canvas library. Use PNG or use toBuffer() and convert manually.");
      },
      toSVG: async (): Promise<string> => {
        return QRCode.toString(qrString, {
          type: "svg",
          errorCorrectionLevel: "L",
          margin: 4,
        });
      },
    };

    return result;
  }
}

/**
 * Convenience function to generate a QR code image.
 * @param qrString - The QR code string from createQR()
 * @param format - Output format (default: 'png')
 * @returns Image data in the requested format
 */
export async function generateQRImage(
  qrString: string,
  format: ImageFormat = "png"
): Promise<Buffer | string> {
  const generator = new QRImageGenerator();
  const result = await generator.generate(qrString);

  switch (format) {
    case "buffer":
      return result.toBuffer();
    case "base64":
      return result.toBase64();
    case "data-uri":
      return result.toDataURI();
    case "svg":
      return result.toSVG();
    case "png":
    case "jpeg":
    case "webp":
    default:
      return result.toDataURI();
  }
}

export default QRImageGenerator;
