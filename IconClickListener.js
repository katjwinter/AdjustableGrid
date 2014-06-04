// Called when the browser action (the extension's icon) is clicked
chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.executeScript( null, {
		file: "Grid.js"
	});
});