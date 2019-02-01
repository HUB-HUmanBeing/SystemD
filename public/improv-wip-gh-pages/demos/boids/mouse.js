(function(exports){

	// Singleton
	var Mouse = {
		x: document.body.clientWidth/2,
		y: document.body.clientHeight/2,
		pressed: false
	};
	exports.Mouse = Mouse;

	// Event Handling
	var onMouseMove;
	document.body.addEventListener("mousedown",function(event){
	    Mouse.pressed = true;
	    onMouseMove(event);
	},false);

	document.body.addEventListener("mouseup",function(event){
	    Mouse.pressed = false;
	},false);

	document.body.addEventListener("mousemove",onMouseMove = function(e){
		Mouse.x = e.pageX;
		Mouse.y = e.pageY-window.scrollY;
	},false);

})(window);