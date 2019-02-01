(function(){

// If I'm in a frame...
if(window.frameElement){
	window.IS_IN_SIGHT = false; // assume not seen at first
}else{
	window.IS_IN_SIGHT = true; // otherwise, yeah we're seen
	return; // so stop thinkin' about it
}

// then every 0.1 seconds, check to see if I'm in view...
setInterval(function(){

	var myTop = window.frameElement.offsetTop; // so hacky
	var myBottom = myTop + window.frameElement.clientHeight;
	var viewTop = window.top.scrollY;
	var viewBottom = viewTop + window.top.document.body.clientHeight;

	// The two rectangles overlap...
	window.IS_IN_SIGHT = (myTop<viewBottom && myBottom>viewTop);

},100);

})();