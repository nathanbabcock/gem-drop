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
        height: Math.min(document.documentElement.clientHeight, 500),
        wireframes: false,
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
// var boxA = Bodies.rectangle(400, 200, 80, 80, {collisionFilter: BODY_FILTER});
// var boxB = Bodies.rectangle(450, 50, 80, 80, {collisionFilter: BODY_FILTER});
var left = Bodies.rectangle(0, 250, 20, 480, wallOptions);
var right = Bodies.rectangle(300, 250, 20, 480, wallOptions);
var ground = Bodies.rectangle(150, 480, 310, 20, wallOptions);
// var debug = Bodies.rectangle(20, 20, 20, 20, wallOptions);

// add all of the bodies to the world
World.add(engine.world, [ground, left, right]);

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
	updateMoney();
}

var lastTime = 0;
Events.on(engine, 'tick', function(event) {
	// Remove gems
	world.bodies.forEach(function(body){
		if(body.gem !== undefined){
			if(body.position.y > render.bounds.max.y){
				Composite.remove(world, body);
				sellGem(body.gem);
			} else if(body.position.y < 0) {
				Composite.remove(world, body);
				updateMoney();
			}
		}
	});

	// Spawn gems
	var delta = (event.timestamp - lastTime) / 1000;
	lastTime = event.timestamp;
	genGems(delta);

	// Auto drop
	var rate = auto_drop.getRate();
	if(auto_drop.getRate() > 0){
		auto_drop.timer -= delta;
		if(auto_drop.timer <= 0){
			if(auto_drop.open){
				closeDrop();
				auto_drop.open = false;
				auto_drop.timer = rate;
			} else {
				openDrop();
				auto_drop.open = true;
				auto_drop.timer = auto_drop.getOpenDuration();
			}
		}	
	}
});

var spawnRect = {x1: 0, y1: 0, x2: render.bounds.max.x, y2: 50};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genGems(delta){
	//var toSpawn = genGems_deterministic(delta) = genGems_probabilistic(delta);
	var toSpawn = genGems_deterministic(delta);
	toSpawn.forEach(function(g){
		var pos = {
			x: getRandomInt(spawnRect.x1, spawnRect.x2),
			y: getRandomInt(spawnRect.y1, spawnRect.y2)
		};
		//console.log(pos);
		spawnGem(pos, g);
	});
}

function openDrop(){
	ground.collisionFilter = BG_FILTER;
	ground.render.fillStyle = "#D3D3D3";
}

function closeDrop(){
	ground.collisionFilter = BODY_FILTER;
	ground.render.fillStyle = "gray";
}

// Drop
ui.drop.onmousedown = function(){
	openDrop();
}
ui.drop.onmouseup = function(){
	closeDrop();
}

function debug(){
	body = Bodies.circle(100, 10, 20, {
		collisionFilter: BODY_FILTER,
		render: {
			fillStyle: "white",
			strokeStyle: "grey"
		}
	});
	body.gem = gems[0];
	//World.add(engine.world, body);
	for(var i = 0; i < 60 * 10; i++){
		Engine.update(engine, 1000 / 60);
	}
	// engine.update(10);
}

function getInventoryValue(){
	var val = 0;
	world.bodies.forEach(function(body){
		if(body.gem !== undefined){
			val += body.gem.getPrice();
		}
	});
	return val;
}