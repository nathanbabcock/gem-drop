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
        background: '#fff',
        wireframes: true
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
// var runner = Engine.run(engine);
var runner = Runner.run(engine);

// run the renderer
Render.run(render);

// INVENTORY
var Inventory = {
	// defaults
	wall_radius: 5,
	bottom_margin: 10,
	wall_options: {
		isStatic: true,
		collisionFilter: BODY_FILTER,
		render: {
			fillStyle: "gray",
			strokeStyle: "gray"
		}
	},
	getSize: function() {
		// TODO shorthand like this? Array must be ordered descending according to size/priority
		// Upgrades.InvSize.forEach(function(upgrade){
		// });
		if(Upgrades[2].owned)
			return Upgrades[2].size;
		else if(Upgrades[1].owned)
			return Upgrades[1].size;
		else if(Upgrades[0].owned)
			return Upgrades[0].size;
		else return { width: 50, height: 250 };
	},

	// body references
	left: undefined,
	right: undefined,
	ground: undefined,

	// methods
	build: function() {
		var size = this.getSize();

		// Remove old
		[this.left, this.right, this.ground].forEach(function(body){
			if(body !== undefined)
				Composite.remove(world, body);
		});

		// Set canvas dims
		render.canvas.width = size.width + this.wall_radius * 2;
		render.canvas.height = size.height + this.wall_radius;

		// Construct
		this.left = Bodies.rectangle(this.wall_radius / 2, render.canvas.height / 2 - this.bottom_margin, this.wall_radius, render.canvas.height, this.wall_options);
		this.right = Bodies.rectangle(render.canvas.width - (this.wall_radius / 2), render.canvas.height / 2  - this.bottom_margin, this.wall_radius, render.canvas.height, this.wall_options);
		this.ground = Bodies.rectangle(render.canvas.width / 2, render.canvas.height - (this.wall_radius / 2) - this.bottom_margin, render.canvas.width, this.wall_radius, this.wall_options);

		// Add
		World.add(engine.world, [this.left, this.right, this.ground]);
	},

	getValue: function() {
		var val = 0;
		world.bodies.forEach(function(body){
			if(body.gem !== undefined){
				val += body.gem.getValue();
			}
		});
		return val;
	}
};


// add all of the bodies to the world
// World.add(engine.world, [ground, left, right]);
Inventory.build();


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
    var skip = false;
    [Inventory.left, Inventory.right, Inventory.ground].forEach(function(body){
    	if(Bounds.contains(body.bounds, mousePosition)){
    		//console.log("ignoring a click on the bounds");
    		skip = true;
    		return false;
    	}
    		
    });
    if(skip || mousePosition.y >= render.canvas.height - Inventory.bottom_margin) return;

    doClick().forEach(function(e){
    	spawnGem(mousePosition, e);
    });
});

Math.toRadians = function(deg){
	return (Math.PI / 180) / deg;
};

