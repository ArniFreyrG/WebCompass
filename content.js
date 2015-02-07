function getDir(lat1, lon1, lat2, lon2){
	p1 = lat1 * Math.PI / 180;
	p2 = lat2 * Math.PI / 180;
	d = (lon2 - lon1) * Math.PI / 180;
	var y = Math.sin(d)*Math.cos(p2);
	var x = Math.cos(p1)*Math.sin(p2) - Math.sin(p1)*Math.cos(p2)*Math.cos(d);
	return -((Math.atan2(x,y) * 180 / Math.PI)-90);
}

function getMid(lat1, lng1, lat2, lng2){
	var a = [0,0];
	d = (lng2-lng1) * Math.PI / 180;
	p1 = lat1 * Math.PI / 180;
	p2 = lat2 * Math.PI / 180;
	var x = Math.cos(p2) * Math.cos(d);
	var y = Math.cos(p2) * Math.sin(d);
	var p3 = Math.atan2(Math.sin(p1) + Math.sin(p2), Math.sqrt((Math.cos(p1)+x)*(Math.cos(p1)+x) + y*y));
	var d2 = lng1 + Math.atan2(y, Math.cos(p1)+x);
	var a = [p3,d2];
	return a;
}

var model = Backbone.Model.extend({
	initialize: function(options){
		this.page = options.page;
	},
	url: function(){
		return "https://freegeoip.net/json/" + this.page;
	}
});

console.log("þar");
console.log(Backbone.VERSION);
console.log(jQuery.fn.jquery);

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	console.log("MESSAGE SENT");
	if(!response){console.log("NO REPLY");}	
    else{ 
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
				    		$("iframe").attr({"src": response.url});
				    		console.log(response.url);
					    	setTimeout(function(){
				    			$("iframe, #hidden-container").animate( {borderSpacing: angle}, {step: function(now,fx){
					    			$(this).css({"-webkit-transform": 'rotate(' + now + 'deg)'}, "fast");
					    			},
					    			duration: 7000
					    		}), "linear";
				    		}, 500);
					    	$('#blah').css({height:'20px', overflow:'hidden'});
							$('#blah').on('click', function() {
							    var $this = $(this);
							    if ($this.data('open')) {
							        $this.animate({height:'20px'});
							        $this.data('open', 0);

							    }
							    else {
							        $this.animate({height:'300px'});
							        $this.data('open', 1);
							    }
							});
				    		});
					}
				});
			}
		});	
    	}
});


