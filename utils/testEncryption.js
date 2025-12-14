/**
 * Test script for encryption functionality
 * Run this to verify encryption is working before using in production
 */

import { encryptReportData } from './encrypt';

// Mock data for testing
const testReportData = {
  crime_type: "Test Crime",
  description: "This is a test crime report",
  incident_datetime: new Date().toISOString(),
  location_text: "Test Location, Test City",
  latitude: "24.8607",
  longitude: "67.0011",
  severity: "Medium",
  is_anonymous: false,
  reporter_id: 123,
};

/**
 * Test Case 1: Basic encryption test
 */
export async function testBasicEncryption(baseURL) {
  console.log("\n=== TEST 1: Basic Encryption ===");
  try {
    const result = await encryptReportData(testReportData, baseURL);

    console.log("✅ Encryption successful!");
    console.log("Encrypted Key length:", result.encryptedKey.length);
    console.log("IV length:", result.iv.length);
    console.log("Encrypted Data length:", result.encryptedData.length);

    // Verify all fields are present
    if (!result.encryptedKey || !result.iv || !result.encryptedData) {
      throw new Error("Missing encryption fields");
    }

    // Verify they are base64 strings
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(result.encryptedKey)) {
      throw new Error("encryptedKey is not valid base64");
    }
    if (!base64Regex.test(result.iv)) {
      throw new Error("iv is not valid base64");
    }
    if (!base64Regex.test(result.encryptedData)) {
      throw new Error("encryptedData is not valid base64");
    }

    console.log("✅ All encryption fields are valid base64");
    return true;
  } catch (error) {
    console.error("❌ Test 1 Failed:", error.message);
    throw error;
  }
}

/**
 * Test Case 2: Empty/minimal data
 */
export async function testMinimalData(baseURL) {
  console.log("\n=== TEST 2: Minimal Data Encryption ===");
  try {
    const minimalData = {
      crime_type: "Theft",
      description: "Stolen",
      incident_datetime: new Date().toISOString(),
      location_text: "City",
      severity: "Low",
      is_anonymous: true,
    };

    const result = await encryptReportData(minimalData, baseURL);
    console.log("✅ Minimal data encrypted successfully!");
    return true;
  } catch (error) {
    console.error("❌ Test 2 Failed:", error.message);
    throw error;
  }
}

/**
 * Test Case 3: Large data with special characters
 */
export async function testLargeData(baseURL) {
  console.log("\n=== TEST 3: Large Data with Special Characters ===");
  try {
    const largeDescription = "Crime report with special characters: @#$%^&*(){}[]|\\:;\"'<>,.?/~`\n" +
      "Unicode: 你好世界 مرحبا العالم\n" +
      "Long text: " + "Lorem ipsum ".repeat(100);

    const largeData = {
      ...testReportData,
      description: largeDescription,
    };

    const result = await encryptReportData(largeData, baseURL);
    console.log("✅ Large data with special characters encrypted successfully!");
    console.log("Original description length:", largeDescription.length);
    console.log("Encrypted data length:", result.encryptedData.length);
    return true;
  } catch (error) {
    console.error("❌ Test 3 Failed:", error.message);
    throw error;
  }
}

/**
 * Test Case 4: Multiple sequential encryptions (should produce different results)
 */
export async function testMultipleEncryptions(baseURL) {
  console.log("\n=== TEST 4: Multiple Sequential Encryptions ===");
  try {
    const result1 = await encryptReportData(testReportData, baseURL);
    const result2 = await encryptReportData(testReportData, baseURL);

    // Same data should produce different encrypted results (due to random IV)
    if (result1.encryptedData === result2.encryptedData) {
      throw new Error("Multiple encryptions produced identical results (IV not random)");
    }

    if (result1.iv === result2.iv) {
      throw new Error("Multiple encryptions produced identical IVs (not random)");
    }

    console.log("✅ Multiple encryptions produce different results (good!)");
    console.log("First IV:", result1.iv.substring(0, 20) + "...");
    console.log("Second IV:", result2.iv.substring(0, 20) + "...");
    return true;
  } catch (error) {
    console.error("❌ Test 4 Failed:", error.message);
    throw error;
  }
}

/**
 * Test Case 5: Network error handling
 */
export async function testNetworkError() {
  console.log("\n=== TEST 5: Network Error Handling ===");
  try {
    const invalidURL = "http://invalid-url-that-does-not-exist:9999/api/v1/";

    try {
      await encryptReportData(testReportData, invalidURL);
      throw new Error("Should have thrown network error");
    } catch (error) {
      if (error.message.includes("Encryption failed") || error.message.includes("fetch")) {
        console.log("✅ Network error handled correctly");
        return true;
      }
      throw error;
    }
  } catch (error) {
    console.error("❌ Test 5 Failed:", error.message);
    throw error;
  }
}

/**
 * Run all tests
 */
export async function runAllTests(baseURL) {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   ENCRYPTION FUNCTIONALITY TEST SUITE  ║");
  console.log("╚════════════════════════════════════════╝");
  console.log(`Base URL: ${baseURL}`);

  const tests = [
    { name: "Basic Encryption", fn: () => testBasicEncryption(baseURL) },
    { name: "Minimal Data", fn: () => testMinimalData(baseURL) },
    { name: "Large Data", fn: () => testLargeData(baseURL) },
    { name: "Multiple Encryptions", fn: () => testMultipleEncryptions(baseURL) },
    { name: "Network Error Handling", fn: testNetworkError },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      await test.fn();
      passed++;
    } catch (error) {
      failed++;
      console.error(`\n❌ ${test.name} FAILED:`, error.message);
    }
  }

  console.log("\n╔════════════════════════════════════════╗");
  console.log("║           TEST RESULTS                 ║");
  console.log("╚════════════════════════════════════════╝");
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`❌ Failed: ${failed}/${tests.length}`);

  if (failed === 0) {
    console.log("\n🎉 All tests passed! Encryption is working correctly.");
  } else {
    console.log("\n⚠️  Some tests failed. Please check the errors above.");
  }

  return { passed, failed };
}
