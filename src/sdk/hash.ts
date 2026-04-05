import { createHash } from "crypto";

/**
 * Hash utility class for generating MD5 hashes.
 */
export class Hash {
  /**
   * Generate an MD5 hash for the given data.
   * @param data - The data to hash
   * @returns The hexadecimal MD5 hash of the input data (32 characters)
   */
  public md5(data: string): string {
    if (typeof data !== "string") {
      throw new TypeError("Data must be a string.");
    }
    return createHash("md5").update(data, "utf-8").digest("hex");
  }
}
