# Report Crime Feature - Implementation & Testing Guide

## Overview
This document provides comprehensive information about the Report Crime feature implementation with end-to-end encryption.

## Architecture

### Data Flow
```
User Input → Encryption → FormData → API → Backend Decryption → Database
```

### Encryption Process
1. **Public Key Fetch**: App fetches RSA public key from `GET /api/v1/key/public`
2. **AES Key Generation**: Random 256-bit AES key is generated
3. **IV Generation**: Random 128-bit initialization vector is generated
4. **Data Encryption**: Report data is encrypted using AES-CBC
5. **Key Encryption**: AES key is encrypted using RSA-OAEP with public key
6. **Base64 Encoding**: All encrypted data is base64 encoded
7. **Transmission**: Encrypted payload + files sent to backend

### Files Structure

#### Core Files
- `app/(tabs)/report-crime.jsx` - Main report crime screen
- `store/slices/report.slice.js` - Redux slice for report state management
- `Repositories/report.js` - API repository for report operations
- `utils/encrypt.js` - Encryption utility
- `utils/testEncryption.js` - Test suite for encryption

#### Configuration
- `metro.config.js` - Metro bundler configuration for crypto polyfills
- `app/_layout.jsx` - App entry point with polyfill initialization

## Dependencies

### Encryption & Crypto
```json
{
  "expo-crypto": "~15.0.7",
  "react-native-quick-crypto": "^0.7.17",
  "react-native-get-random-values": "latest",
  "buffer": "^6.0.3",
  "readable-stream": "^4.7.0"
}
```

### File Handling
```json
{
  "expo-image-picker": "~17.0.8",
  "expo-document-picker": "^14.0.7",
  "@react-native-community/datetimepicker": "^8.5.0"
}
```

### State Management
```json
{
  "@reduxjs/toolkit": "^2.10.1",
  "react-redux": "^9.2.0",
  "redux-persist": "^6.0.0"
}
```

## Testing Guide

### Prerequisites
1. Backend server running at the IP configured in `utils/client.js`
2. Backend endpoints available:
   - `GET /api/v1/key/public` - Returns RSA public key in PEM format
   - `POST /api/v1/report/create` - Accepts encrypted report data

### Test Cases

#### Test Case 1: Basic Report Submission
**Steps:**
1. Login to the app
2. Navigate to "Report Crime" tab
3. Fill in required fields:
   - Crime Type: "Theft"
   - Description: "Test description"
   - Location: "Test location"
4. Submit without files
5. Verify success message

**Expected Result:**
- ✅ Encryption logs in console
- ✅ Success alert
- ✅ Form reset after submission
- ✅ Backend receives encrypted data

#### Test Case 2: Report with Images
**Steps:**
1. Fill report form
2. Click "Upload Images"
3. Select 2-3 images
4. Verify images appear in list
5. Submit report

**Expected Result:**
- ✅ Images shown with file names
- ✅ Can remove images before submit
- ✅ FormData contains images
- ✅ Backend receives images

#### Test Case 3: Report with All File Types
**Steps:**
1. Fill report form
2. Add images (JPEG/PNG)
3. Add videos (MP4)
4. Add documents (PDF)
5. Submit report

**Expected Result:**
- ✅ All files uploaded successfully
- ✅ Loading indicator shows during upload
- ✅ Backend receives all files

#### Test Case 4: Anonymous Report
**Steps:**
1. Fill report form
2. Check "Submit Anonymously"
3. Submit report

**Expected Result:**
- ✅ `is_anonymous: true` in encrypted data
- ✅ Report saved as anonymous

#### Test Case 5: Validation
**Steps:**
1. Try to submit empty form
2. Try to submit with only crime type
3. Try to submit without location

**Expected Result:**
- ❌ Error alerts for missing fields
- ❌ Form not submitted

#### Test Case 6: Severity Levels
**Steps:**
1. Test each severity level (Low, Medium, High)
2. Submit reports with different severity

**Expected Result:**
- ✅ Correct severity value sent
- ✅ UI highlights selected severity

#### Test Case 7: Date & Time Picker
**Steps:**
1. Click incident date field
2. Select past date & time
3. Try to select future date (should be blocked)

