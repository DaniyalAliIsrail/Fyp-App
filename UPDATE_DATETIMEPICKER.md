# Emergency Fix for DateTimePicker Crash

## The Problem Still Persists

If you're still seeing the "Cannot read property 'dismiss' of undefined" error, this is a known issue with version 8.5.0 of `@react-native-community/datetimepicker`.

## Solution: Update the Package

### Step 1: Update DateTimePicker Package

Run these commands in your project directory:

```bash
# Stop Expo server first (Ctrl+C)

# Remove the old package
npm uninstall @react-native-community/datetimepicker

# Install the latest version
npm install @react-native-community/datetimepicker@latest

# Clear all caches
npx expo start -c
```

### Step 2: Verify Installation

Check that the new version was installed:

```bash
npm list @react-native-community/datetimepicker
```

You should see version **8.7.0 or higher**.

### Step 3: Test Again

1. Reload the app in Expo Go
2. Go to "Report Crime"
3. Click "Incident Date & Time"
4. Select a date
5. Click "OK"

## If Update Doesn't Work

### Alternative Solution 1: Use react-native-modal-datetime-picker

This is a more stable alternative library:

```bash
# Install alternative library
npm install react-native-modal-datetime-picker
npm install react-native-modal @react-native-community/datetimepicker
```

Then I can update the code to use this library instead.

### Alternative Solution 2: Temporary Manual Input

If you need to continue development while we fix this, you can temporarily use manual text input for the date:

**Replace the date picker section in report-crime.jsx with:**

```javascript
{/* Incident Date & Time - TEMPORARY MANUAL INPUT */}
<View style={{ marginBottom: 15 }}>
  <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 5 }}>
    Incident Date & Time *
  </Text>
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.white,
      borderRadius: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}
  >
    <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
    <TextInput
      style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10 }}
      placeholder="YYYY-MM-DD HH:MM (e.g., 2025-11-23 14:30)"
      value={formData.incident_datetime.toISOString().slice(0, 16).replace('T', ' ')}
      onChangeText={(text) => {
        try {
          // Parse the date string
          const date = new Date(text);
          if (!isNaN(date.getTime())) {
            setFormData({ ...formData, incident_datetime: date });
          }
        } catch (e) {
          console.log("Invalid date format");
        }
      }}
    />
  </View>
  <Text style={{ fontSize: 11, color: COLORS.gray, marginTop: 4 }}>
    Format: YYYY-MM-DD HH:MM (24-hour time)
  </Text>
</View>
```

This will allow you to:
- Continue testing the rest of the form
- Submit reports successfully
- Work on other features

Once we get the DateTimePicker fixed, we can switch back to the native date picker.

## What I Need to Debug Further

If the update doesn't work, please share:

1. **New version number:**
   ```bash
   npm list @react-native-community/datetimepicker
   ```

2. **Complete console logs** showing:
   ```
   === Date Change Event ===
   Event type: ???
   Selected date: ???
   Platform: android
   ```

3. **Android version** of your test device

4. **Exact error message** from the crash screen

## Current Fix Applied

The code now:
1. Uses `setTimeout` to delay hiding the picker (gives component time to cleanup)
2. Removed `display="default"` prop (sometimes causes issues)
3. Added `is24Hour={true}` for Android
4. Uses functional updates `setFormData(prev => ...)` to avoid stale state
5. Checks condition order: `Platform.OS === "android" && showDatePicker`

## Next Steps

Try the update first:
```bash
npm uninstall @react-native-community/datetimepicker
npm install @react-native-community/datetimepicker@latest
npx expo start -c
```

If that doesn't work, let me know and I'll implement one of the alternative solutions above.
