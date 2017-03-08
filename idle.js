// Matter.js shorthand
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Bounds = Matter.Bounds,
    Events = Matter.Events,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.getElementById("render"),
    engine: engine,
    options: {
        width: Math.min(document.documentElement.clientWidth, 300),
        height: Math.min(document.documentElement.clientHeight, 600),
        wireframes: false
    }
});

// Set up collision filters
var MOUSE_FILTER = {
		group: 0,
		category: 1,
		mask: 1
	},
	BODY_FILTER = {
		group: 1,
		category: 2,
		mask: 2
	},
	BG_FILTER = {
		group: 2,
		category: 4,
		mask: 5
	};

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

// create two boxes and a ground
var wallOptions = {
	isStatic: true,
	collisionFilter: BODY_FILTER,
	render: {
		fillStyle: "gray"
	}
};
var boxA = Bodies.rectangle(400, 200, 80, 80, {collisionFilter: BODY_FILTER});
var boxB = Bodies.rectangle(450, 50, 80, 80, {collisionFilter: BODY_FILTER});
var left = Bodies.rectangle(0, 300, 20, 600, wallOptions);
var right = Bodies.rectangle(300, 300, 20, 600, wallOptions);
var ground = Bodies.rectangle(150, 610, 310, 60, wallOptions);

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground, left, right]);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        collisionFilter: MOUSE_FILTER,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

// keep the mouse in sync with rendering
render.mouse = mouse;

World.add(world, mouseConstraint);

// an example of using mouse events on a mouse
Events.on(mouseConstraint, 'mousedown', function(event) {
    var mousePosition = event.mouse.position;
    // console.log('mousedown at ' + mousePosition.x + ' ' + mousePosition.y);
    //var gem = Bodies.circle(mousePosition.x, mousePosition.y, 10, { collisionFilter: BODY_FILTER });
    //gem.gameType = GEM;
    //World.add(engine.world, gem);
    
    var gemsToAdd = doClick();
    gemsToAdd.forEach(function(e){
    	spawnGem(mousePosition, e);
    });
});

function spawnGem(pos, gem){
	var body;
	switch(gem.name){
		case "Quartz":
			body = Bodies.circle(pos.x, pos.y, 20, {
				collisionFilter: BODY_FILTER,
				render: {
					fillStyle: "white",
					strokeStyle: "grey"
				}
			});
			break;
		case "Topaz":
			body = Bodies.circle(pos.x, pos.y, 20, {
				collisionFilter: BODY_FILTER,
				render: {
					fillStyle: "orange",
					strokeStyle: "black"
				}
			});
			break;
		default:
			console.log("Unknown gem of type " + gem.name);
			return false;
	}
	body.gem = gem;
	World.add(engine.world, body);
}

var lastTime = 0;

Events.on(engine, 'tick', function(event) {
	// Remove gems falling through bottom
	for(var i = 0; i < world.bodies.length; i++){
		var body = world.bodies[i];
		if(body.gem !== undefined){
			//console.log(body.position.y);
			if(!Bounds.contains(render.bounds, body.position)){
				Composite.remove(world, body);
				sellGem(body.gem);
				//Composite.remove(world, body);
			}
		}
	}

	var delta = event.timestamp - lastTime;
	lastTime = event.timestamp;
	// genGems(delta);
});

// TODO
function genGems(delta){
	factories.forEach(function(e){
		var chance = (delta / 1000) * e.getRate() * e.owned;
	});
}

// Flush
ui.drop.onmousedown = function(){
	ground.collisionFilter = BG_FILTER;
	ground.render.fillStyle = "#D3D3D3";
}
ui.drop.onmouseup = function(){
	ground.collisionFilter = BODY_FILTER;
	ground.render.fillStyle = "gray";
}