**Expected Result:**
- ✅ Date picker opens
- ✅ Selected date shown in field
- ✅ Cannot select future dates

#### Test Case 8: Location Coordinates
**Steps:**
1. Fill form with lat/lng values
2. Submit report

**Expected Result:**
- ✅ Coordinates included in encrypted data
- ✅ Optional fields handled correctly

#### Test Case 9: Large Files
**Steps:**
1. Upload large image (5+ MB)
2. Upload large video (10+ MB)
3. Submit report

**Expected Result:**
- ✅ Files uploaded successfully
- ✅ Loading indicator during upload
- ✅ Timeout set to 90 seconds

#### Test Case 10: Special Characters
**Steps:**
1. Enter description with special characters: `@#$%^&*()`
2. Enter Unicode text: `你好世界`
3. Enter multi-line text with newlines
4. Submit report

**Expected Result:**
- ✅ All characters preserved
- ✅ Encryption handles special chars
- ✅ Backend decrypts correctly

### Encryption-Specific Tests

#### Test Case 11: Encryption Output Verification
**Console logs to check:**
```
=== Encrypting report data ===
Fetching public key from: http://...
Public key received
Public key imported
AES key generated
IV generated
Data to encrypt: {...}
Data encrypted with AES
AES key encrypted with RSA
=== Encryption complete ===
```

#### Test Case 12: Base64 Validation
**Verify in logs:**
- `encryptedKey` is valid base64
- `iv` is valid base64
- `encryptedData` is valid base64
- No special characters outside base64 alphabet

#### Test Case 13: Multiple Submissions
**Steps:**
1. Submit first report
2. Fill form again with different data
3. Submit second report

**Expected Result:**
- ✅ Different IV for each submission
- ✅ Different encrypted data for same input
- ✅ No caching issues

### Error Handling Tests

#### Test Case 14: Network Error
**Steps:**
1. Turn off backend server
2. Try to submit report

**Expected Result:**
- ❌ Error alert shown
- ❌ Form not reset
- ❌ User can retry

#### Test Case 15: Invalid Public Key
**Steps:**
1. Backend returns invalid public key
2. Try to submit report

**Expected Result:**
- ❌ Error alert: "Encryption failed"
- ❌ Detailed error in console

#### Test Case 16: Backend Rejection
**Steps:**
1. Backend rejects encrypted data (wrong format)
2. Check error handling

**Expected Result:**
- ❌ Error message from backend shown
- ❌ User can fix and retry

## Troubleshooting

### ⚠️ CRITICAL: "Network request failed" Error

This is the **MOST COMMON** issue! It means the app cannot connect to your backend server.

#### Quick Fix Checklist:

1. **✅ Is your backend server running?**
   ```bash
   cd path/to/your/backend
   npm start
   ```
   You should see: "Server running on port 3004"

2. **✅ Test backend in browser:**
   - Open: http://192.168.1.103:3004/api/v1/key/public
   - You should see text starting with "-----BEGIN PUBLIC KEY-----"
   - If you see "This site can't be reached" → Backend is NOT running!

3. **✅ Check the IP address:**
   - Open `utils/client.js` and verify `baseURL`
   - Current: `http://192.168.1.103:3004/api/v1/`
   - Find your IP:
     ```bash
     # Windows
     ipconfig

     # Mac/Linux
     ifconfig
     ```
   - Look for "IPv4 Address" (should be 192.168.x.x)

4. **✅ Same network:**
   - Phone and computer MUST be on the same WiFi network
   - Disable VPN on both devices
   - Don't use mobile data - use WiFi

5. **✅ Windows Firewall:**
   - Go to: Windows Defender Firewall → Allow an app
   - Find "Node.js" and check both Private and Public
   - If not listed, click "Allow another app" and add Node.js

#### Detailed Troubleshooting:

**Step 1: Verify backend is accessible from your computer**
```bash
# Test from terminal
curl http://192.168.1.103:3004/api/v1/key/public

# Expected: Public key text (-----BEGIN PUBLIC KEY-----)
# Error: Connection refused → Backend not running
# Error: Timeout → Wrong IP or firewall blocking
```

