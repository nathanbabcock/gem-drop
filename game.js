// Game globals
var money = 0;

// UI refs
var ui = {
	click_powers: document.getElementById("click_powers"),
	factories: document.getElementById("factories"),
	upgrades: document.getElementById("upgrades"),
	drop: document.getElementById("drop"),
	money: document.getElementById("money"),
	actual_money: document.getElementById("actual_money"),
	predicted_money: document.getElementById("predicted_money"),
	vfx: document.getElementById("vfx"),
	buy: document.getElementById("buy"),
	sell: document.getElementById("sell"),
	buy_1: document.getElementById("buy_1"),
	buy_10: document.getElementById("buy_10"),
	buy_100: document.getElementById("buy_100"),
	buy_max: document.getElementById("buy_max")
}; 

var BuyMode = {
	BUY:0,
	SELL:1,
	mode: 0,
	quantity: 1
};

//////////////

var auto_drop = {
	open:false,
	timer:0,
	rate:-1,
	getOpenDuration:function(){
		return 2;
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

	if(!clickpower.owned && clickpower.getCost() > money)
		clickpower.ui.anchor.className = "popup_anchor disabled";
	else
		clickpower.ui.anchor.className = "popup_anchor";
}

function updateFactory(gem){
	//factory.ui.name.innerText = 
	var factory = gem.factory;
	factory.ui.rate.innerText = factory.getRate() + " per second";
	var purchase = calculatePurchase(gem);
	factory.ui.price.innerText = (BuyMode.mode === BuyMode.BUY ? "Buy " : "Sell ") + purchase.quantity +" for " + formatMoney(purchase.cost);
	factory.ui.owned.innerText = factory.owned + " owned";

	if(BuyMode.mode == BuyMode.BUY){
		if(purchase.cost > money || purchase.quantity === 0)
			factory.ui.anchor.className = "popup_anchor disabled";
		else
			factory.ui.anchor.className = "popup_anchor";
	} else {
		if(purchase.quantity === 0)
			factory.ui.anchor.className = "popup_anchor disabled";
		else
			factory.ui.anchor.className = "popup_anchor";
	}
}


function updateUpgrade(upgrade){
	if(!upgrade.owned)
		upgrade.ui.costs.innerText = "Costs " + formatMoney(upgrade.getCost());
	else
		upgrade.ui.costs.innerText = "";

	if(!upgrade.owned && upgrade.getCost() > money)
		upgrade.ui.anchor.className = "popup_anchor disabled";
	else
		upgrade.ui.anchor.className = "popup_anchor";
}


function log(b, n) {
    return Math.log(n) / Math.log(b);
}

// Calculates the cost of a factory purchase for the given gem according to BUY MODE
function calculatePurchase(gem){
	var r = gem.factory.getCostFactor(),
		b = gem.factory.baseCost,
		k = gem.factory.owned,
		c = money,
		n = 0;
	if(BuyMode.mode === BuyMode.BUY){
		var max_quantity = Math.floor(log(r, Math.pow(r, k) - c * ((1 - r) / b)) - k);
		if(BuyMode.quantity === "max")
			n = Math.max(max_quantity, 1);
		else
			n = BuyMode.quantity;
	} else {
		if(BuyMode.quantity === "max")
			n = gem.factory.owned;
		else
			n = Math.min(gem.factory.owned, BuyMode.quantity);
		k = gem.factory.owned - n;
	}
	var cost = b * ((Math.pow(r, k) - Math.pow(r, k + n))/(1 - r));
	return { cost: cost, quantity: n };
}

function init(){
	// Clickpowers and Factories
	Gems.forEach(function(gem){
		ui.click_powers.appendChild(getClickPowerHMTL(gem));
		ui.factories.appendChild(getFactoryHTML(gem));
	})

	// Upgrades
	Upgrades.forEach(function(upgrade){
		ui.upgrades.appendChild(getUpgradeHTML(upgrade));
	});

	// Buy Mode
	ui.buy.onclick = function() { setBuyMode(BuyMode.BUY, ui.buy); };
	ui.sell.onclick = function() { setBuyMode(BuyMode.SELL, ui.sell); };
	ui.buy_1.onclick = function() { setBuyQuantity(1, ui.buy_1); };
	ui.buy_10.onclick = function() { setBuyQuantity(10, ui.buy_10); };
	ui.buy_100.onclick = function() { setBuyQuantity(100, ui.buy_100); };
	ui.buy_max.onclick = function() { setBuyQuantity("max", ui.buy_max); };

	updateMoney();
}

function setBuyMode(mode, elem){
	BuyMode.mode = mode;
	[ui.buy, ui.sell].forEach(function(elem){
		elem.className = "";
	});
	elem.className = "active";
	Gems.forEach(function(gem){	updateFactory(gem); });
	// if(mode === BuyMode.BUY)
	// 	ui.buy.className = "active";
	// else
	// 	ui.sell.className = "active";
}

function setBuyQuantity(quant, elem){
	BuyMode.quantity = quant;
	[ui.buy_1, ui.buy_10, ui.buy_100, ui.buy_max].forEach(function(elem){
		elem.className = "";
	});
	elem.className = "active";
	Gems.forEach(function(gem){ updateFactory(gem); });
	// switch(quant){
	// 	case 1:
	// 		ui.buy_1.className = "active";
	// }
}

// function formatRate(num){
// 	return num + " per second";
// }

function buyFactory(gem){
	var factory = gem.factory;
	var purchase = calculatePurchase(gem);

	if(BuyMode.mode === BuyMode.BUY){
		if(purchase.cost > money)
			return false;
		factory.owned += purchase.quantity;
		updateMoney(-purchase.cost);
		//updateFactory(gem);
	} else {
		factory.owned -= purchase.quantity;
		updateMoney(purchase.cost);
	}
}

function buyClickPower(gem){
	var clickpower = gem.clickpower;
	if(clickpower.owned || clickpower.getCost() > money)
		return false;
	updateMoney(-clickpower.getCost());
	clickpower.owned++;
	updateClickPower(gem);
}

function buyUpgrade(upgrade){
	if(upgrade.owned || upgrade.getCost() > money)
		return false;
	updateMoney(-upgrade.getCost());
	upgrade.owned = true;
	updateUpgrade(upgrade);
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

function updateMoney(amount = 0){
	money += amount;
	ui.actual_money.innerText = formatMoney();
	ui.predicted_money.innerText = " (+" + formatMoney(Inventory.getValue()).substring(1) + ")";
	Gems.forEach(function(gem){
		if(!gem.clickpower.owned)
			updateClickPower(gem);
		updateFactory(gem);
	});
	Upgrades.forEach(function(upgrade){
		if(!upgrade.owned)
			updateUpgrade(upgrade);
	});
	return money;
}

function sellGem(gem){
	updateMoney(gem.getValue());
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
	updateMoney(10000);
	// money += 1000000000;
	// updateMoney();
	// updateFactory(Gems[1]);
	

/*	// Skip to amethyst
	Upgrades[0].owned = Upgrades[1].owned = true;
	Gems[2].clickpower.owned = true;
	Gems[0].factory.owned = 14;
	Gems[1].factory.owned = 3;
	updateFactory(Gems[0]);
	updateFactory(Gems[1]);
	updateUpgrade(Upgrades[0]);
	updateUpgrade(Upgrades[1]);
	Upgrades[1].onPurchase();
	updateClickPower(Gems[2]);
	Upgrades[2].owned = true;
	Upgrades[2].onPurchase();
	Upgrades[3].owned = true;*/
}

init();