function spawnGem(pos, gem){
	var body;
	var DEFAULT_RADIUS = DEFAULT_GEM_RADIUS;
	switch(gem.name){
		case "Quartz":
			// body = Bodies.circle(pos.x, pos.y, DEFAULT_RADIUS, {
			// 	collisionFilter: BODY_FILTER,
			// 	render: {
			// 		fillStyle: "white",
			// 		strokeStyle: "grey"
			// 	}
			// });
			body = Bodies.polygon(pos.x, pos.y, 3, DEFAULT_RADIUS, {
				collisionFilter: BODY_FILTER,
				render: {
					fillStyle: "gray",
					// sprite: {
     //                    texture: 'img/quartz.png',
     //                    xScale: 40 / 148,
     //                    yScale: 40 / 128
     //                },
					strokeStyle: "transparent"
				}
			});
			break;
		case "Topaz":
			body = Bodies.polygon(pos.x, pos.y, 6, DEFAULT_RADIUS, {
				collisionFilter: BODY_FILTER,
				render: {
					fillStyle: "orange",
					strokeStyle: "transparent"
				}
			});
			break;
		case "Amethyst":
			body = Bodies.polygon(pos.x, pos.y, 5, DEFAULT_RADIUS, {
				collisionFilter: BODY_FILTER,
				render: {
					fillStyle: "purple",
					strokeStyle: "transparent"
				}
			});
			break;
		case "Sapphire":
			body = Bodies.polygon(pos.x, pos.y, 8, DEFAULT_RADIUS, {
				collisionFilter: BODY_FILTER,
				render: {
					fillStyle: "blue",
					strokeStyle: "transparent"
				}
			});
			break;
		case "Emerald":
			body = Bodies.polygon(pos.x, pos.y, 4, DEFAULT_RADIUS, {
				collisionFilter: BODY_FILTER,
				render: {
					fillStyle: "green",
					strokeStyle: "transparent"
				}
			});
			break;
		case "Ruby":
			body = Bodies.circle(pos.x, pos.y, DEFAULT_RADIUS, {
				collisionFilter: BODY_FILTER,
				render: {
					fillStyle: "red",
					strokeStyle: "transparent"
				}
			});
			break;
		case "Diamond":
			body = Bodies.polygon(pos.x, pos.y, 5, DEFAULT_RADIUS, {
				collisionFilter: BODY_FILTER,
				render: {
					fillStyle: "lightblue",
					strokeStyle: "transparent"
				}
			});
			break;
		case "Rainbow":
			body = Bodies.polygon(pos.x, pos.y, 7, DEFAULT_RADIUS, {
				collisionFilter: BODY_FILTER,
				render: {
					fillStyle: "pink",
					strokeStyle: "transparent"
				}
			});
			Body.scale(body, 0, 1);
			break;
		default:
			console.log("Unknown gem of type " + gem.name);
			return false;
	}
	body.gem = gem;
	World.add(engine.world, body);
	updateMoney();
}

function showFloatingNumber(canvasX, canvasY, num){
	var rect = render.canvas.getBoundingClientRect();
	var x = canvasX + rect.left;
	var y = canvasY - rect.top;
    
	y += getRandomInt(0, ui.money.getBoundingClientRect().height);

    // Spawn it
    var float = document.createElement("span");
    float.className = "floatingnum";
    float.innerText = "+" + formatMoney(num).substring(1);
    float.style.position = "absolute";
    float.style.top = y;
    float.style.left = x;
    ui.vfx.appendChild(float);

    // Scale the font size
    var fontsize = { min: 10, max: 25 };
    var value = { min: Math.log(Gems[0].getValue()), max: Math.log(Gems[Gems.length-1].getValue()) };

    // Do d3-style proportional scaling
    var scaledsize = ((Math.log(num) - value.min) / (value.max - value.min) ) * (fontsize.max - fontsize.min) + fontsize.min;
    //console.log(scaledsize);
    float.style.fontSize = scaledsize;

    // Bold big numbers
    if(num >= 1e6)
    	float.style.color = "green";
    if (num >= 1e3)
    	float.style.fontWeight = "bold";
   	else
   		float.style.color = "gray";
    
   

    // Animate it
	var FLOAT_DIST = 100;
	var ANIM_DURATION = 1000; // should match the CSS value

    setTimeout(function(){
	    float.style.top = y - FLOAT_DIST * getRandomFloat(0.8, 1.2);
	    float.style.opacity = 0;
	}, 1);

	setTimeout(function(){
	    ui.vfx.removeChild(float);
	}, ANIM_DURATION);
    
}

var lastTime = 0;
Events.on(engine, 'tick', function(event) {
	// Remove gems
	world.bodies.forEach(function(body){
		if(body.gem !== undefined){
			if(body.position.y > render.canvas.height && body.position.x <= render.canvas.width){
				//console.log("gem sold at "+body.position.x+","+body.position.y);
				Composite.remove(world, body);
				showFloatingNumber(body.position.x, body.position.y, body.gem.getValue());
				sellGem(body.gem);
			} else if(body.position.y < 0) {
				Composite.remove(world, body);
				Stats.wasted++;
				checkAll(Achievements.wasted);
				updateMoney();
			}
		}
	});

	// Spawn gems
	var delta = (event.timestamp - lastTime) / 1000;
	lastTime = event.timestamp;
	if(delta < BackgroundMode.threshhold)
		genGems(delta);
	else
		console.warn("Dropped frames, delta = " + delta);

	// Auto drop
	if(auto_drop.rate > 0){
		auto_drop.timer -= delta;
		if(auto_drop.timer <= 0){
			if(auto_drop.open){
				closeDrop();
				auto_drop.open = false;
				auto_drop.timer = auto_drop.rate;
			} else {
				openDrop();
				auto_drop.open = true;
				auto_drop.timer = auto_drop.getOpenDuration();
			}
		}	
	}

	// Save game
	if(Settings.enable_save)
		saveGame();
});

