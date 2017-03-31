///////////////////////////////////////////////////////////////////////////////////////////////////////////
// GAME.JS
// Nathan Babcock
///////////////////////////////////////////////////////////////////////////////////////////////////////////

var money = 0;

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
	buy_max: document.getElementById("buy_max"),
	buffs: document.getElementById("buffs"),
	inv_hover: document.getElementById("inv_hover"),
	achievement_popups: document.getElementById("achievement_popups"),
	achievements: document.getElementById("achievements"),
	stats: {
		modal: document.getElementById("stats"),
		modal_inner: document.getElementById("stats").querySelector("modal_inner"),
		gems: document.getElementById("stats_gems"),
		money: document.getElementById("stats_money"),
		clickpower_gems: document.getElementById("stats_clickpower_gems"),
		wasted: document.getElementById("stats_wasted"),
		upgrades: document.getElementById("stats_upgrades"),
		clickpowers: document.getElementById("stats_clickpowers"),
		factories: document.getElementById("stats_factories"),
		achievements: document.getElementById("stats_achievements"),
		prestige: document.getElementById("stats_prestige"),
		time: document.getElementById("stats_time"),
		prestige_time: document.getElementById("stats_prestige_time"),
		isOpen: false
	},
	settings: {
		modal: document.getElementById("settings"),
		save: document.getElementById("save"),
		lastsaved: document.getElementById("lastsaved")
	}
}; 

var BuyMode = {
	BUY:0,
	SELL:1,
	mode: 0,
	quantity: 1
};

// TODO this gets immediately overwritten when physics.js loads
var Inventory = {
	getValue: function() {
		return 0;
	},
	build: function() {
		return false;
	}
}

var AutoDrop = {
	open:false,
	timer:0,
	rate:-1,
	manuallyOpen:false,
	getOpenDuration:function(){
		return 2;
	}
};

