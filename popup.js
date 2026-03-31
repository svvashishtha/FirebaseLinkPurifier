
// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const cleanUrlDisplay = document.getElementById('cleanUrl');
const linkNameInput = document.getElementById('linkName');
const copySaveBtn = document.getElementById('copySaveBtn');
const copyOnlyBtn = document.getElementById('copyOnlyBtn');
const historyList = document.getElementById('historyList');
const historyEmpty = document.getElementById('historyEmpty');
const clearAllBtn = document.getElementById('clearAllBtn');
const statusDiv = document.getElementById('status');

let currentCleanUrl = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  setupTabSwitching();
  await loadCurrentUrl();
  await loadHistory();
});

// Tab Switching
function setupTabSwitching() {
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active tab content
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(`${tabName}-tab`).classList.add('active');
      
      // Reload history when switching to history tab
      if (tabName === 'history') {
        loadHistory();
      }
    });
  });
}

// Load current URL from content script
async function loadCurrentUrl() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes("console.firebase.google.com")) {
      cleanUrlDisplay.textContent = "Not a Firebase page";
      cleanUrlDisplay.style.color = "#e53935";
      copySaveBtn.disabled = true;
      copyOnlyBtn.disabled = true;
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: "get_clean_url" }, (response) => {
      if (response && response.url) {
        currentCleanUrl = response.url;
        cleanUrlDisplay.textContent = response.url;
        cleanUrlDisplay.style.color = "#424242";
      } else {
        cleanUrlDisplay.textContent = "No Crashlytics issue found";
        cleanUrlDisplay.style.color = "#f57c00";
        copySaveBtn.disabled = true;
        copyOnlyBtn.disabled = true;
      }
    });
  } catch (err) {
    cleanUrlDisplay.textContent = "Error loading URL";
    cleanUrlDisplay.style.color = "#e53935";
    console.error(err);
  }
}

// Format URL for Slack
function formatForSlack(url, name) {
  if (name && name.trim()) {
    return `<${url}|${name.trim()}>`;
  }
  return url;
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Show status message
function showStatus(message, type = 'success') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';
  
  setTimeout(() => {
    statusDiv.style.display = 'none';
  }, 3000);
}

// Save to history
async function saveToHistory(url, name) {
  try {
    const result = await chrome.storage.local.get(['linkHistory']);
    let history = result.linkHistory || [];
    
    // Create new entry
    const entry = {
      id: Date.now().toString(),
      name: name && name.trim() ? name.trim() : null,
      url: url,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    // Add to beginning of array
    history.unshift(entry);
    
    // Limit to 50 entries
    if (history.length > 50) {
      history = history.slice(0, 50);
    }
    
    await chrome.storage.local.set({ linkHistory: history });
    return true;
  } catch (err) {
    console.error('Failed to save to history:', err);
    return false;
  }
}

// Load and display history
async function loadHistory() {
  try {
    const result = await chrome.storage.local.get(['linkHistory']);
    const history = result.linkHistory || [];
    
    if (history.length === 0) {
      historyList.style.display = 'none';
      historyEmpty.style.display = 'block';
      clearAllBtn.style.display = 'none';
      return;
    }
    
    historyList.style.display = 'block';
    historyEmpty.style.display = 'none';
    clearAllBtn.style.display = 'block';
    
    historyList.innerHTML = history.map(entry => createHistoryItem(entry)).join('');
    
    // Add event listeners to history items
    attachHistoryEventListeners();
  } catch (err) {
    console.error('Failed to load history:', err);
  }
}

// Create history item HTML
function createHistoryItem(entry) {
  const displayText = entry.name || truncateUrl(entry.url);
  const timeAgo = formatTimeAgo(entry.timestamp);
  
  return `
    <div class="history-item" data-id="${entry.id}">
      <div class="history-info">
        <div class="history-name" data-url="${entry.url}" data-name="${entry.name || ''}" title="${entry.url}">
          ${displayText}
        </div>
        <div class="history-time">${timeAgo}</div>
      </div>
      <div class="history-actions">
        <button class="icon-btn open-btn" data-url="${entry.url}" title="Open in new tab">
          🔗
        </button>
        <button class="icon-btn delete-btn" data-id="${entry.id}" title="Delete">
          🗑️
        </button>
      </div>
    </div>
  `;
}

// Truncate URL for display
function truncateUrl(url) {
  const maxLength = 40;
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}

// Format timestamp as "time ago"
function formatTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

// Attach event listeners to history items
function attachHistoryEventListeners() {
  // Copy on name click
  document.querySelectorAll('.history-name').forEach(nameEl => {
    nameEl.addEventListener('click', async () => {
      const url = nameEl.dataset.url;
      const name = nameEl.dataset.name;
      const slackFormatted = formatForSlack(url, name);
      
      const success = await copyToClipboard(slackFormatted);
      if (success) {
        showStatus('Copied for Slack!', 'success');
      } else {
        showStatus('Failed to copy', 'error');
      }
    });
  });
  
  // Open in new tab
  document.querySelectorAll('.open-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.url;
      chrome.tabs.create({ url: url });
    });
  });
  
  // Delete entry
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      await deleteHistoryEntry(id);
      await loadHistory();
      showStatus('Deleted', 'success');
    });
  });
}

// Delete history entry
async function deleteHistoryEntry(id) {
  try {
    const result = await chrome.storage.local.get(['linkHistory']);
    let history = result.linkHistory || [];
    
    history = history.filter(entry => entry.id !== id);
    
    await chrome.storage.local.set({ linkHistory: history });
    return true;
  } catch (err) {
    console.error('Failed to delete entry:', err);
    return false;
  }
}

// Clear all history
clearAllBtn.addEventListener('click', async () => {
  if (confirm('Are you sure you want to clear all history?')) {
    try {
      await chrome.storage.local.set({ linkHistory: [] });
      await loadHistory();
      showStatus('History cleared', 'success');
    } catch (err) {
      showStatus('Failed to clear history', 'error');
    }
  }
});

// Copy & Save button
copySaveBtn.addEventListener('click', async () => {
  if (!currentCleanUrl) return;
  
  const name = linkNameInput.value;
  const slackFormatted = formatForSlack(currentCleanUrl, name);
  
  const copySuccess = await copyToClipboard(slackFormatted);
  const saveSuccess = await saveToHistory(currentCleanUrl, name);
  
  if (copySuccess && saveSuccess) {
    showStatus('Copied & Saved!', 'success');
    linkNameInput.value = ''; // Clear input
  } else if (copySuccess) {
    showStatus('Copied, but failed to save', 'warning');
  } else {
    showStatus('Failed to copy', 'error');
  }
});

// Copy Only button
copyOnlyBtn.addEventListener('click', async () => {
  if (!currentCleanUrl) return;
  
  const name = linkNameInput.value;
  const slackFormatted = formatForSlack(currentCleanUrl, name);
  
  const success = await copyToClipboard(slackFormatted);
  
  if (success) {
    showStatus('Copied!', 'success');
  } else {
    showStatus('Failed to copy', 'error');
  }
});
