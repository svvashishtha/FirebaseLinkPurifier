
// Function to extract the clean URL using Regex
function getCleanFirebaseUrl(url) {
  // Matches everything up to and including the full Issue ID (which may contain encoded characters like %7C)
  // Excludes /u/X/ part and stops at query parameters or fragments
  const issueRegex = /https:\/\/console\.firebase\.google\.com\/(?:u\/\d+\/)?project\/([^/?#]+)\/crashlytics\/app\/([^/?#]+)\/issues\/([^?#]+)/;
  const match = url.match(issueRegex);
  
  if (match) {
    const projectId = match[1];
    const appId = match[2];
    const issueId = match[3].trim(); // Capture everything after /issues/ until ? or #
    
    // Reconstruct URL without /u/X/ part, query parameters, or fragments
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
