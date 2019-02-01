///////////
// BOIDS //
///////////

var model = Snap("#model");
var boids = [];

// INITIALIZE - on load, and when some values change
var init = function(){

	// clear everything
	model.clear();
	boids = [];

	// create boids
	for(var i=0;i<Sim.model.count;i++){
		var b = new Boid({
			x: Math.random()*document.body.clientWidth,
			y: Math.random()*document.body.clientHeight,
			rotation: Math.random()*360
		});
		boids.push(b);
	}

	// update boid colors
	updateColors();

};
var updateColors = function(){

	// Random, or a specific color?
	var color;
	var isRandom = (Sim.model.color=="random colors");
	if(!isRandom){
		switch(Sim.model.color){
			case "black": color="#1b2328"; break;
			case "red": color="#E86661"; break;
			case "blue": color="#7DA3E8"; break;
		}
	}

	// Color each boid
	for(var i=0;i<boids.length;i++){
		var boid = boids[i];
		color = isRandom ? Snap.hsl2rgb(Math.random(),0.7,0.7) : color;
		boid.graphics.attr({
			fill:Math.random()<0.07 ? "#6f4513":  color
		});
	}

};
window.onload = init;

// BOID Class
function Boid(config){

	var self = this;

	// Properties
	self.x = config.x;
	self.y = config.y;
	self.rotation = config.rotation;

	// Graphics & update graphics
	// draw a spaceship
	self.graphics = model.polygon([
		15,0,
		-15,10,
		-10,0,
		-15,-10
	]).attr({
		fill: "#333333"
	});

	self.draw = function(){
		var matrix = new Snap.Matrix();
		matrix.translate(self.x,self.y);
		matrix.rotate(self.rotation,0,0);
		matrix.scale(0.8);
		self.graphics.attr({transform:matrix});
	};
	self.draw();

	// Other methods
	self.turn = function(amount){
		self.rotation += amount;
	};
	self.move = function(amount){

		// Move it, move it.
		var r = self.rotation*(2*Math.PI)/360;
		var dx = Math.cos(r)*amount;
		var dy = Math.sin(r)*amount;
		self.x += dx;
		self.y += dy;

		// Loop around!
		var MARGIN = 20;
		if(self.x<-MARGIN) self.x=model.node.clientWidth+MARGIN;
		if(self.x>model.node.clientWidth+MARGIN) self.x=-MARGIN;
		if(self.y<-MARGIN) self.y=model.node.clientHeight+MARGIN;
		if(self.y>model.node.clientHeight+MARGIN) self.y=-MARGIN;

	};

}

// Helpers
var _findClosestBoid = function(boid){

	// Find the closest one
	var smallestDistance = Infinity;
	var closestOne = null;

	// this is gonna be O(n^2) UGH.
	for(var i=0;i<boids.length;i++){
		var boid2 = boids[i];
		if(boid2==boid) continue;
		var dx = boid.x-boid2.x;
		var dy = boid.y-boid2.y;
		var dist = dx*dx+dy*dy;
		if(dist<smallestDistance){
			smallestDistance = dist;
			closestOne = boid2;
		}
	}

	// Return it!
	return closestOne;

};

// All boids in front...
var _getAllBoidsInFront = function(boid){
	var boidsInFront = [];
	for(var i=0;i<boids.length;i++){
		var boid2 = boids[i];
		if(boid2==boid) continue;
		if(_isPointToLeft(boid, boid.rotation+90, boid2)){
			boidsInFront.push(boid2);
		}
	}
	return boidsInFront;
}

// CROSS PRODUCTS AND STUFF
// Where a = line point 1; b = line point 2; c = point to check against.
// If the formula is equal to 0, the points are colinear.
var _isPointToLeft = function(boid, rotation, point){
	var a = {
		x: boid.x,
		y: boid.y
	};
	var r = rotation*(2*Math.PI)/360;
	var b = {
		x: boid.x + Math.cos(r),
		y: boid.y + Math.sin(r)
	};
	var c = point;
	return ((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) < 0;
};

// Get average
var _averageOfGroup = function(group){
	if(group.length==0) return null;
	var target = {x:0,y:0};
	for(var i=0;i<group.length;i++){
		target.x += group[i].x;
		target.y += group[i].y;
	}
	target.x /= group.length;
	target.y /= group.length;
	return target;
}
