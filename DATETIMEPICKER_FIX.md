# DateTimePicker Crash Fix

## Issue
App crashes with error: **"Cannot read property 'dismiss' of undefined"** when selecting a date on Android.

## Root Cause
The `@react-native-community/datetimepicker` component on Android has a known issue where the `dismiss` method is undefined in certain scenarios, particularly when the component tries to auto-dismiss after selection.

## Fix Applied

### Changes Made:

1. **Platform-Specific Event Handling** - [report-crime.jsx:132-155](app/(tabs)/report-crime.jsx#L132-L155)
   - Android: Check `event.type` to determine if user clicked "OK" (`set`) or "Cancel" (`dismissed`)
   - iOS: Update date immediately on change, user closes with "Done" button

2. **Separate DateTimePicker Components** - [report-crime.jsx:405-439](app/(tabs)/report-crime.jsx#L405-L439)
   - Android: Uses native modal picker (automatically dismisses)
   - iOS: Shows inline spinner with custom "Done" button

3. **Added Debug Logging**
   - Logs event type, selected date, and platform
   - Helps identify exactly what's happening during date selection

## Testing Instructions

### Step 1: Clear Cache and Reload
```bash
# Stop the Expo server (Ctrl+C)
# Clear Metro cache
npx expo start -c
```

### Step 2: Test Date Picker
1. Open the app and go to "Report Crime"
2. Click on "Incident Date & Time" field
3. **Watch the console logs** - you should see:
   ```
   === Date Change Event ===
   Event type: set
   Selected date: [Date object]
   Platform: android
   Updating date to: [Date object]
   ```

4. Select a date and time
5. Click **OK** (not Dismiss)

### Expected Results:
✅ No crash
✅ Date updates in the field
✅ Can continue using the form
✅ Console shows "Event type: set"

### If User Clicks "Dismiss/Cancel":
✅ No crash
✅ Date stays as original value
✅ Console shows "Event type: dismissed"
✅ Console shows "Date selection cancelled or no date selected"

## Alternative Solutions (If Issue Persists)

### Solution 1: Update to Latest Package
```bash
npm install @react-native-community/datetimepicker@latest
npx expo start -c
```

### Solution 2: Use DateTimePicker as Modal
If the issue persists, we can force it to always use modal mode:

```javascript
{showDatePicker && Platform.OS === "android" && (
  <DateTimePicker
    value={formData.incident_datetime}
    mode="datetime"
    display="default"  // or try "spinner"
    onChange={handleDateChange}
    maximumDate={new Date()}
    is24Hour={true}  // Add this
  />
)}
```

### Solution 3: Use Third-Party Alternative
Consider using `react-native-modal-datetime-picker` which is more stable:

```bash
npm install react-native-modal-datetime-picker
```

## Debugging Steps

### Check Console Logs
When you click the date field and select a date, check the logs:

**Good (Working):**
```
=== Date Change Event ===
Event type: set
Selected date: 2025-11-23T09:16:00.000Z
Platform: android
Updating date to: 2025-11-23T09:16:00.000Z
```

**Bad (Still Crashing):**
```
=== Date Change Event ===
Event type: undefined
Selected date: undefined
Platform: android
[ERROR] Cannot read property 'dismiss' of undefined
```

If you see the "Bad" logs, it means the event object is malformed, which indicates a deeper issue with the DateTimePicker library itself.

## Known Issues with @react-native-community/datetimepicker

### Issue #1: Version 8.5.0 on Android
Some users report the `dismiss` error on version 8.5.0 specifically on Android 13+.

**Fix:** Update to latest version (8.7.0+)
```bash
npm install @react-native-community/datetimepicker@latest
```

### Issue #2: Event Object Undefined
Sometimes the event object is undefined on the first call.

**Fix:** Added null-safe checks with `event?.type`

### Issue #3: Multiple Instances
If DateTimePicker is rendered multiple times, it can cause conflicts.

**Fix:** We now use `Platform.OS` checks to ensure only ONE picker is rendered at a time.

## What to Share If Issue Persists

If the crash still occurs after applying this fix, please share:

1. **Complete console logs** from the moment you click "Incident Date & Time" until the crash
2. **Exact error message** from the red error screen
3. **Android version** of your test device
4. **Expo Go version** or if using development build
5. **Screenshot** of the error screen

Example format:
```
Android Version: 13
Expo Go Version: 2.31.2
DateTimePicker Version: 8.5.0

Console Logs:
=== Date Change Event ===
[paste logs here]

Error:
Cannot read property 'dismiss' of undefined
[paste full stack trace]
```

## Emergency Workaround

If the DateTimePicker keeps crashing and blocking development, you can temporarily use manual text input:

```javascript
// Replace the date picker TouchableOpacity with:
<TextInput
  style={{...}}
  placeholder="YYYY-MM-DD HH:MM"
  value={formData.incident_datetime.toISOString().slice(0, 16).replace('T', ' ')}
  onChangeText={(text) => {
    try {
      const date = new Date(text);
      if (!isNaN(date.getTime())) {
        setFormData({ ...formData, incident_datetime: date });
      }
    } catch (e) {
      console.log("Invalid date format");
    }
  }}
/>
```

This allows testing the rest of the form while we resolve the DateTimePicker issue.

---

**Status:** ✅ Fix Applied
**Last Updated:** 2025-11-23
**Next Step:** Test with clear cache and report results
