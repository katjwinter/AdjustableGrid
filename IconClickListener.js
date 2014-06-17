// Called when the browser action (the extension's icon) is clicked
chrome.browserAction.onClicked.addListener(function() {
	// Load our CSS to be available in the page
	chrome.tabs.insertCSS( null, {
		file: "Grid.css"
	});
	// Load our scripts to be available in the page.
	// Dependencies our loaded first so our primary script
	// can run in the same context, considering a given page
	// may not already have jquery or underscorejs and/or
	// the correct version.
	chrome.tabs.executeScript( null, {
		file: "jquery-1.6.2.min.js"
	}, function() {
		chrome.tabs.executeScript(null, {
			file: "underscore-min.js"
		}, function() {
			chrome.tabs.executeScript(null, {
				file: "js/jquery-ui-1.10.4.custom.min.js"
			}, function() {
				chrome.tabs.executeScript(null, {
					file: "Grid.js"
				});
			});
		});
		
	});
});