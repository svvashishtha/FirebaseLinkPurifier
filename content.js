
// Function to extract the clean URL using Regex
function getCleanFirebaseUrl(url) {
  // Matches everything up to the alphanumeric Issue ID, excluding /u/X/ part
  const issueRegex = /https:\/\/console\.firebase\.google\.com\/(?:u\/\d+\/)?project\/([^/]+)\/crashlytics\/app\/([^/]+)\/issues\/([a-f0-9]+)/;
  const match = url.match(issueRegex);
  
  if (match) {
    const projectId = match[1];
    const appId = match[2];
    const issueId = match[3];
    
    // Reconstruct URL without /u/X/ part
    return `https://console.firebase.google.com/project/${projectId}/crashlytics/app/${appId}/issues/${issueId}`;
  }
  
  return null;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get_clean_url") {
    const cleanUrl = getCleanFirebaseUrl(window.location.href);
    sendResponse({ url: cleanUrl });
  }
  return true; // Keeps the message channel open for async response
});
