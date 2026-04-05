import { KHQR } from "./khqr";

export { KHQR, VERSION, type KHQROptions, type CreateQROptions, type DeepLinkOptions } from "./khqr";
export * from "./sdk";
export { QRImageGenerator, type ImageFormat, type QRImageResult } from "./image-generator";
export { generateQRImage } from "./image-generator";

export default KHQR;
