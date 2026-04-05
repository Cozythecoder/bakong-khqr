import { EMV } from "./emv";

/**
 * Transaction Currency formatter for KHQR codes.
 */
export class TransactionCurrency {
  private readonly transactionCurrency: string;
  private readonly currencyUsd: string;
  private readonly currencyKhr: string;

  constructor() {
    this.transactionCurrency = EMV.transactionCurrency;
    this.currencyUsd = EMV.transactionCurrencyUsd;
    this.currencyKhr = EMV.transactionCurrencyKhr;
  }

  /**
   * Generate the QR code data for the transaction currency.
   * @param currency - Currency code, either 'USD' or 'KHR'
   * @returns Formatted QR code data for the specified currency
   */
  public value(currency: string): string {
    const normalizedCurrency = currency.toUpperCase();

    let currencyValue: string;
    if (normalizedCurrency === "USD") {
      currencyValue = this.currencyUsd;
    } else if (normalizedCurrency === "KHR") {
      currencyValue = this.currencyKhr;
    } else {
      throw new Error(`Invalid currency code '${currency}'. Supported codes are 'USD' and 'KHR'.`);
    }

    const lengthOfCurrency = currencyValue.length.toString().padStart(2, "0");
    return `${this.transactionCurrency}${lengthOfCurrency}${currencyValue}`;
  }
}
