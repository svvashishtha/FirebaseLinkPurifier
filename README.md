
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

## 🚀 Installation

### Step 1: Download the Extension
1. Ensure all files are in the `firebase-link-purifier` folder:
   - `manifest.json`
   - `content.js`
   - `popup.html`
   - `popup.js`
   - `styles.css`

### Step 2: Load in Chrome
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `firebase-link-purifier` folder
6. The extension icon will appear in your Chrome toolbar

### Step 3: Verify Installation
- Look for the "Firebase Link Purifier" extension in your extensions list
- The extension should show as enabled
- You should see the extension icon in your toolbar

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

## 🔧 Troubleshooting

### Extension Not Working
- **Check**: Are you on a Firebase Crashlytics page?
- **URL Pattern**: Must match `https://console.firebase.google.com/*/crashlytics/*/issues/*`
- **Error Message**: Extension will show "Not a Firebase page" if on wrong domain

### Can't Copy to Clipboard
- **Check**: Clipboard permissions in `chrome://extensions/`
- **Retry**: Close and reopen the extension
- **Browser**: Ensure Chrome is up to date

### History Not Saving
- **Check**: Storage permissions in manifest
- **Clear**: Try clearing all history and saving again
- **Console**: Check browser console for errors (F12)

### Content Script Not Loading
- **Reload**: Reload the extension in `chrome://extensions/`
- **Refresh**: Refresh the Firebase page
- **Reinstall**: Remove and reinstall the extension

## 🏗️ Technical Details

### File Structure
```
firebase-link-purifier/
├── manifest.json       # Extension configuration
├── content.js         # URL parsing (runs on Firebase pages)
├── popup.html         # Extension UI structure
├── popup.js          # Main logic & history management
└── styles.css        # Styling
```

### Permissions Required
- **activeTab**: Access current tab URL
- **clipboardWrite**: Copy to clipboard
- **storage**: Save history persistently

### URL Parsing
Uses intelligent regex pattern that:
- Extracts project ID, app ID, and issue ID
- **Removes user-specific path** (`/u/0/`, `/u/1/`, etc.)
- Strips all query parameters (`?time=`, `&sessionId=`, etc.)
- Reconstructs generic, shareable URL
- Handles both Android and iOS apps

**Example transformation:**
```
Input:  /u/0/project/my-app/crashlytics/.../issues/abc123?time=30d
Output: /project/my-app/crashlytics/.../issues/abc123
```

## 🔄 Version History

### Version 2.0 (Current)
- ✅ Added custom naming feature
- ✅ Implemented persistent history
- ✅ Slack-ready formatting
- ✅ Two-tab interface
- ✅ Quick actions (open/delete)
- ✅ Timestamp display

### Version 1.0 (Original)
- ✅ Basic URL cleaning
- ✅ Simple copy to clipboard

## 🤝 Contributing

To modify or extend the extension:

1. Edit files in the `firebase-link-purifier` directory
2. Go to `chrome://extensions/`
3. Click the reload icon on the extension card
4. Test your changes on a Firebase page

## 👥 Sharing with Your Team

There are several ways to distribute this extension to your team:

### Option 1: Share the Folder (Quickest)

1. **Zip the extension folder**
   ```bash
   cd /Users/saurabh.vashisht@grofers.com/workspace
   zip -r firebase-link-purifier.zip firebase-link-purifier/
   ```

2. **Share via:**
   - Email attachment
   - Slack/Teams file upload
   - Cloud storage (Google Drive, Dropbox, etc.)
   - Internal file server

3. **Team members install by:**
   - Extract the zip file
   - Go to `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the extracted folder

**Pros**: Fast, simple, no approval needed
**Cons**: Manual updates required

### Option 2: Git Repository (Recommended for Teams)

1. **Create a Git repository**
   ```bash
   cd /Users/saurabh.vashisht@grofers.com/workspace/firebase-link-purifier
   git init
   git add .
   git commit -m "Initial commit: Firebase Link Purifier v2.0"
   ```

2. **Push to your company's Git server** (GitHub, GitLab, Bitbucket)
   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Team members install by:**
   ```bash
   git clone <your-repo-url>
   cd firebase-link-purifier
   ```
   - Then load as unpacked extension in Chrome

**Pros**: Version control, easy updates, track changes
**Cons**: Requires Git access

### Option 3: Chrome Web Store (Public/Unlisted)

For a more polished distribution:

1. **Prepare for submission:**
   - Create promotional images (128x128, 440x280, 1280x800)
   - Write store description
   - Add screenshots

2. **Package the extension:**
   ```bash
   cd /Users/saurabh.vashisht@grofers.com/workspace
   zip -r firebase-link-purifier.zip firebase-link-purifier/* -x "*.git*" "*.DS_Store"
   ```

3. **Submit to Chrome Web Store:**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time $5 developer fee
   - Upload the zip file
   - Choose visibility:
     - **Public**: Anyone can find and install
     - **Unlisted**: Only people with the link can install
     - **Private**: Organization-only (requires Google Workspace)

4. **Share the store link** with your team

**Pros**: Auto-updates, professional, easy installation
**Cons**: $5 fee, review process (1-3 days), ongoing maintenance

### Option 4: Enterprise Deployment (Google Workspace)

If your organization uses Google Workspace:

1. **Create Chrome Web Store listing** (as Option 3)
2. **Set visibility to Private**
3. **Add to organization's approved extensions**
4. **IT admin pushes to all users** automatically

**Pros**: Centralized management, auto-deployment, policy control
**Cons**: Requires Google Workspace admin access

### Quick Start Guide for Team Members

Create this simple guide for your team:

```markdown
# Firebase Link Purifier - Installation Guide

1. Download the extension folder from [your shared location]
2. Extract if zipped
3. Open Chrome → chrome://extensions/
4. Enable "Developer mode" (top-right toggle)
5. Click "Load unpacked"
6. Select the firebase-link-purifier folder
7. Done! Icon will appear in your toolbar

## Quick Test
- Visit any Firebase Crashlytics issue
- Click the extension icon
- See the clean URL displayed
```

### Updating the Extension

**If shared via folder/zip:**
- Share new version
- Team members: Remove old extension → Load new one

**If shared via Git:**
```bash
cd firebase-link-purifier
git pull origin main
# Reload extension in chrome://extensions/
```

**If on Chrome Web Store:**
- Upload new version
- Users get auto-update within 24 hours

## 📝 Notes

- Extension only works on Firebase Console domains
- History limited to 50 entries to prevent storage bloat
- Timestamps display in human-readable format (e.g., "2 hours ago")
- Slack formatting follows official Slack link syntax
- No external dependencies required

## 🎯 Tips

1. **Naming Convention**: Use consistent names for better organization
   - Example: "[Platform] Description" → "Android - Login Crash"

2. **History Management**: Regularly clear resolved issues to keep history clean

3. **Quick Copy**: Use "Copy Only" for one-time shares without cluttering history

4. **Batch Saving**: Save multiple issues during investigation sessions

5. **Team Sharing**: Share clean URLs to keep team communication clutter-free

---

**Need Help?** Check the troubleshooting section or reinstall the extension.

**Found a Bug?** The extension is open for improvements and fixes.
