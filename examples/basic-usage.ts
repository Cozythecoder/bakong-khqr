import { KHQR, generateQRImage } from "./index";

async function main() {
  console.log("Testing bakong-khqr TypeScript library\n");

  // Test 1: Create QR code without Bakong token (local generation)
  const khqr = new KHQR();

  console.log("1. Creating dynamic QR code with USD...");
  const qrUsd = khqr.createQR({
    bankAccount: "testuser@bank",
    merchantName: "Test Merchant",
    merchantCity: "Phnom Penh",
    amount: 10.5,
    currency: "USD",
    storeLabel: "Shop A",
    phoneNumber: "012345678",
    billNumber: "TRX001",
    terminalLabel: "Payment",
    static: false,
    expiration: 1,
  });
  console.log("QR (USD):", qrUsd);
  console.log("Length:", qrUsd.length, "chars\n");

  // Test 2: Create QR code with KHR
  console.log("2. Creating dynamic QR code with KHR...");
  const qrKhr = khqr.createQR({
    bankAccount: "testuser@bank",
    merchantName: "Test Merchant",
    merchantCity: "Siem Reap",
    amount: 50000,
    currency: "KHR",
  });
  console.log("QR (KHR):", qrKhr);
  console.log("Length:", qrKhr.length, "chars\n");

  // Test 3: Create static QR code (no amount)
  console.log("3. Creating static QR code...");
  const qrStatic = khqr.createQR({
    bankAccount: "testuser@bank",
    merchantName: "My Shop",
    merchantCity: "Battambang",
    amount: 0, // Static QR
    currency: "USD",
  });
  console.log("QR (Static):", qrStatic);
  console.log("Length:", qrStatic.length, "chars\n");

  // Test 4: Generate MD5 hash
  console.log("4. Generating MD5 hashes...");
  const md5Usd = khqr.generateMD5(qrUsd);
  const md5Khr = khqr.generateMD5(qrKhr);
  const md5Static = khqr.generateMD5(qrStatic);
  console.log("MD5 (USD):", md5Usd);
  console.log("MD5 (KHR):", md5Khr);
  console.log("MD5 (Static):", md5Static);
  console.log("All MD5s are 32 chars:", md5Usd.length === 32 && md5Khr.length === 32 && md5Static.length === 32, "\n");

  // Test 5: Test image generation (without saving)
  console.log("5. Testing image generation...");
  try {
    const dataUri = await generateQRImage(qrUsd, "data-uri");
    console.log("Data URI generated successfully:");
    console.log((dataUri as string).substring(0, 50) + "...\n");
  } catch (error) {
    console.error("Image generation error:", error, "\n");
  }

  // Test 6: Verify QR codes start with expected format
  console.log("6. Verifying QR format...");
  const expectedStart = "0002";
  console.log("All QRs start with '0002':",
    qrUsd.startsWith(expectedStart) &&
    qrKhr.startsWith(expectedStart) &&
    qrStatic.startsWith(expectedStart)
  );
  console.log("All QRs end with CRC (4 hex chars):",
    /^[0-9A-Fa-f]{4}$/.test(qrUsd.slice(-4)) &&
    /^[0-9A-Fa-f]{4}$/.test(qrKhr.slice(-4)) &&
    /^[0-9A-Fa-f]{4}$/.test(qrStatic.slice(-4))
  );

  console.log("\n✅ All tests completed successfully!");
}

main().catch(console.error);
