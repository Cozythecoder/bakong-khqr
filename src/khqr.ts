import {
  CRC,
  MCC,
  Hash,
  Amount,
  TimeStamp,
  CountryCode,
  MerchantCity,
  MerchantName,
  PointOfInitiation,
  TransactionCurrency,
  AdditionalDataField,
  PayloadFormatIndicator,
  GlobalUniqueIdentifier,
} from "./sdk";
import { request as httpsRequest } from "https";
import { URL } from "url";

export interface KHQROptions {
  /** Bakong Developer Token (required for API methods) */
  bakongToken?: string;
}

export interface CreateQROptions {
  /** Bank account from Bakong profile (e.g., your_name@bank) */
  bankAccount: string;
  /** Name of the merchant */
  merchantName: string;
  /** City of the merchant */
  merchantCity: string;
  /** Transaction amount */
  amount: number;
  /** Currency code: 'USD' or 'KHR' */
  currency: string;
  /** Store label or merchant reference */
  storeLabel?: string;
  /** Mobile number of the merchant */
  phoneNumber?: string;
  /** Bill number or transaction reference */
  billNumber?: string;
  /** Terminal label or transaction description */
  terminalLabel?: string;
  /** Static or Dynamic QR code (default: false for dynamic) */
  static?: boolean;
  /** Expiration time in days for the QR code (default: 1) */
  expiration?: number;
}

export interface DeepLinkOptions {
  /** QR code string from createQR() */
  qr: string;
  /** Callback URL (default: https://bakong.nbc.org.kh) */
  callback?: string;
  /** App icon URL (default: https://bakong.nbc.gov.kh/images/logo.svg) */
  appIconUrl?: string;
  /** Name of your app or website (default: MyAppName) */
  appName?: string;
}

export interface DeepLinkResponse {
  responseCode: number;
  message: string;
  data?: {
    shortLink: string;
  };
}

export interface TransactionResponse {
  responseCode: number;
  message: string;
  data?: {
    status: string;
    [key: string]: unknown;
  };
}

export interface BulkTransactionResponse {
  responseCode: number;
  message: string;
  data?: Array<{
    md5: string;
    status: string;
  }>;
}

/** Version of the library */
export const VERSION = "1.0.0";

/**
 * Main KHQR class for generating Cambodia payment QR codes compatible with Bakong.
 */
export class KHQR {
  private readonly crc: CRC;
  private readonly mcc: MCC;
  private readonly hash: Hash;
  private readonly amount: Amount;
  private readonly timestamp: TimeStamp;
  private readonly countryCode: CountryCode;
  private readonly merchantCity: MerchantCity;
  private readonly merchantName: MerchantName;
  private readonly pointOfInitiation: PointOfInitiation;
  private readonly transactionCurrency: TransactionCurrency;
  private readonly additionalDataField: AdditionalDataField;
  private readonly payloadFormatIndicator: PayloadFormatIndicator;
  private readonly globalUniqueIdentifier: GlobalUniqueIdentifier;
  private readonly bakongToken: string | undefined;
  private readonly bakongApi: string;

  constructor(options?: KHQROptions) {
    this.crc = new CRC();
    this.mcc = new MCC();
    this.hash = new Hash();
    this.amount = new Amount();
    this.timestamp = new TimeStamp();
    this.countryCode = new CountryCode();
    this.merchantCity = new MerchantCity();
    this.merchantName = new MerchantName();
    this.pointOfInitiation = new PointOfInitiation();
    this.transactionCurrency = new TransactionCurrency();
    this.additionalDataField = new AdditionalDataField();
    this.payloadFormatIndicator = new PayloadFormatIndicator();
    this.globalUniqueIdentifier = new GlobalUniqueIdentifier();

    this.bakongToken = options?.bakongToken;

    // Set the API endpoint based on the provided token
    if (this.bakongToken && this.bakongToken.startsWith("rbk")) {
      this.bakongApi = "https://api.bakongrelay.com/v1";
    } else {
      this.bakongApi = "https://api-bakong.nbc.gov.kh/v1";
    }
  }

  /**
   * Check if Bakong token is provided.
   * @throws Error if token is not provided
   */
  private checkBakongToken(): void {
    if (!this.bakongToken) {
      throw new Error(
        "Bakong Developer Token is required for this operation. " +
          "Initialize KHQR with: new KHQR({ bakongToken: 'your_token' })"
      );
    }
  }