function getSpawnRect(){
	return { x1: Inventory.wall_radius, y1: 0, x2: render.canvas.width, y2: 50 };
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max){
	return Math.random() * (max - min) + min;
}

function genGems(delta){
	//var toSpawn = genGems_deterministic(delta) = genGems_probabilistic(delta);
	var toSpawn = genGems_deterministic(delta);
	toSpawn.forEach(function(g){
		var spawnRect = getSpawnRect();
		var pos = {
			x: getRandomInt(spawnRect.x1, spawnRect.x2),
			y: getRandomInt(spawnRect.y1, spawnRect.y2)
		};
		//console.log(pos);
		Stats.factory_gems++;
		checkAll(Achievements.gems);
		spawnGem(pos, g);
	});
}

function openDrop(){
	Inventory.ground.collisionFilter = BG_FILTER;
	Inventory.ground.render.fillStyle = "#D3D3D3";
	Inventory.ground.render.strokeStyle = "#D3D3D3"
}

function closeDrop(){
	Inventory.ground.collisionFilter = BODY_FILTER;
	Inventory.ground.render.fillStyle = "gray";
	Inventory.ground.render.strokeStyle = "gray";
}

// Drop
ui.drop.onmousedown = function(){
	openDrop();
}
ui.drop.onmouseup = function(){
	closeDrop();
}

var BackgroundMode = {
	gem_radius: 20,
	interval: 16,
	threshhold: 250,
	lastTime: undefined,
	update: function() {
		var now = new Date().getTime();
		if(lastTime === undefined)
			return this.lastTime = now;
		var delta = now - this.lastTime;
		this.lastTime = now;

		if(delta >= this.threshhold) {
			console.log("doing background sim update");
			BackgroundMode.simulate(delta);
		} else {
			// do nothing; physics loop is running
			//console.log("doing normal update");
		}
	},
	timeout: null,//setInterval(function(){ BackgroundMode.update(); }, this.interval),
	simulate: function(delta){
		var engine_delta = 16.66;
		var iterations = delta / engine_delta;
		console.log(delta + "ms passed: updating engine x"+iterations);
		if(iterations >= 61){
			console.warn("Too many iterations to simulate; capping at 60");
			iterations = 60;
		}
		for(var i = 0; i < iterations; i++){
			Engine.update(engine);
		}
		// var a = world.gravity.y * world.gravity.scale;
		// var t = delta;
		// var v_i = 0;
		// var delta_x_max = 0.5 * a * Math.pow(t, 2) + v_i * t;
		// var timesteps = delta_x_max / (this.gem_radius * 2);
		// var new_delta = delta / timesteps;
		// console.log(delta_x_max + " " + timesteps);

		// // Snap all gems to grid
		// for(var i = 0; i < timesteps; i++){
		// 	// Spawn new ones
		// 	// Open dropgate if necessary
		// 	// Move all of them
		// 	// Sell bottom ones
		// }
	}
};

function debug(){
	// body = Bodies.circle(100, 10, 20, {
	// 	collisionFilter: BODY_FILTER,
	// 	render: {
	// 		fillStyle: "white",
	// 		strokeStyle: "grey"
	// 	}
	// });
	// body.gem = gems[0];
	// //World.add(engine.world, body);
	// for(var i = 0; i < 60 * 10; i++){
	// 	Engine.update(engine, 1000 / 60);
	// }
	// engine.update(10);
}

world.gravity.y = 0;