<div align="center">

# bakong-khqr

**TypeScript library for generating KHQR codes (Cambodia's national payment QR standard)**

[![npm version](https://badge.fury.io/js/bakong-khqr.svg)](https://www.npmjs.com/package/bakong-khqr)
[![CI](https://github.com/yourusername/bakong-khqr/workflows/CI/badge.svg)](https://github.com/yourusername/bakong-khqr/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[View Demo](#demo) · [Documentation](#documentation) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## About

`bakong-khqr` is a TypeScript/JavaScript library for generating **KHQR** codes, Cambodia's national QR payment standard used by the [Bakong](https://bakong.nbc.gov.kh/) payment system operated by the National Bank of Cambodia.

This library enables merchants and developers to:

- Generate static and dynamic payment QR codes
- Support both USD and KHR currencies
- Integrate with Bakong's API for deep links and payment verification
- Create styled QR code images

---

## Installation

```bash
npm install bakong-khqr
```

```bash
yarn add bakong-khqr
```

```bash
pnpm add bakong-khqr
```

---

## Quick Start

### Basic QR Code Generation

```typescript
import { KHQR } from "bakong-khqr";

const khqr = new KHQR();

// Dynamic QR with fixed amount
const qrString = khqr.createQR({
  bankAccount: "yourname@bank",
  merchantName: "Your Shop Name",
  merchantCity: "Phnom Penh",
  amount: 10.5,
  currency: "USD",
});

console.log(qrString);
// Output: 0002010102122915...6304XXXX
```

### Static QR Code (Customer enters amount)

```typescript
const staticQR = khqr.createQR({
  bankAccount: "yourname@bank",
  merchantName: "Your Shop",
  merchantCity: "Siem Reap",
  amount: 0, // Zero = static QR
  currency: "KHR",
});
```

---

## Documentation

### KHQR Class

#### Constructor

```typescript
new KHQR(options?: { bakongToken?: string })
```

| Option | Type | Description |
|--------|------|-------------|
| `bakongToken` | `string` | Bakong Developer Token (required for API features) |

#### `createQR(options)`

Generate a KHQR code string.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bankAccount` | `string` | ✅ | Bakong account (e.g., `name@bank`) |
| `merchantName` | `string` | ✅ | Merchant name (max 25 chars) |
| `merchantCity` | `string` | ✅ | City name (max 15 chars) |
| `amount` | `number` | ✅ | Transaction amount (0 for static QR) |
| `currency` | `"USD" \| "KHR"` | ✅ | Currency code |
| `storeLabel` | `string` | ❌ | Store/branch label (max 25 chars) |
| `phoneNumber` | `string` | ❌ | Merchant phone number |
| `billNumber` | `string` | ❌ | Bill/invoice number (max 25 chars) |
| `terminalLabel` | `string` | ❌ | Terminal/description (max 25 chars) |
| `static` | `boolean` | ❌ | Force static QR (default: `false`) |
| `expiration` | `number` | ❌ | Expiration in days (default: `1`) |

#### `generateMD5(qr)`

Generate MD5 hash of QR string for transaction tracking.

```typescript
const md5 = khqr.generateMD5(qrString);
// Returns: "64bffcefc9425d2cfd02c9ecf954a132"
```

### Bakong API Features

Requires a [Bakong Developer Token](https://developer.bakong.nbc.gov.kh/).

```typescript
const khqr = new KHQR({ bakongToken: "your_token" });

// Generate deep link
const deepLink = await khqr.generateDeepLink({
  qr: qrString,
  callback: "https://yourapp.com/callback",
  appIconUrl: "https://yourapp.com/icon.png",
  appName: "Your App",
});

// Check payment status
const status = await khqr.checkPayment(md5Hash);
// Returns: "PAID" or "UNPAID"

// Get payment details
const payment = await khqr.getPayment(md5Hash);

// Check multiple payments
const paidList = await khqr.checkBulkPayments([md5_1, md5_2, md5_3]);
```

### QR Code Images

```typescript
import { generateQRImage } from "bakong-khqr";

// Generate base64 PNG
const dataURI = await generateQRImage(qrString, "data-uri");
// Returns: "data:image/png;base64,iVBORw0KGgo..."

// Get buffer for saving
const buffer = await generateQRImage(qrString, "buffer");
```

---

## Demo

```typescript
import { KHQR, generateQRImage } from "bakong-khqr";

async function demo() {
  const khqr = new KHQR();

  // Create a $10.50 USD payment QR
  const qr = khqr.createQR({
    bankAccount: "john@acleda",
    merchantName: "John's Coffee",
    merchantCity: "Phnom Penh",
    amount: 10.5,
    currency: "USD",
    storeLabel: "Downtown Branch",
    terminalLabel: "Coffee Purchase",
  });

  console.log("QR Code:", qr);

  // Generate MD5 for tracking
  const md5 = khqr.generateMD5(qr);
  console.log("Tracking Hash:", md5);

  // Create QR image
  const image = await generateQRImage(qr, "data-uri");
  console.log("QR Image (base64):", image.substring(0, 50) + "...");
}

demo();
```

---

## KHQR Format Specification

KHQR follows the **EMVCo QR Code Specification** with Cambodia-specific extensions:

| Tag | Field | Example |
|-----|-------|---------|
| 00 | Payload Format Indicator | `01` |
| 01 | Point of Initiation | `11` (static) / `12` (dynamic) |
| 29 | Merchant Account Information | `0011name@bank` |
| 52 | Merchant Category Code | `5999` |
| 53 | Transaction Currency | `840` (USD) / `116` (KHR) |
| 54 | Transaction Amount | `10.50` |
| 58 | Country Code | `KH` |
| 59 | Merchant Name | `John's Coffee` |
| 60 | Merchant City | `Phnom Penh` |
| 62 | Additional Data | Bill number, store label, etc. |
| 63 | CRC | `6304` + 4 hex chars |
| 99 | Timestamp (Bakong-specific) | Creation + expiration time |

---

## Supported Banks

Any bank or financial institution on the Bakong network:

- ACLEDA Bank
- Canadia Bank
- ABA Bank
- Sathapana Bank
- And many more...

Account format: `username@bankcode`

---

## API Reference

See [full API documentation](#) for detailed class and method documentation.

### Exported Classes

```typescript
import {
  KHQR,                    // Main class
  EMV,                     // EMV constants
  CRC,                     // CRC-16 calculator
  Hash,                    // MD5 utility
  EMVParser,               // Parse QR strings
  // Field formatters:
  Amount,
  TimeStamp,
  PayloadFormatIndicator,
  PointOfInitiation,
  GlobalUniqueIdentifier,
  MCC,
  TransactionCurrency,
  CountryCode,
  MerchantName,
  MerchantCity,
  AdditionalDataField,
} from "bakong-khqr";
```

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## Acknowledgments

- [National Bank of Cambodia](https://bakong.nbc.gov.kh/) for the Bakong payment system
- [EMVCo](https://www.emvco.com/) for the QR code specification

---

<div align="center">

Made with ❤️ for the Cambodian developer community

</div>
