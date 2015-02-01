function getDir(lat1, lon1, lat2, lon2){
	p1 = lat1 * Math.PI / 180;
	p2 = lat2 * Math.PI / 180;
	d = (lon2 - lon1) * Math.PI / 180;
	var y = Math.sin(d)*Math.cos(p2);
	var x = Math.cos(p1)*Math.sin(p2) - Math.sin(p1)*Math.cos(p2)*Math.cos(d);
	return -((Math.atan2(x,y) * 180 / Math.PI)-90);
}

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

// Search for coordinates from "http://freegeoip.net" (kudos)
function findCoords(url, callback, errorCallback){
	var x = new XMLHttpRequest();
	x.open('GET', url);
	x.responseType = 'json';
	x.onload = function() {
		var response = x.response;
		if(!response) {
			errorCallback("EKKERT SVAR")
			return;
		}
		var latitude = response.latitude;
		var longitude = response.longitude;
		var country = response.country_name;
		var city = response.city;
		if(!latitude){
			errorCallback("FANN EKKI HNIT");
		}
		if(latitude === 65 && longitude === -18){
			latitude = 64.146;
			longitude = -21.904;
		}
		callback(latitude,longitude,country,city);
	}
	x.onerror = function() {
		errorCallback("NETWORK ERROR")
	}
	x.send();
}

var info = {
	latYou: null,
	lonYou: null,
	latThere: null,
	lonThere: null,
	angle: null,
	cityYou: null,
	countryYou: null,
	cityThere: null,
	countryThere: null,
	url: null,
	dom: null
};


chrome.browserAction.onClicked.addListener(function(tab){
	getCurrentTabUrl(function(url){
		info.url = url;
		// regex to find hostname from url
		dom = url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
		info.dom = dom;
		var searchUrl = "http://freegeoip.net/json/" + dom;
		info.latThere = searchUrl;
		findCoords(searchUrl, function(latitude, longitude, country, city){
			if(!latitude){info.latThere = "BÍÐA AÐEINS!!";}
			info.latThere = latitude;
			info.lonThere = longitude;
			info.countryThere = country;
			info.cityThere = city
			// finding you (yes, YOU!)
			findCoords("http://freegeoip.net/json/", function(latitude2, longitude2, country2, city2){
				info.latYou = latitude2;
				info.lonYou = longitude2;
				info.countryYou = country2;
				info.cityYou = city2;
				var direction = getDir(latitude2,longitude2,latitude,longitude);
				info.angle = direction;
				chrome.tabs.executeScript({ file: 'contentscript.js' }); 
				chrome.tabs.insertCSS({ file: 'styles.css'});
				
			}, function(errorMessage) {
		      info.latTere = 'Cannot find you. ' + errorMessage;
		    });
		}, function(errorMessage) {
			info.latThere ='Cannot find website. ' + errorMessage;
	    });
		if(!info.latYou){info.latYou = "failed";}
	});
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	    console.log("MESSAGE RECEIVED");
	    sendResponse(info);
	} 
);


