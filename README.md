
# Firebase Crashlytics Link Purifier

A Chrome Extension that cleans Firebase Crashlytics URLs and provides history management with Slack-ready formatting.

## 🎯 Features

- **URL Cleaning**: Removes session keys, time ranges, and user filters from Firebase URLs
- **Custom Naming**: Add descriptive names to your saved links
- **History Management**: Persistent storage of up to 50 links
- **Slack Formatting**: One-click copy with Slack-ready format `<URL|Name>`
- **Quick Actions**: Open links in new tabs or delete from history
- **Two-Tab Interface**: Separate views for current link and history

## 📋 What It Does

### Before (Messy URL):
```
https://console.firebase.google.com/u/0/project/my-app/crashlytics/app/android:com.example/issues/abc123?sessionId=xyz&time=last-7-days&type=crash
```

### After (Clean URL):
```
https://console.firebase.google.com/project/my-app/crashlytics/app/android:com.example/issues/abc123
```

**What gets removed:**
- `/u/0/` (or any user-specific path like `/u/1/`, `/u/2/`)
- All query parameters (`?sessionId=...`, `&time=...`, etc.)

### Slack Format (With Name):
```
<https://console.firebase.google.com/.../issues/abc123|Login Bug - Android>
```
*Renders in Slack as:* [Login Bug - Android](URL)

## 📖 Usage Guide

### Basic Usage (Current Link Tab)

1. **Navigate to a Firebase Crashlytics issue page**
   - Example: `https://console.firebase.google.com/project/*/crashlytics/app/*/issues/*`

2. **Click the extension icon** in your Chrome toolbar

3. **View the cleaned URL** automatically displayed

4. **Optional: Add a descriptive name**
   - Enter a name like "Login Bug - Android" or "Crash on iOS 15"
   - Max 100 characters

5. **Choose an action:**
   - **Copy & Save**: Copies Slack-formatted link AND saves to history
   - **Copy Only**: Just copies to clipboard without saving

### History Management

1. **Switch to History tab** to view saved links

2. **Click on any link name** to copy the Slack-formatted version

3. **Use quick actions:**
   - 🔗 **Open**: Opens the link in a new browser tab
   - 🗑️ **Delete**: Removes the entry from history

4. **Clear All History**: Button at the bottom removes all saved links

## 💡 Use Cases

### Scenario 1: Quick Share
```
1. On Firebase issue page
2. Click extension
3. Enter name: "Payment Crash"
4. Click "Copy & Save"
5. Paste in Slack: <url|Payment Crash>
```

### Scenario 2: Build a Library
```
1. Save multiple issues with descriptive names
2. Switch to History tab anytime
3. Quick access to all your important bugs
4. Share with team members as needed
```

### Scenario 3: Track Progress
```
1. Save bugs as you investigate
2. Names help identify issues quickly
3. Open directly from history
4. Delete once resolved
```

## 🎨 Slack Formatting

### With Name
**Input**: Name = "Login Bug", URL = `https://...abc123`
**Copied**: `<https://...abc123|Login Bug>`
**Slack Renders**: [Login Bug](https://...abc123)

### Without Name
**Input**: Name = (empty), URL = `https://...abc123`
**Copied**: `https://...abc123`
**Slack Renders**: https://...abc123 (auto-linked)

## 📊 Storage Details

- **Storage Type**: `chrome.storage.local`
- **Max History**: 50 entries (oldest auto-deleted)
- **Persistence**: Survives browser restarts
- **Data Stored**:
  - Link name (optional)
  - Clean URL
  - Timestamp
  - Creation date
