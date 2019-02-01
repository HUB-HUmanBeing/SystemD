/////////////////////////////////////
// HOW BOIDS INTERACTS WITH IMPROV //
/////////////////////////////////////

// UPDATE LOOP
setInterval(function(){

	// IF NOT SEEN, WHO CARES
	if(!window.IS_IN_SIGHT) return;

	// Act on, and draw, each boid
	for(var i=0;i<boids.length;i++){
		var boid = boids[i];
		Improv.act(boid, Sim.model.actions);
		boid.draw();
	}

},1000/30);

// MOVE FORWARD
Improv.actions.move = {
	label: "Move forward...",
	editor: "Move forward {NUMBER amount: max=50,min=0,default=10} pixels.",
	act: function(boid,options){
		boid.move(options.amount);
	}
};

// STEER TOWARDS/AWAY FROM...
Improv.actions.steer = {
	label: "Steer towards/away from...",
	editor: "Steer {CHOOSE direction: t=towards,a=away from} "+
			"{CHOOSE target: m=the mouse,c=the closest boid,f=the boids in front of me} "+
			"by {NUMBER turn: min=0,max=10} degrees",
	act: function(boid,options){

		// 1. Get the target
		var target;
		switch(options.target){
			case "m": target = Mouse; break;
			case "c": target = _findClosestBoid(boid); break;
			case "f": target = _averageOfGroup(_getAllBoidsInFront(boid)); break;
			//case "a": target = _averageOfGroup(boids); break;
		}
		if(target==null) return; // no? stop.

		// 2. Steer left or right, depending on if it's to my left/right,
		// and also if I'm going towards or away from.
		var direction = (options.direction=="t") ? 1 : -1;
		var cw = _isPointToLeft(boid, boid.rotation, target) ? -1 : 1;
		boid.turn(options.turn*cw*direction);
		
	}
};

// IF I'M CLOSE TO...
Improv.actions.if_close = {
	label: "If close to...",
	editor: "If I'm within {NUMBER radius: min=0,max=500} pixels of "+
			"{CHOOSE target: m=the mouse,b=another boid}...<br>"+
			"{ACTIONS actions}",
	act: function(boid,options){

		// Get the target
		var target;
		switch(options.target){
			case "m": target = Mouse; break;
			case "b": target = _findClosestBoid(boid); break;
		}
		if(target==null) return; // no? stop.

		// Am I within its radius?
		var dx = boid.x-target.x;
		var dy = boid.y-target.y;
		var distSquared = dx*dx+dy*dy;
		var radiusSquared = options.radius*options.radius;
		if(distSquared>radiusSquared) return; // nope, I'm not

		// But if I am...
		Improv.act(boid, options.actions);

	}
};

// TURN LEFT/RIGHT...
Improv.actions.turn = {
	label: "Turn left/right...",
	editor: "Turn {CHOOSE direction: left,right} by {NUMBER amount: min=0,max=10} degrees.",
	act: function(boid,options){
		var direction = (options.direction=="left") ? -1 : 1;
		boid.turn(direction*options.amount);
	}
};