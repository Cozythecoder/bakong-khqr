/**
 * EMV Constants used for encoding and decoding QR codes
 * for transactions supported by the Bakong app.
 */
export const EMV = {
  // Default QR Code Types
  defaultDynamicQr: "010212",
  defaultStaticQr: "010211",

  // Currency Codes
  transactionCurrencyUsd: "840",
  transactionCurrencyKhr: "116",
  transactionCurrency: "53",

  // Payload and Point of Initiation
  payloadFormatIndicator: "00",
  defaultPayloadFormatIndicator: "01",
  pointOfInitiationMethod: "01",

  // Merchant Information
  merchantName: "59",
  merchantCity: "60",
  defaultMerchantCity: "Phnom Penh",
  merchantCategoryCode: "52",
  defaultMerchantCategoryCode: "5999",

  // QR Code Identifiers
  staticQr: "11",
  dynamicQr: "12",
  merchantAccountInformationIndividual: "29",
  merchantAccountInformationMerchant: "30",

  // Transaction Details
  transactionAmount: "54",
  defaultTransactionAmount: "0",
  countryCode: "58",
  defaultCountryCode: "KH",

  // Additional Data Tags
  additionDataTag: "62",
  billnumberTag: "01",
  additionDataFieldMobileNumber: "02",
  storeLabel: "03",
  terminalLabel: "07",
  purposeOfTransaction: "08",
  timestampTag: "99",
  merchantInformationLanguageTemplate: "64",

  // Language Preferences
  languagePerference: "00",
  languagePerferenceExp: "01",
  merchantNameAlternativeLanguage: "01",
  merchantCityAlternativeLanguage: "02",

  // UnionPay Specific
  unionpayMerchantAccount: "15",

  // CRC Tag
  crc: "63",
  crcLength: "04",
  defaultCrcTag: "6304",

  // Invalid Length Constraints
  invalidLengthKhqr: 12,
  invalidLengthMerchantName: 25,
  invalidLengthBakongAccount: 32,
  invalidLengthAmount: 13,
  invalidLengthCountryCode: 3,
  invalidLengthMerchantCategoryCode: 4,
  invalidLengthMerchantCity: 15,
  invalidLengthTimestamp: 13,
  invalidLengthTransactionAmount: 14,
  invalidLengthTransactionCurrency: 3,
  invalidLengthBillNumber: 25,
  invalidLengthStoreLabel: 25,
  invalidLengthTerminalLabel: 25,
  invalidLengthPurposeOfTransaction: 25,
  invalidLengthMerchantId: 32,
  invalidLengthAcquiringBank: 32,
  invalidLengthMobileNumber: 25,
  invalidLengthAccountInformation: 32,
  invalidLengthMerchantNameLanguageTemplate: 99,
  invalidLengthUpiMerchant: 99,
  invalidLengthLanguagePerference: 2,
  invalidLengthMerchantNameAlternativeLanguage: 25,
  invalidLengthMerchantCityAlternativeLanguage: 15,
} as const;
