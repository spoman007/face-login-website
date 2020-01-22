$(document).ready(function(){   
	setTimeout(function(){
		$('.view').removeClass('filter-red_blur');
	}, 500);
	
  var analysis = "^1000<h2>analysis:</h2>^1000<p>6546546465461</p>^200<p>8989000054545</p>^200<p>5699878225255</p>^200<p>0233255714589</p><p>9412323687985<br/><br/></p><p>8885575522255</p><p>5646484513248</p><p>6546626233653</p>";
	
	var tracking = "^1000match <span class='square'>&#9632;</span>";
  
	$(function(){
		var typed = new Typed("#report", {
			strings: ["^1000<p>......</p>", "^1000<p>scan mode 43894</p>size assement<br/><br/>^1000<p><p>assesment complete<br/><br/></p>^500<p>fit probability 0.99<br/><br/></p>^500<p>reset to aquisition<br/>mode speech level 78<br/><br/></p>^500<p>priority override</p><p>defense systems set</p><p>active status</p><p>level 2347923 max</p>"],
			showCursor:false,
			loop: false
		});	
  	var typed = new Typed("#analysis", {
      strings: [analysis],
      loop: false,
			showCursor:false,
			typeSpeed:0,
			onComplete: function() {
				var typed = new Typed("#tracking", {
						strings: [tracking],
						loop: false,
						showCursor:false,	
						typeSpeed:50	
				});
			}
    });		

  });
});