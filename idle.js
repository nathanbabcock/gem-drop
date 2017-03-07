// CONFIG
var baserate = 1;
var ticks_per_second = 100;
var bar_maxheight = 100;
var anim_duration = 1000;

var number = 0;
var lastTime = null;
//var time = 0;
var generators = [
	{
		name: "Generator A",
		//baseCost: 10,
		owned: 0,
		getCost: function(owned = this.owned) { return Math.floor(10 * Math.pow(1.3, owned)); },
		getRate: function() { return 1; },
		getTotalRate: function(owned = this.owned) { return this.getRate(owned) * owned;}
	},
	{
		name: "Generator B",
		//baseCost: 10,
		owned: 0,
		getCost: function() { return Math.floor(100 * Math.pow(1.3, this.owned)); },
		getRate: function() { return 10; },
		getTotalRate: function() { return this.getRate() * this.owned;}
	},
	{
		name: "Generator C",
		//baseCost: 10,
		owned: 0,
		getCost: function() { return Math.floor(1000 * Math.pow(1.3, this.owned)); },
		getRate: function() { return 100; },
		getTotalRate: function() { return this.getRate() * this.owned;}
	},
	{
		name: "Generator D",
		//baseCost: 10,
		owned: 0,
		getCost: function() { return Math.floor(10000 * Math.pow(1.3, this.owned)); },
		getRate: function() { return 1000; },
		getTotalRate: function() { return this.getRate() * this.owned;}
	},
];

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

	// Bar
	refs.preview = document.createElement("div");
	refs.preview.className = "preview";
	refs.container.appendChild(refs.preview);

	return refs;
}

function init() {
	var genView = document.getElementById("generators");

	// Construct generators HTML
	for(var i = 0; i < generators.length; i++){
		var refs = getGeneratorHTML(generators[i]);
		genView.appendChild(refs.container);
		generators[i].gui = refs;
	}

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
}

////

function previewPurchase(gen){
	var preview = gen.gui.preview;
	preview.style.backgroundColor="green";

	preview.innerText="+x%";
	preview.style.visibility = "visible";
}

function clearPreview(gen){
	var preview = gen.gui.preview;
	preview.style.backgroundColor="red";
	preview.innerText="-x%";
	preview.style.visibility = "hidden";
}

var perClick = 10;
function getPerClick(){
	return perClick;
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

function buyGenerator(gen){
	number -= gen.getCost();
	gen.owned++;
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