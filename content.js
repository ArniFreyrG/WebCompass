// Get bearing from coordinates
function getDir(lat1, lon1, lat2, lon2){
	p1 = lat1 * Math.PI / 180;
	p2 = lat2 * Math.PI / 180;
	d = (lon2 - lon1) * Math.PI / 180;
	var y = Math.sin(d)*Math.cos(p2);
	var x = Math.cos(p1)*Math.sin(p2) - Math.sin(p1)*Math.cos(p2)*Math.cos(d);
	return -((Math.atan2(x,y) * 180 / Math.PI)-90);
}

var model = Backbone.Model.extend({
	initialize: function(options){
		this.page = options.page;
	},
	url: function(){
		return "https://freegeoip.net/json/" + this.page;
	}
});

console.log(Backbone.VERSION);
console.log(jQuery.fn.jquery);

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	console.log("MESSAGE SENT");
	if(!response){console.log("NO REPLY");}	
    else{ 
    	var loadingHTML = chrome.extension.getURL("loading.html");
    	var wheelurl = chrome.extension.getURL("loader2.gif");
    	$("body").attr({"scrolling": "no"})
    	$("body").load(loadingHTML,function(){
    		$("head").html("");
    		jQuery("#background").css("background-image", "url(" + response.imgsrc + ")");
    		$("img").attr({"src": wheelurl});
			dom = response.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
			var here = new model({page:""});
			var there = new model({page: dom});
			here.fetch({
				success:function(){
					there.fetch({
						success:function(){
					    	var angle = getDir(here.get("latitude"),here.get("longitude"),there.get("latitude"),there.get("longitude"));
					    	var rotatorHTML = chrome.extension.getURL("rotator.html");
					    	console.log(rotatorHTML);
					    	$("body").load(rotatorHTML,function(){

					    		// Animate page turning
					    		$("iframe").attr({"src": response.url});
					    		setTimeout(function(){
					    			$("iframe, #hidden-container").animate( {borderSpacing: angle}, {step: function(now,fx){
						    			$(this).css({"-webkit-transform": 'rotate(' + now + 'deg)'}, "fast");
						    			},
						    			duration: 7000
						    		}), "linear";
					    		}, 500);

					    		// Write location text
					    		$('#cityHere').text(here.get("city"));
					    		$('#countryHere').text(here.get("country_name"));
					    		$('#latHere').text(here.get("latitude"));
					    		$('#lngHere').text(here.get("longitude"));
					    		$('#there').text(dom + " location");
					    		if(there.get("city"))$('#cityThere').text(there.get("city"));
					    		$('#countryThere').text(there.get("country_name"));
					    		$('#latThere').text(there.get("latitude"));
					    		$('#lngThere').text(there.get("longitude"));

					    		// more/less info animation
						    	$('#tables').css({height:'16px', overflow:'hidden'});
								$('#info').on('click', function() {
									var $this = $(this);
								    var $tables = $('#tables');
								    if ($tables.data('open')) {
								        $tables.animate({height:'16px'});
								        $tables.data('open', 0);
								        $this.text('more info');

								    }
								    else {
								        $tables.animate({height:'210px'});
								        $tables.data('open', 1);
								        $this.text('less info');
								    }
								});
					    		});
						}
					});
				}
			});
		});	
	}
});


