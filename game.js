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

//////////////

var auto_drop = {
	open:false,
	timer:0,
	getOpenDuration:function(){
		return 2;
	},
	getRate:function(){
		if(Upgrades[0].owned)
			return Upgrades[0].rate;
		return -1;
	}
};

function getClickPowerHMTL(gem){
/*	<div class="gem_click_power popup_container">
		<div class="popup_anchor">Quartz</span>
		<div class="popup">
			<strong class="name">Quartz</strong>
			<div class="rate">+1 per click</div>
			<div class="price">$1 each</div>
		</div>
	</div>*/
	var clickpower = gem.clickpower;

	var refs = clickpower.ui = {};
	refs.container = document.createElement("div");
	refs.container.className = "gem_click_power popup_container";

	// Anchor
	refs.anchor = document.createElement("div");
	refs.anchor.className = "popup_anchor";
	refs.anchor.innerText = gem.name;
	refs.container.appendChild(refs.anchor);

	// Popup
	refs.popup = document.createElement("div");
	refs.popup.className = "popup";
	refs.container.appendChild(refs.popup);

	// Name
	refs.name = document.createElement("strong");
	refs.name.className = "name";
	refs.name.innerText = gem.name;
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
	refs.anchor.onclick = function() { buyClickPower(gem); };

	updateClickPower(gem);
	return refs.container;
}

function getFactoryHTML(gem){
/*	<div class="factory popup_container">
		<div class="popup_anchor">Quartz</span>
		<div class="popup">
			<strong class="name">Quartz Factory</strong>
			<div class="rate">+1 per second</div>
			<div class="price">Costs $18</div>
			<div class="owned">0 owned</div>
		</div>
	</div>*/

	var factory = gem.factory;

	var refs = factory.ui = {};
	refs.container = document.createElement("div");
	refs.container.className = "factory popup_container";

	// Anchor
	refs.anchor = document.createElement("div");
	refs.anchor.className = "popup_anchor";
	refs.anchor.innerText = gem.name + " Factory";
	refs.container.appendChild(refs.anchor);

	// Popup
	refs.popup = document.createElement("div");
	refs.popup.className = "popup";
	refs.container.appendChild(refs.popup);

	// Name
	refs.name = document.createElement("strong");
	refs.name.className = "name";
	refs.name.innerText = gem.name + " Factory";
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
	refs.anchor.onclick = function() { buyFactory(gem); };

	updateFactory(gem);
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

function updateClickPower(gem){
	//factory.ui.name.innerText = 
	var clickpower = gem.clickpower;
	clickpower.ui.rate.innerText = "+" + clickpower.getRate() + " per click";
	clickpower.ui.price.innerText = formatMoney(gem.getValue()) + " each";
	if(!clickpower.owned)
		clickpower.ui.costs.innerText = "Costs " + formatMoney(clickpower.getCost());
	else
		clickpower.ui.costs.innerText = "";
}

function updateFactory(gem){
	//factory.ui.name.innerText = 
	var factory = gem.factory;
	factory.ui.rate.innerText = factory.getRate() + " per second";
	factory.ui.price.innerText = formatMoney(factory.getCost());
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

	// Clickpowers and Factories
	Gems.forEach(function(gem){
		ui.click_powers.appendChild(getClickPowerHMTL(gem));
		ui.factories.appendChild(getFactoryHTML(gem));
	})

	// Upgrades
	Upgrades.forEach(function(upgrade){
		ui.upgrades.appendChild(getUpgradeHTML(upgrade));
	});
}

// function formatRate(num){
// 	return num + " per second";
// }

function buyFactory(gem){
	var factory = gem.factory;
	if(factory.getCost() > money)
		return false;
	money -= factory.getCost();
	factory.owned++;
	updateFactory(gem);
	updateMoney();
}

function buyClickPower(gem){
	var clickpower = gem.clickpower;
	if(clickpower.owned || clickpower.getCost() > money)
		return false;
	money -= clickpower.getCost();
	clickpower.owned++;
	updateClickPower(gem);
	updateMoney();
}

function buyUpgrade(upgrade){
	if(upgrade.owned || upgrade.getPrice() > money)
		return false;
	money -= upgrade.getPrice();
	upgrade.owned = true;
	updateUpgrade(upgrade);
	updateMoney();
	if(upgrade.onPurchase !== undefined)
		upgrade.onPurchase();
}

function formatMoney(num = money){
	var thirdpower = 0;
	while(num >= 1000){
		num /= 1000;
		thirdpower++;
	}

	var suffix = ["", "k", "M", "B", "T", "Q"];

	var formatted ="";
	if(thirdpower === 0 || num >= 100)
		formatted = Math.floor(num);
	else if (num >= 10) {
		formatted = Math.floor(num * 10) / 10;
	} else {
		formatted = Math.floor(num * 100) / 100;
	}
	formatted += suffix[thirdpower];
	return "$" + formatted;
}

function doClick(){
	var bestGem = null;
	Gems.forEach(function(gem){
		if(gem.clickpower.owned && (bestGem === null || gem.getValue() > bestGem.getValue()))
			bestGem = gem;
	});
	var gemsToMake = [];
	for(var i = 0; i < bestGem.clickpower.getRate(); i++)
		gemsToMake.push(bestGem);
	return gemsToMake;
}

// TODO this gets immediately overwritten when physics.js loads
var Inventory = {
	getValue: function() {
		return 0;
	}
}

function updateMoney(){
	ui.actual_money.innerText = formatMoney();
	ui.predicted_money.innerText = " (+" + formatMoney(Inventory.getValue()).substring(1) + ")";
}

function sellGem(gem){
	money += gem.getValue();
	updateMoney();
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
	Gems.forEach(function(gem){
		var f = gem.factory;
		var rate = f.getRate() * f.owned;
		if(rate <= 0)
			return false;
		//console.log("Rate = " + rate);
		if(f.cooldown === undefined)
			f.cooldown = 0;
		else
			f.cooldown -= delta;

		while(f.cooldown <= 0){
			toSpawn[toSpawn.length] = gem;
			f.cooldown += (1 / rate);
		}
	});
	return toSpawn;
}


function genGems_probabilistic(delta){
	var toSpawn = [];
	Gems.forEach(function(gem){
		var f = gem.factory;
		var chance = delta * f.getRate() * f.owned;
		while(chance > 1){
			toSpawn[toSpawn.length] = gem;
			chance--;
		}
		if(Math.random() < chance)
			toSpawn[toSpawn.length] = gem;
	});
	return toSpawn;
}

function cheat(){
	money += 1000000000;
	// money+=100;
	updateMoney();
	//Gems[1].factory.owned = 1000;
	updateFactory(Gems[1]);
}

init();