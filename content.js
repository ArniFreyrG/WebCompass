
chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	console.log("MESSAGE SENT");
	if(!response){console.log("NO REPLY");}	
    else{ 
    	info = response;
    	console.log(JSON.stringify(response, null, 4));
    	document.head.innerHTML = '<link rel="stylesheet" type="text/css" href="styles.css">';
    	document.body.innerHTML = '<div id="container"><iframe width="100%" height="100%" src=' + response.url + '></iframe><div id="hidden-container"><div id="needle-container">&#8682;<br>THIS SITE IS <i>THAT</i> WAY!<br><div id="moreinfo"></div><script> function info(){document.getElementById("moreinfo").innerHTML = "hér má sjá meiri upplýsingar"}</script><button id="infobutton" onclick="info()">ýta hér</button></div></div></div>';
    	document.body.style["-webkit-transform"] = "rotate(" + response.angle + "deg)";
    }
});
