// CONFIG
var baserate = 1;
var ticks_per_second = 100;
var bar_maxheight = 100;

var number = 0;
var lastTime = null;
//var time = 0;
var generators = [
	{
		name: "Generator A",
		//baseCost: 10,
		owned: 0,
		getCost: function() { return Math.floor(10 * Math.pow(1.3, this.owned)); },
		getRate: function() { return 1; },
		getTotalRate: function() { return this.getRate() * this.owned;}
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

function init() {
	// Construct generators HTML
	for(var i = 0; i < generators.length; i++)
		document.getElementById("generators").innerHTML += getGeneratorHTML(i);

	setInterval(update, 1000 / ticks_per_second);
	// for(var i = 0; i < generators.length; i++)
	// 	updateGenerator(i);
}

function getGeneratorHTML(id){
	return `
		<div class="generator_container">
			<div class="generator">
				<strong class="generator_title" id="generator_`+id+`_name"></strong>
				<br>Costs <span id="generator_`+id+`_cost"></span>
				<br><span id="generator_`+id+`_owned"></span> owned
				<br>+<span id="generator_`+id+`_rate"></span>/s
				<br><button id="generator_`+id+`_button" onclick="buygenerator(`+id+`)">Buy</button>
			</div>
			<div class="bar" id="generator_`+id+`_bar"></div>
		</div>`;
}

function update(){
	var interval = getInterval;
	number += getInterval() * getRate();

	document.getElementById("number").innerHTML = formatNumber(number);
	document.getElementById("rate").innerHTML = getRate();
	document.getElementById("perclick").innerHTML = getPerClick();


	for(var i = 0; i < generators.length; i++)
		updateGenerator(i);
}

////

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

function updateGenerator(id){
	var generator = generators[id];

	// Text info
	document.getElementById("generator_"+id+"_name").innerHTML = generator.name;
	document.getElementById("generator_"+id+"_cost").innerHTML = generator.getCost();
	document.getElementById("generator_"+id+"_rate").innerHTML = generator.getRate();
	document.getElementById("generator_"+id+"_owned").innerHTML = generator.owned;
	document.getElementById("generator_"+id+"_owned").innerHTML = generator.owned;

	// Bar
	var percent = (generator.getTotalRate() / getRate());
	var bar = document.getElementById("generator_"+id+"_bar")
	bar.style.height = percent * bar_maxheight;
	bar.innerHTML = Math.round(percent * 100) + "%";
	if(percent <= 0.05)
		bar.style.color = "black";
	else
		bar.style.color = "white";


	// Enabled/disabled
	if(generator.getCost() > number){
		document.getElementById("generator_"+id+"_cost").style.color="red";
		document.getElementById("generator_"+id+"_button").disabled = true;
	}
	else {
		document.getElementById("generator_"+id+"_cost").style.color="green";
		document.getElementById("generator_"+id+"_button").disabled = false;
	}
}

function buygenerator(id){
	var generator = generators[id];
	number -= generator.getCost();
	generator.owned++;
	//updateGenerator(id);
}

function getgenerator(name){
	for(var i = 0; i < generators.length; i++)
		if(generators[i].name === name)
			return generators[i];
}

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