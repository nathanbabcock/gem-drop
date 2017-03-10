// Game globals
var money = 0;

// UI refs
var ui = {
	drop: document.getElementById("drop"),
	money: document.getElementById("money")
};

// Game data
gems = [
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

clickPowers = [
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

factories = [
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

function updateFactory(factory){
	//factory.ui.name.innerText = 
	factory.ui.rate.innerText = factory.getRate() + " per second";
	factory.ui.price.innerText = formatMoney(factory.getPrice());
	factory.ui.owned.innerText = factory.owned + " owned";
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


function init(){
	updateMoney();

	// Click powers
	var clickPowersPanel = document.getElementById("click_powers");
	for(var i = 0; i < clickPowers.length; i++)
		clickPowersPanel.appendChild(getClickPowerHMTL(clickPowers[i]));

	// Factories
	var factoriesPanel = document.getElementById("factories");
	for(var i = 0; i < factories.length; i++)
		factoriesPanel.appendChild(getFactoryHTML(factories[i]));
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

function updateMoney(){
	ui.money.innerText = formatMoney();
}

function sellGem(gem){
	money += gem.getPrice();
	updateMoney();
}

function cheat(){
	money+=100;
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