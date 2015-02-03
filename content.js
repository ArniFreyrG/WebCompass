function getDir(lat1, lon1, lat2, lon2){
	p1 = lat1 * Math.PI / 180;
	p2 = lat2 * Math.PI / 180;
	d = (lon2 - lon1) * Math.PI / 180;
	var y = Math.sin(d)*Math.cos(p2);
	var x = Math.cos(p1)*Math.sin(p2) - Math.sin(p1)*Math.cos(p2)*Math.cos(d);
	return -((Math.atan2(x,y) * 180 / Math.PI)-90);
}

console.log("þar");
console.log(Backbone.VERSION);
console.log(jQuery.fn.jquery);

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	console.log("MESSAGE SENT");
	if(!response){console.log("NO REPLY");}	
    	else{ 
    	dom = response.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
		var model = Backbone.Model.extend({
			initialize: function(options){
				this.page = options.page;
			},
			url: function(){
				return "https://freegeoip.net/json/" + this.page;
			}
		});
		var here = new model({page:""});
		var there = new model({page: dom});
		here.fetch({
			success:function(){
				there.fetch({
					success:function(){
				    	var angle = getDir(here.get("latitude"),here.get("longitude"),there.get("latitude"),there.get("longitude"));
				    	document.body.innerHTML = '<div id="container"><iframe width="100%" height="100%" src=' + response.url + '></iframe><div id="hidden-container"><div id="needle-container">&#8682;<br>THIS SITE IS <i>THAT</i> WAY!<br><div id="moreinfo"></div><script> function info(){document.getElementById("moreinfo").innerHTML = "hér má sjá meiri upplýsingar"}</script><button id="infobutton" onclick="info()">ýta hér</button></div></div></div>';
				    	document.body.style["-webkit-transform"] = "rotate(" + angle + "deg)";
						
						
					}
				});
			}
		});	
    }
});
