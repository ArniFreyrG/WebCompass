
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

var data = {
	url: null,
	imgsrc: null
};

chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.executeScript(null, {file: 'jquery-2.1.3.min.js'}, 
	function() {chrome.tabs.executeScript(null, {file: 'underscore-min.js'},
		function() {chrome.tabs.executeScript(null, {file: 'backbone-min.js'},
			function(){getCurrentTabUrl(
				function(url){chrome.tabs.captureVisibleTab(null, {format: 'jpeg'}, 
					function(dataUrl){
						data.imgsrc = dataUrl;
						data.url = url;
						chrome.tabs.executeScript({ file: 'content.js' }); 
						chrome.tabs.insertCSS({ file: 'styles.css'});
					});
				});
			});;
		});
	});
});

chrome.webRequest.onHeadersReceived.addListener(
    function(info) {
    	console.log("header received");
        var headers = info.responseHeaders;
        for (var i=headers.length-1; i>=0; --i) {
            var header = headers[i].name.toLowerCase();
            if (header == 'x-frame-options' || header == 'frame-options') {
                headers.splice(i, 1); // Remove header
            }
        }
        return {responseHeaders: headers};
    },
    {
        urls: [ '*://*/*' ], // Pattern to match all http(s) pages
        types: [ 'sub_frame' ]
    },
    ['blocking', 'responseHeaders']
);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	    console.log("MESSAGE RECEIVED");
	    sendResponse({url: urlUni});
	} 
);