**Step 2: Check Expo Go logs**
When you submit, you should see:
```
✅ GOOD:
LOG  === Starting encryption process ===
LOG  Fetching public key from: http://192.168.1.103:3004/api/v1/key/public
LOG  Public key received: string
LOG  === Encryption complete ===

❌ BAD:
LOG  === Starting encryption process ===
ERROR === Encryption error === [TypeError: Network request failed]
```

**Step 3: Alternative - Use Ngrok**
If local network still doesn't work:
```bash
# Install ngrok
npm install -g ngrok

# In your backend directory
ngrok http 3004

# Copy the https URL and update utils/client.js:
baseURL: "https://your-ngrok-url.ngrok.io/api/v1/",
```

### Common Issues

#### Issue 1: "Web Crypto API not available"
**Solution:**
```javascript
// Ensure polyfills are imported in app/_layout.jsx:
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
```

#### Issue 2: "Encryption failed: crypto is not defined"
**Solution:**
- Check metro bundler is running
- Clear metro cache: `npx expo start -c`
- Verify `metro.config.js` exists

#### Issue 3: "Network request failed"
**Solution:**
- Check backend is running
- Verify IP address in `utils/client.js`
- Check firewall settings
- Test public key endpoint in browser

#### Issue 4: Images not uploading
**Solution:**
- Grant photo library permissions
- Check file size limits
- Verify timeout is set to 90000ms

#### Issue 5: Backend cannot decrypt
**Solution:**
- Verify public key matches backend private key
- Check RSA-OAEP hash algorithm (SHA-256)
- Verify base64 encoding is correct
- Check backend decryption logic

#### Issue 6: Form not resetting after success
**Solution:**
- Check `resetForm()` function is called
- Verify `clearReportSuccess()` is dispatched
- Check file input refs are cleared

### Debug Mode

Enable detailed logging in `utils/encrypt.js`:
```javascript
// Add to each step
console.log("Step X: ", variableName);
```

### Performance Optimization

**Large Files:**
- Compress images before upload
- Set quality in ImagePicker: `quality: 0.8`
- Consider chunked uploads for videos

**Encryption Speed:**
- Encryption is fast (<100ms for text)
- File upload time depends on network
- Show progress indicator for UX

## Security Considerations

### Best Practices
1. ✅ Always use HTTPS in production
2. ✅ Never log sensitive data in production
3. ✅ Validate file types on backend
4. ✅ Set file size limits
5. ✅ Use latest encryption libraries
6. ✅ Rotate encryption keys periodically

### Data Protection
- Form data is encrypted before transmission
- Files are sent as multipart (not encrypted currently)
- Consider encrypting files if needed
- Backend should validate decrypted data

## API Contract

### Request Format
```javascript
POST /api/v1/report/create
Content-Type: multipart/form-data

FormData {
  encryptedKey: string (base64),
  iv: string (base64),
  encryptedData: string (base64),
  report_image: File[] (optional),
  report_video: File[] (optional),
  report_document: File[] (optional)
}
```

### Encrypted Data Structure (before encryption)
```javascript
{
  crime_type: string,
  description: string,
  incident_datetime: ISO8601 string,
  location_text: string,
  latitude?: string,
  longitude?: string,
  severity: "Low" | "Medium" | "High",
  is_anonymous: boolean,
  reporter_id: number
}
```

### Response Format
```javascript
{
  success: boolean,
  message: string,
  data: {
    report_id: number,
    ...other fields
  }
}
```

## Future Enhancements

### Potential Improvements
1. **File Encryption**: Encrypt files before upload
2. **Offline Support**: Queue reports when offline
3. **Draft Saving**: Save form as draft
4. **Map Integration**: Add map picker for location
5. **Voice Recording**: Add audio recording feature
6. **OCR**: Extract text from images
7. **Geolocation**: Auto-detect location
8. **Report History**: View submitted reports
9. **Edit Reports**: Edit pending reports
10. **Push Notifications**: Notify on report status change

## Support

### Getting Help
1. Check console logs for detailed errors
2. Review this document for common issues
3. Test with the test suite in `utils/testEncryption.js`
4. Verify backend endpoints are working
5. Check network connectivity

### Logging
Important logs to check:
- Axios request/response interceptors
- Encryption process steps
- Redux action dispatches
- Form validation errors

---

**Last Updated:** 2025-11-22
**Version:** 1.0.0
**Status:** ✅ Ready for Testing
