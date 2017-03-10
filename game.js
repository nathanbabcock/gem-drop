// Game globals
var money = 0;

// UI refs
var ui = {
	click_powers: document.getElementById("click_powers"),
	factories: document.getElementById("factories"),
	upgrades: document.getElementById("upgrades"),
	drop: document.getElementById("drop"),
	actual_money: document.getElementById("actual_money"),
	predicted_money: document.getElementById("predicted_money"),
};

// Game data
var gems = [
	{
		name: "Quartz",
		basePrice: 1,
		getPrice: function() { return this.basePrice; }
	},
	{
		name: "Topaz",
		basePrice: 10,
		getPrice: function() { return this.basePrice; }
	}
];

var clickPowers = [
	{
		name: "Quartz",
		owned: true,
		gem: gems[0],
		baseRate: 1,
		getRate: function() { return this.baseRate; },
		basePrice: 0,
		getPrice: function() { return this.basePrice; }
	},
	{
		name: "Topaz",
		owned: false,
		gem: gems[1],
		baseRate: 1,
		getRate: function() { return this.baseRate; },
		basePrice: 120,
		getPrice: function() { return this.basePrice; }
	}
];

var factories = [
	{
		name: "Quartz Factory",
		description: "Generates 1 quartz per second",
		gem: gems[0],
		baseRate: 0.2,
		getRate: function(){ return this.baseRate; },
		basePrice: 18,
		getPrice: function(owned = this.owned) { return this.basePrice * Math.pow(1.3, owned); },
		owned: 0
	}, 
	{
		name: "Topaz Factory",
		description: "Generates 1 topaz per second",
		gem: gems[1],
		baseRate: 1,
		getRate: function(){ return this.baseRate; },
		basePrice: 500,
		getPrice: function(owned = this.owned) { return this.basePrice * Math.pow(1.3, owned); },
		owned: 0
	}, 
];

var UPGRADE_CATEGORY = {
	AUTO_DROP: 0
}

var upgrades = [
	{
		name: "Auto Drop",
		description: "Automatically drops gems every 30 seconds.",
		basePrice:10000,
		getPrice: function() { return this.basePrice; },
		category: UPGRADE_CATEGORY.AUTO_DROP,
		rate: 30,
		owned: false
	}
];

//////////////

var auto_drop = {
	open:false,
	timer:0,
	getOpenDuration:function(){
		return 3;
	},
	getRate:function(){
		if(upgrades[0].owned)
			return upgrades[0].rate;
		return -1;
	}
};

function getClickPowerHMTL(clickpower){
/*	<div class="gem_click_power popup_container">
		<div class="popup_anchor">Quartz</span>
		<div class="popup">
			<strong class="name">Quartz</strong>
			<div class="rate">+1 per click</div>
			<div class="price">$1 each</div>
		</div>
	</div>*/
	var refs = clickpower.ui = {};
	refs.container = document.createElement("div");
	refs.container.className = "gem_click_power popup_container";

	// Anchor
	refs.anchor = document.createElement("div");
	refs.anchor.className = "popup_anchor";
	refs.anchor.innerText = clickpower.name;
	refs.container.appendChild(refs.anchor);

	// Popup
	refs.popup = document.createElement("div");
	refs.popup.className = "popup";
	refs.container.appendChild(refs.popup);

	// Name
	refs.name = document.createElement("strong");
	refs.name.className = "name";
	refs.name.innerText = clickpower.name;
	refs.popup.appendChild(refs.name);

	// Rate
	refs.rate = document.createElement("div");
	refs.rate.className = "rate";
	// refs.rate.innerText = "+" + clickpower.getRate() + " per click";
	refs.popup.appendChild(refs.rate);

	// Price
	refs.price = document.createElement("div");
	refs.price.className = "price";
	// refs.price.innerText = "$" + clickpower.gem.getPrice() + " each";
	refs.popup.appendChild(refs.price);

	// Costs
	refs.costs = document.createElement("div");
	refs.costs.className = "costs";
	refs.popup.appendChild(refs.costs);

	// Onclick
	refs.anchor.onclick = function() { buyClickPower(clickpower); };

	updateClickPower(clickpower);
	return refs.container;
}

function getFactoryHTML(factory){
/*	<div class="factory popup_container">
		<div class="popup_anchor">Quartz</span>
		<div class="popup">
			<strong class="name">Quartz Factory</strong>
			<div class="rate">+1 per second</div>
			<div class="price">Costs $18</div>
			<div class="owned">0 owned</div>
		</div>
	</div>*/

	var refs = factory.ui = {};
	refs.container = document.createElement("div");
	refs.container.className = "factory popup_container";

	// Anchor
	refs.anchor = document.createElement("div");
	refs.anchor.className = "popup_anchor";
	refs.anchor.innerText = factory.name;
	refs.container.appendChild(refs.anchor);

	// Popup
	refs.popup = document.createElement("div");
	refs.popup.className = "popup";
	refs.container.appendChild(refs.popup);

	// Name
	refs.name = document.createElement("strong");
	refs.name.className = "name";
	refs.name.innerText = factory.name;
	refs.popup.appendChild(refs.name);

	// Rate
	refs.rate = document.createElement("div");
	refs.rate.className = "rate";
	refs.popup.appendChild(refs.rate);

	// Price
	refs.price = document.createElement("div");
	refs.price.className = "price";
	refs.popup.appendChild(refs.price);

	// Owned
	refs.owned = document.createElement("div");
	refs.owned.className = "owned";
	refs.popup.appendChild(refs.owned);

	// Onclick
	refs.anchor.onclick = function() { buyFactory(factory); };

	updateFactory(factory);
	return refs.container;
}