var OfflineMode = {
	bonus:1 // multiplier to offline gains
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREATE UI
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function getClickPowerHMTL(gem){
	var clickpower = gem.clickpower,
		refs = clickpower.ui = {},
		container = refs.container;
	container = document.createElement("div");
	container.className = "gem_click_power popup_container";
	container.innerHTML = `
		<div class="popup_anchor">Quartz</div>
		<div class="popup">
			<strong class="name">Quartz</strong>
			<div class="rate">+1 per click</div>
			<div class="price">$1 each</div>
			<div class="costs">Costs $10</div>
		</div>`;

	refs.anchor = container.querySelector(".popup_anchor");
	refs.popup = container.querySelector(".popup");
	refs.name = container.querySelector(".name");
	refs.rate = container.querySelector(".rate");
	refs.price = container.querySelector(".price");
	refs.costs = container.querySelector(".costs");

	// Onclick
	refs.anchor.onclick = function() { buyClickPower(gem); };
	refs.anchor.innerText = gem.name;
	refs.name.innerText = gem.name;

	updateClickPower(gem);
	return container;
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

	var factory = gem.factory,
		refs = factory.ui = {},
		container = refs.container = document.createElement("div");
	container.className = "factory popup_container";
	container.innerHTML = `
		<div class="popup_anchor">Quartz</div>
		<div class="popup">
			<strong class="name">Quartz Factory</strong>
			<div class="rate">+1 per second</div>
			<div class="price">Costs $18</div>
			<div class="owned">0 owned</div>
		</div>`;

	refs.anchor = container.querySelector(".popup_anchor");
	refs.popup = container.querySelector(".popup");
	refs.name = container.querySelector(".name");
	refs.rate = container.querySelector(".rate");
	refs.price = container.querySelector(".price");
	refs.owned = container.querySelector(".owned");

	refs.anchor.onclick = function() { buyFactory(gem); };
	refs.anchor.innerText = gem.name;
	refs.name.innerText = gem.name + " Factory";

	updateFactory(gem);
	return container;
}

function getUpgradeHTML(upgrade){
	var refs = upgrade.ui = {},
		container = refs.container = document.createElement("div");
	container.className = "upgrade popup_container";
	container.innerHTML = `
		<div class="popup_anchor">asdf</div>
		<div class="popup">
			<strong class="name">asdf</strong>
			<div class="description">blah blah blah</div>
			<div class="price">Costs $18</div>
		</div>`;

	refs.anchor = container.querySelector(".popup_anchor");
	refs.popup = container.querySelector(".popup");
	refs.name = container.querySelector(".name");
	refs.description = container.querySelector(".description");
	refs.costs = container.querySelector(".price");

	refs.anchor.onclick = function() { buyUpgrade(upgrade); };
	refs.anchor.innerText = refs.name.innerText = upgrade.name;
	refs.description.innerText = upgrade.description;
	refs.costs.innerText = upgrade.getCost();

	updateUpgrade(upgrade);
	return container;
}

function getBuffHTML(buff){
	var refs = buff.ui = {},
		container = refs.container = document.createElement("div");
	container.className = "buff_container";
	container.innerHTML = `
		 				<div class="buff popup_container">
							<div class="popup_anchor">asdf</div>
							<div class="popup">
								<strong class="name">asdf</strong>
								<div class="description">+10 butts for 3.5 seconds</div>
							</div>
						</div>
						<div class="progressbar_container">
							<div class="progressbar_outer"><div class="progressbar_inner"></div></div>
							<div class="timeleft">3s</div>
						</div>`;
	refs.anchor = container.querySelector(".popup_anchor");
	refs.name = container.querySelector(".name");
	refs.description = container.querySelector(".description");
	refs.progressbar = container.querySelector(".progressbar_inner");
	refs.timeleft = container.querySelector(".timeleft");

	refs.anchor.innerText = buff.name;
	updateBuff(buff);
	return container;
}

function getAchievementHTML(achievement){
	var container = document.createElement("div");
	container.className = "achievement";
	container.innerHTML = `
		<img class="icon" src="">
		<div class="text">
			<strong class="name">Hello World</strong>
			<span class="description">Popup text goes here</span>
			<small class="redtext">Secret red text</small>
		</div>
		<div class="value">$500</div>
		<div class="clear"></div>`;
	container.onclick = function(){
		container.parentNode.removeChild(container);
	};
	updateAchievement(achievement, container);
	return container;
}

function getAchievementIconHTML(achievement){
	var refs = achievement.ui = {},
		container = refs.container = document.createElement("div");
	container.className = "achievement_icon popup_container";
	container.innerHTML = `<img class="icon popup_anchor" src="">`;
	var popup = getAchievementHTML(achievement);
	updateAchievement(achievement, popup);
	popup.className += " popup";
	container.appendChild(popup);
	return container;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE UI
///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

function updateBuff(buff){
	if(buff.timeLeft <= 0){
		buff.ui.container.style.display = "none";
		var anyBuff = false;
		Buffs.forEach(function(buff){
			if(buff.timeLeft > 0)
				anyBuff = true;
		});
		if(!anyBuff) ui.buffs.style.display = "none";
	}
	else {
		ui.buffs.style.display = "block";
		buff.ui.container.style.display = "block";
	}
	buff.ui.name.innerHTML = buff.name;
	buff.ui.description.innerHTML = buff.description;
	buff.ui.progressbar.style.width = (buff.timeLeft / buff.getDuration()) * 100 + "%";
	buff.ui.timeleft.innerHTML = formatTime(buff.timeLeft * 1000);
}

function updateAchievement(achievement, element){
/*	<div class="achievement" id="inv_hover">
		<img class="icon" src="">
		<div class="text">
			<strong class="name">Hello World</strong>
			<span class="description">Popup text goes here</span>
			<small class="redtext">Secret red text</small>
		</div>
		<div class="value">$500</div>
		<div class="clear"></div>
	</div>*/

	// element.querySelector(".icon").src = achievement.icon;
	element.querySelector(".name").innerText = achievement.name;
	element.querySelector(".description").innerText = achievement.description;
	element.querySelector(".value").innerText = formatMoney(achievement.getValue());
	var redtext = element.querySelector(".redtext");
	if(achievement.redtext){
		redtext.style.display = "block";
		redtext.innerText = achievement.redtext;
	} else {
		redtext.style.display = "none";
	}
	element.achievement = achievement;

	return false;
}

function updateStats(){
	ui.stats.money.innerText = formatMoney();
	ui.stats.gems.innerText = Stats.gems;
	ui.stats.clickpower_gems.innerText = Stats.clickpower_gems;
	ui.stats.upgrades.innerText = Stats.upgrades;
	ui.stats.clickpowers.innerText = Stats.clickpowers;
	ui.stats.factories.innerText = Stats.factories;
	ui.stats.prestige.innerText = Stats.prestige;
	ui.stats.time.innerText = formatTime(new Date().getTime() - Stats.start_date);
	ui.stats.prestige_time.innerText = formatTime(new Date().getTime() - Stats.prestige_start_date);
	ui.stats.wasted.innerText = Stats.wasted;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// MENU/MODAL
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function initSettings(){
	ui.settings.save.onclick = function(){ saveGame(); };
	ui.settings.lastsaved.innerText = "Last saved less than a second ago";
}

function openAchievements(){
	closeSettings();
	closeStats();
	ui.achievements.style.display = "block";
}

function closeAchievements(){
	ui.achievements.style.display = "none";
}

function openStats(){
	closeAchievements();
	closeSettings();
	ui.stats.modal.style.display = "block";
	ui.stats.timeout = setInterval(updateStats, 1000);
	ui.stats.isOpen = true;
}

function closeStats(){
	ui.stats.modal.style.display = "none";
	clearInterval(ui.stats.timeout);
	ui.stats.isOpen = false;
}

function openSettings(){
	closeAchievements();
	closeStats();
	ui.settings.modal.style.display = "block";
}

function closeSettings(){
	ui.settings.modal.style.display = "none";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// BUY/SELL/SPAWN
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Calculates the cost of a factory purchase for the given gem according to BUY MODE
function calculatePurchase(gem, quantity = BuyMode.quantity){
	var r = gem.factory.getCostFactor(),
		b = gem.factory.baseCost,
		k = gem.factory.owned,
		c = money,
		n = 0;
	if(BuyMode.mode === BuyMode.BUY){
		var max_quantity = Math.floor(log(r, Math.pow(r, k) - c * ((1 - r) / b)) - k);
		if(quantity === "max")
			n = Math.max(max_quantity, 1);
		else
			n = quantity;
	} else {
		if(quantity === "max")
			n = gem.factory.owned;
		else
			n = Math.min(gem.factory.owned, quantity);
		k = gem.factory.owned - n;
	}
	var cost = b * ((Math.pow(r, k) - Math.pow(r, k + n))/(1 - r));
	return { cost: cost, quantity: n };
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

function buyClickPower(gem){
	var clickpower = gem.clickpower;
	if(clickpower.owned || clickpower.getCost() > money)
		return false;
	updateMoney(-clickpower.getCost());
	clickpower.owned++;
	Stats.clickpowers++;	
	Achievements.clickpower.byGem(gem).check();
	Achievements.clickpower.total.check();
	updateClickPower(gem);
	return true;
}

function buyFactory(gem){
	var factory = gem.factory;
	var purchase = calculatePurchase(gem);

	if(BuyMode.mode === BuyMode.BUY){
		if(purchase.cost > money)
			return false;
		factory.owned += purchase.quantity;
		updateMoney(-purchase.cost);

		Stats.factories++;
		checkAll(Achievements.factory.byGem(gem));
		checkAll(Achievements.factory.each);
		checkAll(Achievements.factory.total);
		//updateFactory(gem);
	} else {
		factory.owned -= purchase.quantity;
		updateMoney(purchase.cost);
		Stats.sold += purchase.quantity;
		Achievements.misc.sell.check();
	}
	return true;
}

function buyUpgrade(upgrade){
	if(upgrade.owned || upgrade.getCost() > money)
		return false;
	updateMoney(-upgrade.getCost());
	upgrade.owned = true;
	updateUpgrade(upgrade);
	if(upgrade.onPurchase !== undefined)
		upgrade.onPurchase();
	Stats.upgrades++;
	checkAll(Achievements.upgrades);
	return true;
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
	Stats.clickpower_gems += gemsToMake.length;
	checkAll(Achievements.clickpower_gems);
	checkAll(Achievements.gems);
	return gemsToMake;
}

function updateMoney(amount = 0){
	if(amount > 0){
		Stats.money += amount;
		checkAll(Achievements.money);
	}

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
	Stats.gems++;
	checkAll(Achievements.gems);
}

function clickBuff(buff){
	buff.timeLeft = buff.getDuration();
	Stats.buffs++;
	checkAll(Achievements.buffs);
	updateBuff(buff);
	updateMoney();
}

function getAchievement(achievement){
	if(ui.achievement_popups.children.length >= 5)
		ui.achievement_popups.removeChild(ui.achievement_popups.children[0]);
	ui.achievement_popups.appendChild(getAchievementHTML(achievement));
	updateMoney(achievement.getValue());
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// LOAD/SAVE/SIM/EXPORT
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function saveGame(){
	var save = {
		gems: [],
		upgrades: []
	};

	// Gather all gamestate elements
	save.time = new Date().getTime();
	save.money = money;
	Gems.forEach(function(gem){
		save.gems.push({
			factory: gem.factory.owned,
			clickpower: gem.clickpower.owned
		});
	});
	Upgrades.forEach(function(upgrade){
		save.upgrades.push(upgrade.owned);
	});
	save.AutoDrop = AutoDrop.rate;

	localStorage.setItem("save", JSON.stringify(save));
	return true;
	//console.log("Game saved");
}

function loadGame(){
	// Get save from localStorage
	var gameString = localStorage.getItem("save");
	if(gameString === null){
		console.log("No save game found");
		return false;
	}
	var save = JSON.parse(gameString);
	console.log(save);
	
	// Copy over the gamestate
	money = save.money;
	Gems.forEach(function(gem, index){
		gem.clickpower.owned = save.gems[index].clickpower;
		gem.factory.owned = save.gems[index].factory;
	});
	Upgrades.forEach(function(upgrade, index){
		upgrade.owned = save.upgrades[index];
	});
	AutoDrop.rate = save.AutoDrop;
	Inventory.build();

	var delta = new Date().getTime() - save.time;
	var offline_income = simulate(delta / 1000);
	if(Settings.offline_gains)
		money += offline_income;

	// Done
	console.log("Game loaded succesfully");
	return true;
}

function resetGame(){
	localStorage.clear();
	console.log("Game save deleted");
}

function simulate(delta){
	// delta should be time in SECONDS
	console.log("Offline time: "+delta+"s");

	var inv_size = Inventory.getSize();
	var inv_cap = (inv_size.width * inv_size.height) / (DEFAULT_GEM_RADIUS * DEFAULT_GEM_RADIUS * 4);
	console.log("Inventory capacity: " + inv_cap + " gems");


	var max_rate;
	if(AutoDrop.rate === -1)
		max_rate = inv_cap / delta;
	else if(AutoDrop.rate === -1)
		max_rate = inv_cap;
	else
		max_rate = inv_cap / AutoDrop.rate;
	console.log("Max rate: " + max_rate + " gems/sec");

	var rate = [];
	var total_rate = 0;
	Gems.forEach(function(gem){
		var spawned = gem.factory.getRate() * gem.factory.owned;
		rate.push(spawned);
		total_rate += spawned;
	});
	console.log("Uncapped rate: "+total_rate+" gems/sec");

	var cap_ratio = 1;
	if(total_rate > max_rate){
		cap_ratio = max_rate/total_rate;
		total_rate = max_rate;
	}
	console.log("Cap ratio: "+cap_ratio);

	var income = 0;
	rate.forEach(function(rate, index){
		income += rate * Gems[index].getValue();
	});
	console.log("Uncapped income: "+formatMoney(income)+"/s");

	income *= cap_ratio;
	console.log("Capped income: "+formatMoney(income)+"/s");

	var total_income = Math.round(income * delta);
	console.log("Total income: "+formatMoney(total_income));

	return total_income;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// UTILITIES
///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

function formatTime(ms){
	return Math.ceil(ms / 1000) + "s";
}

function log(b, n) {
    return Math.log(n) / Math.log(b);
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

function cheat(){
	Upgrades[2].owned = true;
	Upgrades[2].onPurchase();
	Upgrades[3].owned = true;
	Upgrades[3].onPurchase();
	Gems[0].factory.owned = 20;

	//updateMoney(10000);
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// INIT
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function init(){
	money = 10000000000;

	if(Settings.enable_save)
		loadGame();

	// Clickpowers and Factories
	Gems.forEach(function(gem){
		ui.click_powers.appendChild(getClickPowerHMTL(gem));
		ui.factories.appendChild(getFactoryHTML(gem));
	})

	// Upgrades
	Upgrades.forEach(function(upgrade){
		ui.upgrades.appendChild(getUpgradeHTML(upgrade));
	});

	// Buffs
	Buffs.forEach(function(buff){
		ui.buffs.appendChild(getBuffHTML(buff))
	});

	// Achievements
	Achievements.all.forEach(function(achievement){
		ui.achievements.children[2].appendChild(getAchievementIconHTML(achievement));
	});

	// Buy Mode
	ui.buy.onclick = function() { setBuyMode(BuyMode.BUY, ui.buy); };
	ui.sell.onclick = function() { setBuyMode(BuyMode.SELL, ui.sell); };
	ui.buy_1.onclick = function() { setBuyQuantity(1, ui.buy_1); };
	ui.buy_10.onclick = function() { setBuyQuantity(10, ui.buy_10); };
	ui.buy_100.onclick = function() { setBuyQuantity(100, ui.buy_100); };
	ui.buy_max.onclick = function() { setBuyQuantity("max", ui.buy_max); };

	// Achievements modal
	ui.achievements.querySelector(".close").onclick=closeAchievements;

	// Stats modal
	ui.stats.modal.querySelector(".close").onclick=closeStats;

	// Settings modal
	ui.settings.modal.querySelector(".close").onclick=closeSettings;
	initSettings();

	updateMoney();
}

document.body.onload = init;