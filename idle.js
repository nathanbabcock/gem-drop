// ENUM
var GENERATOR_PERCENT_BONUS = 0,
	CLICK_FLAT_BONUS = 1;

// CONFIG
var baserate = 1,
	basePerClick = 10,
	ticks_per_second = 100,
	bar_maxheight = 100,
	anim_duration = 1000;

// GLOBAL
var number = 0,
	lastTime = null;
//var time = 0;

// DATA
var generators = [
	{
		name: "Generator A",
		//baseCost: 10,
		owned: 0,
		getCost: function(owned = this.owned) { return Math.floor(10 * Math.pow(1.3, owned)); },
		getRate: function() { return 1 * getMultiplier(this); },
		getTotalRate: function(owned = this.owned) { return this.getRate(owned) * owned;}
	},
	{
		name: "Generator B",
		//baseCost: 10,
		owned: 0,
		getCost: function() { return Math.floor(100 * Math.pow(1.3, this.owned)); },
		getRate: function() { return 10 * getMultiplier(this); },
		getTotalRate: function() { return this.getRate() * this.owned;}
	},
	{
		name: "Generator C",
		//baseCost: 10,
		owned: 0,
		getCost: function() { return Math.floor(1000 * Math.pow(1.3, this.owned)); },
		getRate: function() { return 100 * getMultiplier(this); },
		getTotalRate: function() { return this.getRate() * this.owned;}
	},
	{
		name: "Generator D",
		//baseCost: 10,
		owned: 0,
		getCost: function() { return Math.floor(10000 * Math.pow(1.3, this.owned)); },
		getRate: function() { return 1000 * getMultiplier(this); },
		getTotalRate: function() { return this.getRate() * this.owned;}
	},
];

var upgrades = [
	{
		name: "Upgrade A",
		icon: null,
		owned: false,
		getCost: function() { return 100; },
		type: GENERATOR_PERCENT_BONUS,
		generator: generators[0],
		multiplier: 2.0,
		description: "+100% production to Generator A"
	},
	{
		name: "Click Rate I",
		icon: null,
		owned: false,
		getCost: function() { return 100; },
		type: CLICK_FLAT_BONUS,
		bonus: 10,
		description: "+10 per click"
	}
]


function getMultiplier(generator){
	var mult = 1.0;
	for(var i = 0; i < upgrades.length; i++)
		if(upgrades[i].type === GENERATOR_PERCENT_BONUS && upgrades[i].owned && upgrades[i].generator === generator)
			mult *= upgrades[i].multiplier;
	return mult;
}

function getGeneratorHTML(gen){
	// TODO I wish I knew a less cancerous way of constructing DOM elements

	// var str = `
	// 	<div class="generator_container">
	// 		<div class="generator">
	// 			<strong class="name"></strong>
	// 			<br>Costs <span class="cost"></span>
	// 			<br><span class="owned"></span> owned
	// 			<br>+<span class="rate"></span>/s
	// 			<br><button class="button">Buy</button>
	// 		</div>
	// 		<div class="bar"></div>
	// 		<div class="preview"></div>
	// 	</div>`;
	var refs = {};

	// Container
	refs.container = document.createElement("div");
	refs.container.className = "generator_container";

	// Generator
	refs.generator = document.createElement("div");
	refs.generator.className = "generator";

	// Name
	refs.name = document.createElement("strong");
	refs.generator.appendChild(refs.name);

	// Cost
	refs.generator.appendChild(document.createElement("br"));
	refs.generator.appendChild(document.createTextNode("Costs "));
	refs.cost = document.createElement("span");
	refs.generator.appendChild(refs.cost);

	// Owned
	refs.generator.appendChild(document.createElement("br"));
	refs.owned = document.createElement("span");
	refs.generator.appendChild(refs.owned);
	refs.generator.appendChild(document.createTextNode(" owned"));

	// Rate
	refs.generator.appendChild(document.createElement("br"));
	refs.generator.appendChild(document.createTextNode("+"));
	refs.rate = document.createElement("span");
	refs.generator.appendChild(refs.rate);
	refs.generator.appendChild(document.createTextNode("/s"));

	// Button
	refs.generator.appendChild(document.createElement("br"));
	refs.button = document.createElement("button");
	refs.button.innerText = "Buy";
	refs.button.onclick = function() { buyGenerator(gen); };
	// refs.button.onmouseover = function() { previewPurchase(gen); };
	// refs.button.onmouseout = function() { clearPreview(gen); };
	// refs.button.ondeactivate = function() { clearPreview(gen); };
	refs.generator.appendChild(refs.button);

	refs.container.appendChild(refs.generator);

	// Bar
	refs.bar = document.createElement("div");
	refs.bar.className = "bar";
	refs.container.appendChild(refs.bar);

	// Preview
	refs.preview = document.createElement("div");
	refs.preview.className = "preview";
	refs.container.appendChild(refs.preview);

	return refs;
}