  /**
   * Make a POST request to the Bakong API using Node.js https (like Python's http.client).
   * @param endpoint - API endpoint path
   * @param payload - Request body
   * @returns Response data
   */
  private postRequest<T>(endpoint: string, payload: unknown): Promise<T> {
    this.checkBakongToken();

    const parsedUrl = new URL(this.bakongApi);
    const fullPath = parsedUrl.pathname + endpoint;
    const payloadData = JSON.stringify(payload);

    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: fullPath,
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.bakongToken}`,
        "Content-Type": "application/json",
        "User-Agent": `bakong-khqr-ts/${VERSION} (+https://github.com/bakong-khqr); Mozilla/5.0`,
        "Content-Length": Buffer.byteLength(payloadData),
      },
    };

    return new Promise((resolve, reject) => {
      const req = httpsRequest(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(data) as T);
            } catch (e) {
              reject(new Error(`Invalid JSON response: ${data}`));
            }
          } else if (res.statusCode === 400) {
            reject(new Error("Bad request. Please check your input parameters and try again."));
          } else if (res.statusCode === 401) {
            reject(new Error("Your Developer Token is either incorrect or expired. Please renew it through Bakong Developer."));
          } else if (res.statusCode === 403) {
            reject(new Error("Bakong API only accepts requests from Cambodia IP addresses. Your IP may be blocked or restricted."));
          } else if (res.statusCode === 404) {
            reject(new Error("The requested Bakong API endpoint does not exist. Please check the endpoint URL."));
          } else if (res.statusCode === 429) {
            reject(new Error("Too many requests. Please wait a while before trying again."));
          } else if (res.statusCode === 500) {
            reject(new Error("Bakong server encountered an internal error. Please try again later."));
          } else if (res.statusCode === 504) {
            reject(new Error("Bakong server is busy, please try again later."));
          } else {
            reject(new Error(`Something went wrong. HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.write(payloadData);
      req.end();
    });
  }

  /**
   * Create a QR code string based on provided information.
   * @param options - QR code creation options
   * @returns Generated QR code as a string
   */
  public createQR(options: CreateQROptions): string {
    const {
      bankAccount,
      merchantName,
      merchantCity,
      amount,
      currency,
      storeLabel,
      phoneNumber,
      billNumber,
      terminalLabel,
      static: isStatic = false,
      expiration = 1,
    } = options;

    // Static QR when amount is 0 or less
    const staticQr = amount <= 0 ? true : isStatic;

    let qrData = "";
    qrData += this.payloadFormatIndicator.value();
    qrData += staticQr ? this.pointOfInitiation.static() : this.pointOfInitiation.dynamic();
    qrData += this.globalUniqueIdentifier.value(bankAccount);
    qrData += this.mcc.value();
    qrData += this.transactionCurrency.value(currency);
    if (!staticQr) {
      qrData += this.amount.value(amount);
    }
    qrData += this.countryCode.value();
    qrData += this.merchantName.value(merchantName);
    qrData += this.merchantCity.value(merchantCity);

    const additionalData = this.additionalDataField.value(
      storeLabel,
      phoneNumber,
      billNumber,
      terminalLabel
    );
    if (additionalData) {
      qrData += additionalData;
    }

    qrData += this.timestamp.value(staticQr, expiration);
    qrData += this.crc.value(qrData);

    return qrData;
  }

  /**
   * Generate an MD5 hash for the QR code.
   * @param qr - QR code string from createQR()
   * @returns MD5 hash as a string (32 characters)
   */
  public generateMD5(qr: string): string {
    return this.hash.md5(qr);
  }

  /**
   * Generate a deep link for the QR code.
   * @param options - Deep link options
   * @returns Deep link URL as a string, or null if generation failed
   */
  public async generateDeepLink(options: DeepLinkOptions): Promise<string | null> {
    const {
      qr,
      callback = "https://bakong.nbc.org.kh",
      appIconUrl = "https://bakong.nbc.gov.kh/images/logo.svg",
      appName = "MyAppName",
    } = options;

    const payload = {
      qr,
      sourceInfo: {
        appIconUrl,
        appName,
        appDeepLinkCallback: callback,
      },
    };

    const response = await this.postRequest<DeepLinkResponse>("/generate_deeplink_by_qr", payload);
    return response.responseCode === 0 ? response.data?.shortLink || null : null;
  }

  /**
   * Check the transaction status based on the MD5 hash.
   * @param md5 - MD5 hash from generateMD5()
   * @returns Transaction status: 'PAID' or 'UNPAID'
   */
  public async checkPayment(md5: string): Promise<"PAID" | "UNPAID"> {
    const payload = { md5 };
    const response = await this.postRequest<TransactionResponse>("/check_transaction_by_md5", payload);
    return response.responseCode === 0 ? "PAID" : "UNPAID";
  }

  /**
   * Retrieve information about a paid transaction based on MD5 hash.
   * @param md5 - MD5 hash from generateMD5()
   * @returns Transaction information object if paid, or null if unpaid
   */
  public async getPayment(md5: string): Promise<Record<string, unknown> | null> {
    const payload = { md5 };
    const response = await this.postRequest<TransactionResponse>("/check_transaction_by_md5", payload);
    return response.responseCode === 0 ? (response.data as Record<string, unknown>) || null : null;
  }

  /**
   * Check the transaction status for multiple MD5 hashes.
   * @param md5List - Array of MD5 hashes from generateMD5()
   * @returns Array of MD5 hashes for paid transactions
   * @throws Error if md5List exceeds 50 items
   */
  public async checkBulkPayments(md5List: string[]): Promise<string[]> {
    if (md5List.length > 50) {
      throw new Error("The md5List exceeds the allowed limit of 50 hashes per request.");
    }

    const response = await this.postRequest<BulkTransactionResponse>("/check_transaction_by_md5_list", md5List);
    return (response.data || []).filter((item) => item.status === "SUCCESS").map((item) => item.md5);
  }
}

export default KHQR;
