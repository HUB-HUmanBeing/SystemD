#An Incredibly Incomplete Documentation

##Installing Improv.js

It's just two scripts:

	<script src="improv.js"></script>
	<script src="improv-widgets.js"></script>

And one default style:

    <link rel="stylesheet" type="text/css" href="improv-default.css">

##The Markup

You know that game, Mad Libs? Where you get a story, and have to fill-in-the-blanks with a noun, or adverb, or something or other? Improv.js is kinda like that. Improv's markup goes like this:

    Ohhhhh {NUMBER count: min=0,max=99} bottles of beer on the wall

When Improv parses the markup, the stuff in {curly brackets} will be replaced with an interactive widget. Here's how Improv parses markup into widgets:

	{WIDGET my.object.path: option 1, option 2, option 3...}
	
**WIDGET** – This will determine what kind of Widget UI you get. (more later on Widgets)

**my.object.path:** – The path of the property the widget is supposed to show & edit. (The colon at the end is optional)

**[options]** – The comma-separated options (can be "a,b,c" or "a, b, c", whatever looks better to you) that configure the Widget.

## The Widgets

Right now, there's only these three Widgets:

####NUMBER

	Make gravity {NUMBER speed: min=0,max=10,step=0.1} m/s^2

You get a scrubbable number.

min - the minimum number    
max - the maximum number    
step - what to increment/decrement the number by (optional. default=1)

####CHOOSE

	Turn {CHOOSE direction: L=to the left, R=to the right}
	
You get a \<select\> dropdown list.

[options] - a comma-separated list. Can be "value1=label1, value2=label2, value3=label3...", or just "value1, value2, value3..."

####ACTIONS

    {ACTIONS actions}
    
You get something your reader can use, to *re-program your model!* so cool~

(takes no options)

##Actually Using Improv.js

This next example comes from [Most Basic Demo](http://ncase.me/improv-wip/demos/basic/basic.html). First, you need an HTML element somewhere containing the markup you want to become interactive. Remember to give it an ID.

    <div id="editor">
	Let's make our box
	{NUMBER width: min=1,max=500} pixels wide,
	{NUMBER height: min=1,max=500} pixels tall,
	and let's color it
	{CHOOSE color: red, orange, yellow, green, blue, purple, black}
	</div>

I guess you'd want some actual data you can edit, too.

	<script>
    var data = { width:50, height:50, color:"red" };
    </script>	

Then, call Improv.edit to use your HTML to edit your data!

    Improv.edit(data,"#editor");
    
And if you want, you can also listen to if the data's been changed. Here, if any part of the data's changed, we re-render the box:

    Improv.listen(data,renderBox);
    
You can also just listen to a specific variable of the data, to see if that's been changed. Here's an example from the [Boids Demo #1](http://ncase.me/improv-wip/demos/boids/boids1.html):

	Improv.listen(Sim.model,"color",function(value){
		updateColors(); // update every boid's color
	});

Special case for the ACTIONS widget. When you want the user's "programming" to run, you need to call `Improv.act(object,action_data)`, like so:

	// Thirty times a second, update all boids
	setInterval(function(){
	
		// For all boids...
		for(var i=0;i<boids.length;i++){
			var boid = boids[i];
			Improv.act(boid, Sim.model.actions); // Act!
			boid.draw(); // Draw!
		}
		
	},1000/30);
	
Okay, that's it. Them's the docs so far.

good luck