function getUpgradeHTML(upgrade){
	// <div class="upgrade">
	// 	<strong>Upgrade A</strong>
	// 	<br><span>+100% production from Generator A</span>
	// 	<br>Costs <span>100</span>
	// 	<br><button>Buy</button>
	// </div>
	var refs = {};
	refs.container = document.createElement("div");
	refs.container.className = "upgrade";

	// Name
	refs.name = document.createElement("strong");
	refs.name.innerText = upgrade.name;
	refs.container.appendChild(refs.name);

	// Description
	refs.container.appendChild(document.createElement("br"));
	refs.description = document.createElement("span");
	refs.description.innerText = upgrade.description;
	refs.container.appendChild(refs.description);

	// Costs
	refs.container.appendChild(document.createElement("br"));
	refs.container.appendChild(document.createTextNode("Costs "));
	refs.cost = document.createElement("span");
	refs.cost.innerHTML = upgrade.getCost();
	refs.container.appendChild(refs.cost);

	// Button
	refs.container.appendChild(document.createElement("br"));
	refs.button = document.createElement("button");
	refs.button.innerText = "Buy";
	refs.button.onclick = function() { buyUpgrade(upgrade); };
	refs.container.appendChild(refs.button);

	return refs;
}

function init() {
	// Generators
	var genView = document.getElementById("generators");
	for(var i = 0; i < generators.length; i++){
		var refs = getGeneratorHTML(generators[i]);
		genView.appendChild(refs.container);
		generators[i].gui = refs;
	}

	// Upgrades
	var upgradeView = document.getElementById("upgrades");
	for(var i = 0; i < upgrades.length; i++){
		var refs = getUpgradeHTML(upgrades[i]);
		upgradeView.appendChild(refs.container);
		upgrades[i].gui = refs;
	}

	// Game loop
	setInterval(update, 1000 / ticks_per_second);
	// for(var i = 0; i < generators.length; i++)
	// 	updateGenerator(i);
}

function update(){
	var interval = getInterval;
	number += getInterval() * getRate();

	document.getElementById("number").innerHTML = formatNumber(number);
	document.getElementById("rate").innerHTML = getRate();
	document.getElementById("perclick").innerHTML = getPerClick();

	for(var i = 0; i < generators.length; i++)
		updateGenerator(generators[i]);

	for(var i = 0; i < upgrades.length; i++)
		updateUpgrade(upgrades[i]);
}

////

function previewPurchase(gen){
	var preview = gen.gui.preview;
	preview.style.backgroundColor="green";

	preview.innerText="+x%";
	preview.style.display = "block";
}

function clearPreview(gen){
	var preview = gen.gui.preview;
	preview.style.backgroundColor="red";
	preview.innerText="-x%";
	preview.style.display = "none";
}

function getPerClick(){
	var mult = 1.0;
	var bonus = 0.0;
	for(var i = 0; i < upgrades.length; i++)
		if(upgrades[i].type === CLICK_FLAT_BONUS && upgrades[i].owned)
			bonus += upgrades[i].bonus;
	return (basePerClick + bonus) * mult;
}

function getInterval(){
	var interval;
	var now = new Date().getTime();
	if(lastTime === null)
		interval = 0;
	else
		interval = now - lastTime;
	lastTime = now;
	return interval / 1000;
}

function doClick(){
	console.log("click");
	number += getPerClick();
}

function updateGenerator(gen){
	//console.log("updating generator with name "+gen.name);

	// Text info
	gen.gui.name.innerHTML = gen.name;
	gen.gui.cost.innerHTML = gen.getCost();
	gen.gui.rate.innerHTML = gen.getRate();
	gen.gui.owned.innerHTML = gen.owned;
	gen.gui.owned.innerHTML = gen.owned;

	// Bar
	var percent = (gen.getTotalRate() / getRate());
	// var bar = d3.select("#generator_"+id+"_bar");//document.getElementById("generator_"+id+"_bar")
	// bar.style("height", percent * bar_maxheight)
	// 	.text(Math.round(percent * 100) + "%");

	var bar = gen.gui.bar;//document.getElementById("generator_"+id+"_bar");//document.getElementById("generator_"+id+"_bar")
	bar.style.height = percent * bar_maxheight;
	bar.innerText=Math.round(percent * 100) + "%";


	//bar.style.height = percent * bar_maxheight;
	//bar.innerHTML = Math.round(percent * 100) + "%";
	if(percent <= 0.05)
		bar.style.color = "black";
	else
		bar.style.color = "white";

	// Enabled/disabled
	if(gen.getCost() > number){
		gen.gui.cost.style.color = "red";
		gen.gui.button.disabled = true;
		clearPreview(gen);
	}
	else {
		gen.gui.cost.style.color = "green";
		gen.gui.button.disabled = false;
	}
}

function updateUpgrade(upgrade){
	if(upgrade.owned)
		upgrade.gui.container.style.display = "none";
	else if(upgrade.getCost() > number){
		upgrade.gui.cost.style.color = "red";
		upgrade.gui.button.disabled = true;
	}
	else {
		upgrade.gui.cost.style.color = "green";
		upgrade.gui.button.disabled = false;
	}
}

function buyGenerator(gen){
	number -= gen.getCost();
	gen.owned++;
	//updateGenerator(id);
}

function buyUpgrade(upgrade){
	number -= upgrade.getCost();
	upgrade.owned = true;
	//updateGenerator(id);
}

// function getgenerator(name){
// 	for(var i = 0; i < generators.length; i++)
// 		if(generators[i].name === name)
// 			return generators[i];
// }

function getRate(){
	var rate = baserate;
	for(var i = 0; i < generators.length; i++)
		rate += generators[i].getTotalRate();
	return rate;
}

function formatNumber(num) {
	// if(num > 1000000){
	// 	return Math.floor(num/1000) + "k"
	// }
	//return Math.round(num * 100) / 100;//num;
	return Math.floor(num);
}

//document.onload = function(){ alert("asdf"); };//init;