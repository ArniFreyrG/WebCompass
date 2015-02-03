
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
  	var tab = tabs[0];
  	var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

var urlUni;

chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.executeScript(null, {file: 'jquery-2.1.3.min.js'}, 
	function() {chrome.tabs.executeScript(null, {file: 'underscore-min.js'},
		function() {chrome.tabs.executeScript(null, {file: 'backbone-min.js'},
			function(){
				getCurrentTabUrl(function(url){
					// regex to find hostname from url
					urlUni = url;
					chrome.tabs.executeScript({ file: 'contents.js' }); 
					chrome.tabs.insertCSS({ file: 'styles.css'});
				});
			});
		});
	});
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	    console.log("MESSAGE RECEIVED");
	    sendResponse({url: urlUni});
	} 
);


