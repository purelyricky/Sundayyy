/**
 * @readable-header
 * FILE:      gif_viewer.js
 * OWNER:     claus
 * WHAT:      Script for gif_viewer.html that reads exportedGifData from chrome.storage.local and displays the GIF.
 * USED BY:   gif_viewer.html (html tag)
 * NEEDS:     gif_viewer.html (named in code)
 *            offscreen.js (named in code)
 */
// gif_viewer.js — script of gif_viewer.html (a page inside the extension).
//
// Shows an animated GIF that the extension exported. The GIF (base64 +
// filename + timestamp) was left in chrome.storage.local under the key
// "exportedGifData" (the GIF itself is built by offscreen.js). This script
// reads it, rejects it if older than 5 minutes, turns it into a blob: URL,
// shows it as an <img> inside a download link, then deletes the stored copy.
//
// Network: none. Messaging: none. It reads only that one storage key.
// (This file was already unminified; only re-formatted.)
(async () => {
  const content = document.getElementById("content");

  try {
    // Get exported GIF data from storage
    const result = await chrome.storage.local.get("exportedGifData");
    const data = result.exportedGifData;

    if (!data || !data.base64 || !data.filename) {
      throw new Error("No GIF data found. The export may have expired.");
    }

    // Check if data is stale (older than 5 minutes)
    if (Date.now() - data.timestamp > 300000) {
      throw new Error("GIF data expired. Please export again.");
    }

    // Convert base64 to blob
    const byteCharacters = atob(data.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/gif" });
    const blobUrl = URL.createObjectURL(blob);

    // Show the GIF - clicking downloads it
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = data.filename;

    const img = document.createElement("img");
    img.src = blobUrl;
    img.alt = data.filename;

    link.appendChild(img);
    content.appendChild(link);

    // Update page title with filename
    document.title = data.filename;

    // Clean up storage after successful load
    await chrome.storage.local.remove("exportedGifData");
  } catch (error) {
    console.error("[GIF Viewer] Error:", error);
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.textContent = error.message;
    content.appendChild(errorDiv);
  }
})();
