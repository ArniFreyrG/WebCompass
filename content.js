// Find initial bearing (clockwise from north) from position1 to position2
function getDir(lat1, lon1, lat2, lon2){
	p1 = lat1 * Math.PI / 180;
	p2 = lat2 * Math.PI / 180;
	d = (lon2 - lon1) * Math.PI / 180;
	var y = Math.sin(d)*Math.cos(p2);
	var x = Math.cos(p1)*Math.sin(p2) - Math.sin(p1)*Math.cos(p2)*Math.cos(d);
	return -((Math.atan2(x,y) * 180 / Math.PI)-90);
}

// Get current domain
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

// Print render status to HTML
function renderStatus(statusText) {
  document.getElementById('status').innerHTML = statusText;
}

// Print position to HTML
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude; 
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
		if(!latitude){
			errorCallback("FANN EKKI HNIT");
		}
		if(latitude === 65 && longitude === -18){
			latitude = 64.146;
			longitude = -21.904;
		}
		callback(latitude,longitude,country);
	}
	x.onerror = function() {
		errorCallback("NETWORK ERROR")
	}
	x.send();
}
