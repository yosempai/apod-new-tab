$(document).ready(function(){
   var getAPOD = function(){
		var key = config.APOD_KEY;

	    $.getJSON("https://api.nasa.gov/planetary/apod?api_key=" + key, function(json) {
	    	if (json != ""){
		    	if(json['media_type'] == "video") { //sometimes the APOD is actually an AVOD!
			    	var apodHtml = "";
			        var charCount = json['title'].length;
			        var titleClass = 'title';

					if(charCount > 25) { //make the letters a little smaller.
						titleClass = titleClass + ' smallerFont';
				    }

					//get the youtube video's thumbnail url

					//split video url by slashes into an array
					var videoUrlArray = json['url'].split("/");

					//get the 5th item in array (should be the video ID)
					var videoID = videoUrlArray[4];

					//strip extraneous vars after video id
					var videoIDArray = videoID.split("?");
					videoID = videoIDArray[0];

					var thumbnailURL = "https://img.youtube.com/vi/"+ videoID +"/0.jpg";

				    //display the title, description, and video
					apodHtml += '<div class="description tooltip"><a href="http://apod.nasa.gov/apod/astropix.html">+</a> <span class="tooltiptext">' + json['explanation'] + '</span></div>';
					apodHtml +='<h2 class="' + titleClass + '">'+ json['title'] +'</h2>';
			        apodHtml += "<div class='video'><iframe width='853' height='480' src='" + json['url'] + "'></iframe></div>";

			        //display video thumbnail
			        //fallback to css bg image (style.css) if it is low res
			        imageExists(thumbnailURL, function(exists) {
						//$('html').css('background', 'url(' + thumbnailURL + ') no-repeat center center fixed');
						//$('html').css('background-size', 'cover');
						});

			        $('#apod-container').html(apodHtml);
					$('body').addClass('loaded');
		       } else {
			       var charCount = json['title'].length;
				   var titleClass = 'title';

				   if(charCount > 25) {
					   titleClass = titleClass + ' smallerFont';
				   }

			       var apodHtml = "";
			       apodHtml += '<div class="description tooltip"><a href="http://apod.nasa.gov/apod/astropix.html">+</a> <span class="tooltiptext">' + json['explanation'] + '</span></div>';
				   apodHtml +='<h2 class="' + titleClass + '">'+ json['title'] +'</h2>';

		           $('#apod-container').html(apodHtml);
		           $('<img/>').attr('src', '' + json['hdurl']).load(function() {
						$(this).remove(); // prevent memory leaks as @benweet suggested
						$('html').css('background', 'url(' + json['hdurl'] + ') no-repeat center center fixed');
						$('html').css('background-size', 'cover');
						$('body').addClass('loaded');
					});
				}
          } else {
             	$.getJSON("https://api.nasa.gov/planetary/apod?api_key=" + key, function(json) {
                	console.log(json);
					$('#apod-container').html('<h2 class="loading">An Error Occurred</h2>');
					$('body').addClass('loaded');
            	});
          }
     });
	return false;
	}
   getAPOD();
});


// The "callback" argument is called with either true or false
// depending on whether the image at "url" exists or not.
function imageExists(url, callback) {
  var img = new Image();
  img.onload = function() { callback(true); };
  img.onerror = function() { callback(false); };
  img.src = url;
}
