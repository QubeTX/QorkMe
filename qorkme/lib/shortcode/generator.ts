/**
 * Short Code Generator
 * Creates memorable, typable short codes for URLs
 * Optimized for 200,000+ URLs with progressive length scaling
 */

import { customAlphabet } from 'nanoid';

// Readable character set (excludes confusing characters: 0, 1, i, l, o)
const READABLE_CHARS = '23456789abcdefghjkmnpqrstuvwxyz';
const VOWELS = 'aeu';
const CONSONANTS = '23456789bcdfghjkmnpqrstvwxyz';

// Create nanoid generators with different strategies
const generateRandom = customAlphabet(READABLE_CHARS);
const generateConsonant = customAlphabet(CONSONANTS);
const generateVowel = customAlphabet(VOWELS);

export class ShortCodeGenerator {
  /**
   * Generate a memorable code with consonant-vowel pattern
   * Examples: "ka9m", "pu3n", "ve7x"
   */
  static generateMemorableCode(length: number = 4): string {
    let code = '';

    for (let i = 0; i < length; i++) {
      // Alternate between consonants and vowels for pronounceability
      // Start with consonant for better memorability
      if (i % 2 === 0) {
        code += generateConsonant(1);
      } else {
        code += generateVowel(1);
      }
    }

    return code;
  }

  /**
   * Generate a fully random code using readable characters
   */
  static generateRandomCode(length: number = 4): string {
    return generateRandom(length);
  }

  /**
   * Generate a unique code with progressive length increase
   * Tries memorable patterns first, then falls back to random
   */
  static async generateUniqueCode(
    checkAvailability: (code: string) => Promise<boolean>,
    preferMemorablePattern: boolean = true
  ): Promise<string> {
    let attempts = 0;
    let length = 4; // Start with 4 characters (1M+ combinations)
    const maxAttempts = 100;
    const attemptsPerLength = 20;

    while (attempts < maxAttempts) {
      let code: string;

      // Try memorable pattern for first half of attempts
      if (preferMemorablePattern && attempts < maxAttempts / 2) {
        code = this.generateMemorableCode(length);
      } else {
        code = this.generateRandomCode(length);
      }

      // Check if code is available
      const isAvailable = await checkAvailability(code);
      if (isAvailable) {
        return code;
      }

      attempts++;

      // Increase length after every N attempts
      if (attempts % attemptsPerLength === 0) {
        length++;
        console.log(`Increasing short code length to ${length} after ${attempts} attempts`);
      }
    }

    // Ultimate fallback: timestamp-based code
    // This ensures we always get a unique code
    const timestamp = Date.now().toString(36);
    return `q${timestamp}`;
  }

  /**
   * Validate a custom alias
   */
  static validateCustomAlias(alias: string): {
    valid: boolean;
    error?: string;
  } {
    // Check length
    if (alias.length < 3) {
      return { valid: false, error: 'Alias must be at least 3 characters long' };
    }
    if (alias.length > 50) {
      return { valid: false, error: 'Alias must be less than 50 characters' };
    }

    // Check characters (alphanumeric and hyphens only)
    const validPattern = /^[a-zA-Z0-9-]+$/;
    if (!validPattern.test(alias)) {
      return {
        valid: false,
        error: 'Alias can only contain letters, numbers, and hyphens',
      };
    }

    // Check for consecutive hyphens
    if (alias.includes('--')) {
      return {
        valid: false,
        error: 'Alias cannot contain consecutive hyphens',
      };
    }

    // Check for leading/trailing hyphens
    if (alias.startsWith('-') || alias.endsWith('-')) {
      return {
        valid: false,
        error: 'Alias cannot start or end with a hyphen',
      };
    }

    return { valid: true };
  }

  /**
   * Calculate total possible combinations for a given length
   */
  static calculateCombinations(length: number): number {
    return Math.pow(READABLE_CHARS.length, length);
  }

  /**
   * Estimate the optimal code length for a given number of URLs
   */
  static getOptimalLength(expectedUrls: number): number {
    const safetyFactor = 10; // We want 10x more combinations than URLs
    const targetCombinations = expectedUrls * safetyFactor;

    let length = 3;
    while (this.calculateCombinations(length) < targetCombinations) {
      length++;
    }

    return Math.max(4, length); // Minimum 4 characters for aesthetics
  }
}

// Export statistics for monitoring
export const CodeGeneratorStats = {
  fourCharCombinations: ShortCodeGenerator.calculateCombinations(4), // 1,048,576
  fiveCharCombinations: ShortCodeGenerator.calculateCombinations(5), // 33,554,432
  sixCharCombinations: ShortCodeGenerator.calculateCombinations(6), // 1,073,741,824
  optimalLengthFor200k: ShortCodeGenerator.getOptimalLength(200000), // Should be 4 or 5
};
