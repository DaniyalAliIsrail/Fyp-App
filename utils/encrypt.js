import 'react-native-get-random-values';
import forge from 'node-forge';
import { Buffer } from 'buffer';
import axios from 'axios';

// Polyfill for global Buffer
global.Buffer = Buffer;

/**
 * Encrypt report data using node-forge
 * Same implementation as FYP_Frontend web version
 */
export async function encryptReportData(data, baseURL) {
  try {
    console.log("=== Starting encryption process ===");

    // 1. Fetch public key from backend using axios
    const publicKeyUrl = `${baseURL}key/public`;
    console.log("Fetching public key from:", publicKeyUrl);

    // Use axios instead of fetch for better error handling and timeout support
    const axiosInstance = axios.create({
      baseURL: baseURL,
      timeout: 30000, // 30 seconds timeout
    });

    const response = await axiosInstance.get('key/public');
    const publicKeyPem = response.data;
    console.log("Public key received:", typeof publicKeyPem);

    // Parse the PEM public key
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    console.log("Public key parsed");

    // 2. Generate AES key (32 bytes = 256-bit)
    const aesKey = forge.random.getBytesSync(32);
    console.log("AES key generated");

    // 3. Generate IV (16 bytes)
    const iv = forge.random.getBytesSync(16);
    console.log("IV generated");

    // 4. Encrypt data with AES-CBC
    const jsonData = JSON.stringify(data);
    console.log("Data to encrypt:", jsonData);

    const cipher = forge.cipher.createCipher("AES-CBC", aesKey);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(jsonData, "utf8"));
    cipher.finish();
    const encryptedData = cipher.output.getBytes();
    console.log("Data encrypted with AES");

    // 5. Encrypt AES key with RSA public key (RSA-OAEP padding)
    const encryptedKey = publicKey.encrypt(aesKey, "RSA-OAEP");
    console.log("AES key encrypted with RSA");

    // 6. Convert to base64 (using Buffer for compatibility)
    const result = {
      encryptedKey: Buffer.from(encryptedKey, 'binary').toString('base64'),
      iv: Buffer.from(iv, 'binary').toString('base64'),
      encryptedData: Buffer.from(encryptedData, 'binary').toString('base64'),
    };

    console.log("=== Encryption complete ===");
    return result;
  } catch (error) {
    console.error("=== Encryption error ===", error);

    // Provide more specific error messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Connection timeout. Please check your internet connection and try again.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please ensure your backend server is running at ' + baseURL);
    } else if (error.message.includes('Network request failed')) {
      throw new Error('Cannot connect to server. Please check:\n1. Backend server is running\n2. Device is on same network\n3. Backend URL is correct: ' + baseURL);
    } else if (error.response) {
      throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }
}
