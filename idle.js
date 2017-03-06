// CONFIG
var baserate = 1;
var ticks_per_second = 100;

var number = 0;
var time = 0;
var upgrades = [
	{
		name: "Upgrade A",
		//baseCost: 10,
		owned: 0,
		getCost: function() { return Math.floor(10 * Math.pow(1.3, this.owned)); },
		getRate: function() { return 1; },
		getTotalRate: function() { return this.getRate() * this.owned;}
	}
];

function init() {
	setInterval(update, 1000 / ticks_per_second);
	// for(var i = 0; i < upgrades.length; i++)
	// 	updateUpgrade(i);
}

function update(){
	time += 0.01;
	number += (getRate()/ticks_per_second);
	document.getElementById("number").innerHTML = formatNumber(number);
	document.getElementById("rate").innerHTML = getRate();
	for(var i = 0; i < upgrades.length; i++)
		updateUpgrade(i);
}

////

function cheat(){
	number += 10;
}

function updateUpgrade(id){
	var upgrade = upgrades[id];
	document.getElementById("upgrade_"+id+"_cost").innerHTML = upgrade.getCost();
	document.getElementById("upgrade_"+id+"_rate").innerHTML = upgrade.getRate();
	document.getElementById("upgrade_"+id+"_owned").innerHTML = upgrade.owned;
	if(upgrade.getCost() > number){
		document.getElementById("upgrade_"+id+"_cost").style.color="red";
		document.getElementById("upgrade_"+id+"_button").disabled = true;
	}
	else {
		document.getElementById("upgrade_"+id+"_cost").style.color="green";
		document.getElementById("upgrade_"+id+"_button").disabled = false;
	}
}

function buyUpgrade(id){
	var upgrade = upgrades[id];
	number -= upgrade.getCost();
	upgrade.owned++;
	//updateUpgrade(id);
}

function getUpgrade(name){
	for(var i = 0; i < upgrades.length; i++)
		if(upgrades[i].name === name)
			return upgrades[i];
}

function getRate(){
	var rate = baserate;
	for(var i = 0; i < upgrades.length; i++)
		rate += upgrades[i].getTotalRate();
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