function getUpgradeHTML(upgrade){
/*	<div class="upgrade popup_container">
		<div class="popup_anchor">asdf</span>
		<div class="popup">
			<strong class="name">asdf</strong>
			<div class="description">blah blah blah</div>
			<div class="price">Costs $18</div>
		</div>
	</div>*/

	var refs = upgrade.ui = {};
	refs.container = document.createElement("div");
	refs.container.className = "upgrade popup_container";

	// Anchor
	refs.anchor = document.createElement("div");
	refs.anchor.className = "popup_anchor";
	refs.anchor.innerText = upgrade.name;
	refs.container.appendChild(refs.anchor);

	// Popup
	refs.popup = document.createElement("div");
	refs.popup.className = "popup";
	refs.container.appendChild(refs.popup);

	// Name
	refs.name = document.createElement("strong");
	refs.name.className = "name";
	refs.name.innerText = upgrade.name;
	refs.popup.appendChild(refs.name);

	// Description
	refs.description = document.createElement("div");
	refs.description.className = "description";
	refs.description.innerText = upgrade.description;
	refs.popup.appendChild(refs.description);

	// Price
	refs.costs = document.createElement("div");
	refs.costs.className = "costs";
	refs.popup.appendChild(refs.costs);

	// Onclick
	refs.anchor.onclick = function() { buyUpgrade(upgrade); };

	updateUpgrade(upgrade);
	return refs.container;
}

function updateClickPower(clickpower){
	//factory.ui.name.innerText = 
	clickpower.ui.rate.innerText = "+" + clickpower.getRate() + " per click";
	clickpower.ui.price.innerText = formatMoney(clickpower.gem.getPrice()) + " each";
	if(!clickpower.owned)
		clickpower.ui.costs.innerText = "Costs " + formatMoney(clickpower.getPrice());
	else
		clickpower.ui.costs.innerText = "";
}

function updateFactory(factory){
	//factory.ui.name.innerText = 
	factory.ui.rate.innerText = factory.getRate() + " per second";
	factory.ui.price.innerText = formatMoney(factory.getPrice());
	factory.ui.owned.innerText = factory.owned + " owned";
}

function updateUpgrade(upgrade){
	if(!upgrade.owned)
		upgrade.ui.costs.innerText = "Costs " + formatMoney(upgrade.getPrice());
	else
		upgrade.ui.costs.innerText = "";
}

function init(){
	updateMoney();

	// Click powers
	clickPowers.forEach(function(clickpower){
		ui.click_powers.appendChild(getClickPowerHMTL(clickpower));
	});

	// Factories
	factories.forEach(function(factory){
		ui.factories.appendChild(getFactoryHTML(factory));
	});

	// Upgrades
	upgrades.forEach(function(upgrade){
		ui.upgrades.appendChild(getUpgradeHTML(upgrade));
	});
}

// function formatRate(num){
// 	return num + " per second";
// }

function buyFactory(factory){
	if(factory.getPrice() > money)
		return false;
	money -= factory.getPrice();
	factory.owned++;
	updateFactory(factory);
	updateMoney();
}

function buyClickPower(clickPower){
	if(clickPower.owned || clickPower.getPrice() > money)
		return false;
	money -= clickPower.getPrice();
	clickPower.owned++;
	updateClickPower(clickPower);
	updateMoney();
}

function buyUpgrade(upgrade){
	if(upgrade.owned || upgrade.getPrice() > money)
		return false;
	money -= upgrade.getPrice();
	upgrade.owned = true;
	updateUpgrade(upgrade);
	updateMoney();
}

function formatMoney(num = money){
	return "$" + Math.floor(num);
}

function doClick(){
	var bestPower = null;
	for(var i = 0; i < clickPowers.length; i++)
		if(clickPowers[i].owned) bestPower = clickPowers[i];
	var gemsToMake = [];
	for(var i = 0; i < bestPower.getRate(); i++)
		gemsToMake[gemsToMake.length] = bestPower.gem;
	return gemsToMake;
	//gemsToMake[gemsToMake.length]
}

// TODO this gets immediatelly overwritten when physics.js loads
function getInventoryValue(){
	return 0;
}

function updateMoney(){
	ui.actual_money.innerText = formatMoney();
	ui.predicted_money.innerText = " (+" + formatMoney(getInventoryValue()).substring(1) + ")";
}

function sellGem(gem){
	money += gem.getPrice();
	updateMoney();
}

function cheat(){
	money += 1000000000;
	// money+=100;
	updateMoney();
	// factories[0].owned = 1000;
	// updateFactory(factories[0]);
}

function getTotalRate(){
	var rate = 0;
	for(var i = 0; i < factories.length; i++){
		var factory = factories[i];
		if(!factory.owned) continue;
		rate += factory.getRate() * factory.owned;
	}
	return rate;
}

function genGems_deterministic(delta){
	var toSpawn = [];
	factories.forEach(function(f){
		var rate = f.getRate() * f.owned;
		if(rate <= 0)
			return false;
		//console.log("Rate = " + rate);
		if(f.cooldown === undefined)
			f.cooldown = 0;
		else
			f.cooldown -= delta;

		while(f.cooldown <= 0){
			toSpawn[toSpawn.length] = f.gem;
			f.cooldown += (1 / rate);
		}
	});
	return toSpawn;
}


function genGems_probabilistic(delta){
	var toSpawn = [];
	factories.forEach(function(f){
		var chance = delta * f.getRate() * f.owned;
		while(chance > 1){
			toSpawn[toSpawn.length] = f.gem;
			chance--;
		}
		if(Math.random() < chance)
			toSpawn[toSpawn.length] = f.gem;
	});
	return toSpawn;
}

init();