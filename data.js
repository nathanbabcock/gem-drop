var DEFAULT_COST_FACTOR = 1.15;
var DEFAULT_GEM_RADIUS = 20;

//////////////

// Gem constructor
function Gem(options){
	// Initialize gem defaults
	var gem = {
		name: null,
		baseValue: null,
		getValue: function() {
			var mult = 1.0;
			if(Buffs.star.timeLeft > 0)
				mult *= Buffs.star.getPower();
			return this.baseValue * mult;
		},
		clickpower: {
			owned: false,
			baseCost: null,
			getCost: function(){ return this.baseCost; },
			baseRate: 1,
			getRate: function(){ return this.baseRate; }
			//getDescription: function() { return "" },
			//getName:function() { return this.super.name; }
		},
		factory: {
			owned: 0,
			baseCostFactor: DEFAULT_COST_FACTOR,
			getCostFactor: function() { return this.baseCostFactor; },
			baseCost: null,
			getCost: function(owned = this.owned){ return this.baseCost * Math.pow(this.getCostFactor(), owned); },
			baseRate: 0.5,
			getRate: function(){ return this.baseRate; },
			//getDescription: function() { return "" },
			//getName:function() { return this.super.name + " Factory"; }
		}
	};

	return applyOptions(gem, options);
}

function applyOptions(object, options){
	// Base case
	if(object === undefined || object === null || options === null || typeof options !== 'object')
		return options;

	// Apply options
	for(property in options){
		if (options.hasOwnProperty(property))
			object[property] = applyOptions(object[property], options[property]);
	}
	return object;
}

//////////////////

var Settings = {
	enable_save: false,
	offline_gains: true
}

var Gems = [
	new Gem({
		name: "Quartz",
		baseValue: 1,
		clickpower: {
			owned: true,
			baseCost: 0
		},
		factory: {
			baseCost: 25
		}
	}),
	new Gem({
		name: "Topaz",
		baseValue: 12,
		clickpower: {
			baseCost: 100
		},
		factory: {
			baseCost: 500
		}
	}),
	new Gem({
		name: "Amethyst",
		baseValue: 150,
		clickpower: {
			baseCost: 1750
		},
		factory: {
			baseCost: 6000
		}
	}),
	new Gem({
		name: "Sapphire",
		baseValue: 1750,
		clickpower: {
			baseCost: 22000
		},
		factory: {
			baseCost: 33000
		}
	}),
	new Gem({
		name: "Emerald",
		baseValue: 25000,
		clickpower: {
			baseCost: 300000
		},
		factory: {
			baseCost: 450000
		}
	}),
	new Gem({
		name: "Ruby",
		baseValue: 275000,
		clickpower: {
			baseCost: 3500000
		},
		factory: {
			baseCost: 5250000
		}
	}),
	new Gem({
		name: "Diamond",
		baseValue: 1000000,
		clickpower: {
			baseCost: 15000000
		},
		factory: {
			baseCost: 22500000
		}
	}),
	new Gem({
		name: "Rainbow",
		baseValue: 50000000,
		clickpower: {
			baseCost: 600000000
		},
		factory: {
			baseCost: 1000000000
		}
	})
];

// Grab quick references for debug/convenience
Gems.quartz = Gems[0];
Gems.topaz = Gems[1];
Gems.amethyst = Gems[2];
Gems.sapphire = Gems[3];
Gems.emerald = Gems[4];
Gems.ruby = Gems[5];
Gems.diamond = Gems[6];
Gems.rainbow = Gems[7];

var UPGRADE_CATEGORY = {
	AUTO_DROP: 0,
	INVENTORY_SIZE: 1
}

var Upgrades = [
	{
		name: "Inventory Size I",
		description: "More space to hold gems.",
		baseCost:12,
		getCost: function() { return this.baseCost; },
		category: UPGRADE_CATEGORY.INVENTORY_SIZE,
		onPurchase: function(){
			Inventory.build();
		},
		size: { width: 100, height: 300 },
		owned: false
	},
	{
		name: "Inventory Size II",
		description: "More space to hold gems.",
		baseCost:250,
		getCost: function() { return this.baseCost; },
		category: UPGRADE_CATEGORY.INVENTORY_SIZE,
		onPurchase: function(){
			Inventory.build();
		},
		size: { width: 200, height: 350 },
		owned: false
	},
	{
		name: "Inventory Size III",
		description: "More space to hold gems.",
		baseCost:4500,
		getCost: function() { return this.baseCost; },
		category: UPGRADE_CATEGORY.INVENTORY_SIZE,
		onPurchase: function(){
			Inventory.build();
			Achievements.misc.inventory.condition = function(){ return true; };
			Achievements.misc.inventory.check();
		},
		size: { width: 300, height: 500},
		owned: false
	},
	{
		name: "Auto Drop",
		description: "Automatically drops gems every 10 seconds.",
		baseCost:10000,
		getCost: function() { return this.baseCost; },
		category: UPGRADE_CATEGORY.AUTO_DROP,
		rate: 10,
		owned: false,
		onPurchase: function(){
			auto_drop.rate = this.rate;
		}
	}
];

var Buffs = [
	{
		name: "Star",
		description: "+50% sell price for 15 seconds",
		baseDuration: 15,
		getDuration: function(){ return this.baseDuration; },
		basePower: 1.5,
		getPower: function(){ return this.basePower; },
		timeLeft: 0,
		baseChance: 3, // % of all buff spawns which will be this one
		getChance: function(){ return this.baseChance; },
	},
	{
		name: "Heart",
		description: "+200% factory production for 10 seconds",
		baseDuration: 10,
		getDuration: function(){ return this.baseDuration; },
		basePower: 2.0,
		getPower: function(){ return this.basePower; },
		timeLeft: 0,
		baseChance: 3, // % of all buff spawns which will be this one
		getChance: function(){ return this.baseChance; },
	},
	{
		name: "Cursor",
		description: "Spawn twice as many gems by clicking for 5 seconds",
		baseDuration: 5,
		getDuration: function(){ return this.baseDuration; },
		basePower: 2.0,
		getPower: function(){ return this.basePower; },
		timeLeft: 0,
		baseChance: 3, // % of all buff spawns which will be this one
		getChance: function(){ return this.baseChance; },
	},
	{
		name: "Teardrop",
		description: "Hold down the mouse button to continuously spawn gems for 10 seconds",
		baseDuration: 10,
		getDuration: function(){ return this.baseDuration; },
		timeLeft: 0,
		baseChance: 1, // % of all buff spawns which will be this one
		getChance: function(){ return this.baseChance; },
	}
];
Buffs.baseRate = Infinity;
Buffs.getRate = function(){ return Buffs.baseRate; };
Buffs.star = Buffs[0];
Buffs.heart = Buffs[1];
Buffs.cursor = Buffs[2];
Buffs.teardrop = Buffs[3];

var Stats = {
	money: 0,
	gems: 0,
	clickpower_gems: 0,
	factory_gems: 0,
	upgrades: 0,
	clickpowers: 1,
	factories: 0,
	achievements:0,
	prestige: 0,
	start_date: new Date().getTime(),
	sold: 0,
	wasted: 0
};

var Achievements = {all: []};

function Achievement(name, description, value, condition, options={}){
	var achievement = {
		name: name,
		description: description,
		baseValue: value,
		condition: condition,
		getValue: function(){ return this.baseValue; },
		check: function(){
			if(this.owned || !this.condition()) return false;
			this.owned = true;
			Stats.achievements++;
			updateMoney(this.getValue());
			console.log("Unlocked achievement: "+this.name);
			console.log(">"+this.description);
			checkAll(Achievements.meta);
		},
		owned: false
	};
	achievement = applyOptions(achievement, options)
	Achievements.all.push(achievement);
	return achievement;
}

function cp_ach_val(gem){ return gem.clickpower.getCost() * 0.1; };
//function fact_ach_val(gem, num){ return calculatePurchase(gem, num) * 0.1; };

// Gems.quartz.clickpower.achievements = [];
// Gems.quartz.factory.achievements = [];
// Achievements.money = [];
// Achievements.clickpower = [];

// gem.factory.achievements.forEach(function(a){ a.check(); });
// Achievements.factory.byGem(gem).forEach(function(a){ a.check(); });
// Achievements.all.forEach();

// Clickpower owned
Achievements.clickpower = {
	topaz: new Achievement("Topaz Toucher", "Buy the topaz clickpower", cp_ach_val(Gems.topaz), function(){ return Gems.topaz.clickpower.owned; }),
	amethyst: new Achievement("Amethyst Amateur", "Buy the amethyst clickpower", cp_ach_val(Gems.amethyst), function(){ return Gems.amethyst.clickpower.owned; }),
	sapphire: new Achievement("The Blues", "Buy the sapphire clickpower", cp_ach_val(Gems.sapphire), function(){ return Gems.sapphire.clickpower.owned; }),
	emerald: new Achievement("Green Thumb", "Buy the emerald clickpower", cp_ach_val(Gems.emerald), function(){ return Gems.emerald.clickpower.owned; }),
	ruby: new Achievement("Ruby Clicker", "Buy the ruby clickpower", cp_ach_val(Gems.ruby), function(){ return Gems.ruby.clickpower.owned; }), // TODO
	diamond: new Achievement("DIAMONDS!", "Buy the diamond clickpower", cp_ach_val(Gems.diamond), function(){ return Gems.diamond.clickpower.owned; }),
	rainbow: new Achievement("Jazz Hands", "Buy the rainbow clickpower", cp_ach_val(Gems.rainbow), function(){ return Gems.rainbow.clickpower.owned; }),
	total: new Achievement("7-Fingered Man", "Buy all 7 clickpowers", cp_ach_val(Gems.rainbow) / 2, function(){ return Stats.clickpowers >= Gems.length; }, {redtext: "You killed my father. Prepare to die."}),
	byGem: function(gem){ return this[gem.name.toLowerCase()]}
};

// Factory quantity
Achievements.factory = {};
Achievements.factory.quartz = [
	new Achievement("Triangles are my favorite shape", "Buy a quartz factory", 10, function(){ return Gems.quartz.factory.owned >= 1; }, {redtext: "Three points where two lines meet"}),
	new Achievement("Quartz Quarry", "Buy 50 quartz factories", 5000, function(){ return Gems.quartz.factory.owned >= 50; }),
	new Achievement("Quartz Mogul", "Buy 100 quartz factories", 20e6, function(){ return Gems.quartz.factory.owned >= 100; })
];
Achievements.factory.topaz = [
	new Achievement("Diversifying Your Portfolio", "Buy a topaz factory", 0, function(){ return Gems.topaz.factory.owned >= 1; }),
	new Achievement("Topaz x50", "Buy 50 topaz factories", 0, function(){ return Gems.topaz.factory.owned >= 50; }), // TODO
	new Achievement("Topaz Tycoon", "Buy 100 topaz factories", 0, function(){ return Gems.topaz.factory.owned >= 100; }),
];
Achievements.factory.amethyst = [
	new Achievement("Amethyst Automation", "Buy an amethyst factory", 0, function(){ return Gems.amethyst.factory.owned >= 1; }),
	new Achievement("Amethyst x50", "Buy 50 amethyst factories", 0, function(){ return Gems.amethyst.factory.owned >= 50; }), // TODO
	new Achievement("Purple Haze", "Buy 100 amethyst factories", 0, function(){ return Gems.amethyst.factory.owned >= 100; }),
];
Achievements.factory.sapphire = [
	new Achievement("Sapphire x1", "Buy a sapphire factory", 0, function(){ return Gems.sapphire.factory.owned >= 1; }), //TODO
	new Achievement("Blue Skies", "Buy 50 sapphire factories", 0, function(){ return Gems.sapphire.factory.owned >= 50; }),
	new Achievement("Sapphic Love", "Buy 100 sapphire factories", 0, function(){ return Gems.sapphire.factory.owned >= 100; }),
];
Achievements.factory.emerald = [
	new Achievement("Emerald Entrepreneur", "Buy an emerald factory", 0, function(){ return Gems.emerald.factory.owned >= 1; }),
	new Achievement("Emerald Enthusiast", "Buy 50 emerald factories", 0, function(){ return Gems.emerald.factory.owned >= 50; }),
	new Achievement("Emerald Engineer", "Buy 100 emerald factory", 0, function(){ return Gems.emerald.factory.owned >= 100; }),
];
Achievements.factory.ruby = [
	new Achievement("Ruby Producer", "Buy a ruby factory", 0, function(){ return Gems.ruby.factory.owned >= 1; }),
	new Achievement("Ruby x50", "Buy 50 ruby factories", 0, function(){ return Gems.ruby.factory.owned >= 50; }), // TODO
	new Achievement("Seeing Red", "Buy 100 ruby factories", 0, function(){ return Gems.ruby.factory.owned >= 100; }),
];
Achievements.factory.diamond = [
	new Achievement("Diamond Miner", "Buy a diamond factory", 0, function(){ return Gems.diamond.factory.owned >= 1; }),
	new Achievement("Lucy in the Sky", "Buy 50 diamond factories", 0, function(){ return Gems.diamond.factory.owned >= 50; }),
	new Achievement("The 1%", "Buy 100 diamond factories", 0, function(){ return Gems.diamond.factory.owned >= 100; }),
];
Achievements.factory.rainbow = [
	new Achievement("Leprechaun", "Buy a rainbow factory", 0, function(){ return Gems.rainbow.factory.owned >= 1; }),
	new Achievement("Double Rainbow", "Buy 2 rainbow factories", 0, function(){ return Gems.rainbow.factory.owned >= 2; }, {redtext: "What does it mean?"}),
	new Achievement("Rainbow x50", "Buy 50 rainbow factories", 0, function(){ return Gems.rainbow.factory.owned >= 50; }), // TODO
	new Achievement("The 0.1%", "Buy 100 rainbow factory", 0, function(){ return Gems.rainbow.factory.owned >= 100; }),
];
Achievements.factory.total = [
	new Achievement("Overseer", "Buy 500 total factories", 0, function(){ return Stats.factories >= 500; }),
	new Achievement("CEO", "Buy 1000 total factories", 0, function(){ return Stats.factories >= 1000; }),
];
Achievements.factory.each = [
	//new Achievement("asdf", "Buy a factory of every type", 0, function(){ var got = true; Gems.forEach(function(gem){ got = got && gem.factory.owned >= 1; }); return got; }),
	//new Achievement("asdf", "Buy 50 factories of every type", 50, function(){ var got = true; Gems.forEach(function(gem){ got = got && gem.factory.owned >= 50; }); return got; }),
	new Achievement("Stacked", "Buy 100 factories of every type", 0, function(){ var got = true; Gems.forEach(function(gem){ got = got && gem.factory.owned >= 100; }); return got; }),
];
Achievements.factory.byGem = function(gem){ return this[gem.name.toLowerCase()]};

// Clickpower gems
Achievements.clickpower_gems = [
	new Achievement("Hello world", "Spawn a gem by clicking", 1, function(){ return Stats.clickpower_gems >= 1; }),
	new Achievement("Click x1000", "Spawn 1000 gems by clicking", 0, function(){ return Stats.clickpower_gems >= 1000; }), // TODO
	new Achievement("Click x10k", "Spawn 10k gems by clicking", 0, function(){ return Stats.clickpower_gems >= 10000; }), // TODO
];

// Upgrades owned
Achievements.upgrades = [
	new Achievement("My First Upgrade", "Buy an upgrade", 0, function(){ return Stats.upgrades >= 1; }),
	new Achievement("Upgrade x25", "Buy 25 upgrades", 0, function(){ return Stats.upgrades >= 25; }), // TODO
	new Achievement("Upgrade x50", "Buy 50 upgrades", 0, function(){ return Stats.upgrades >= 50; }), // TODO
	new Achievement("Lvl 99", "Buy all upgrades", 0, function(){ return Stats.upgrades >= Upgrades.length; })
];

// Buffs
Achievements.buffs = [
	new Achievement("Buffed", "Collected a buff", 0, function(){ return Stats.buffs >= 1; }),
	new Achievement("Buff AF", "Collected 50 buffs", 0, function(){ return Stats.buffs >= 50; }), // TODO
	new Achievement("Do you even lift?", "Collected 100 buffs", 0, function(){ return Stats.buffs >= 100; }), // TODO
	new Achievement("Sick gains", "Collected 1k buffs", 0, function(){ return Stats.buffs >= 1000; }), // TODO
	new Achievement("Gym rat", "Collected 10k buffs", 0, function(){ return Stats.buffs >= 10000; }), // TODO
	new Achievement("Schwarzenegger", "Collected 100k buffs", 0, function(){ return Stats.buffs >= 100000; }), // TODO
];

// Total gems
Achievements.gems = [
	new Achievement("Gem Dropper", "Drop 100 gems", 1, function(){ return Stats.gems >= 100; }),
	new Achievement("Bejewelled", "Drop 1k gems", 1, function(){ return Stats.gems >= 1e3; }),
	new Achievement("Gem Dropper III", "Drop 10k gems", 1, function(){ return Stats.gems >= 10e3; }), // TODO
	new Achievement("Gem Dropper IV", "Drop 100k gems", 1, function(){ return Stats.gems >= 100e3; }), // TODO
	new Achievement("Outrageous", "Drop 1M gems", 1, function(){ return Stats.gems >= 1e6; }, { redtext: "Truly, truly, TRULY outrageous."}),
];

// Total money
Achievements.money = [
	new Achievement("Middle-Class", "Make $1k", 2.5e2, function(){ return Stats.money >= 1e3; }),
	new Achievement("Wealthy", "Make $1M", 2.5e5, function(){ return Stats.money >= 1e6; }),
	new Achievement("Opulent", "Make $1B", 2.5e8, function(){ return Stats.money >= 1e9; }),
	new Achievement("Obscene", "Make $1T", 2.5e11, function(){ return Stats.money >= 1e12; }),
]

// Meta-Achievement
Achievements.meta = [
	new Achievement("Meta-Achievement", "Unlock 15 achievements", 0, function(){ return Stats.achievements >= 15; }),
	new Achievement("Meta-Achievement", "Unlock 30 achievements", 0, function(){ return Stats.achievements >= 30; }),
	new Achievement("Meta-Achievement", "Unlock 45 achievements", 0, function(){ return Stats.achievements >= 45; }),
	new Achievement("Meta-Achievement", "Unlock 60 achievements", 0, function(){ return Stats.achievements >= 60; }),
	new Achievement("Meta-Meta-Achievement", "Unlock 4 meta-achievements", 0, function(){ return false; }),
	new Achievement("Overachiever", "Unlock every achievement", 0, function(){ return Stats.achievements >= Stats.achievements.length - 1; }, {redtext: "(except this one)"}),
];

// Prestige
Achievements.prestige = [
	new Achievement("The Prestige", "Prestige once", 0, function(){ return Stats.prestige >= 1; }, {redtext: "Are you watching closely?"}),
	new Achievement("Once more, with feeling", "Prestige twice", 0, function(){ return Stats.prestige >= 2; }),
	new Achievement("Ultimate Gem Hunter Mode", "Prestige three times", 0, function(){ return Stats.prestige >= 3; }),
	new Achievement("Gem Drop 4: The Droppening", "Prestige four times", 0, function(){ return Stats.prestige >= 4; }),
	new Achievement("Pentakill", "Prestige five times", 0, function(){ return Stats.prestige >= 5; }),
];

// Time played
Achievements.time = [
	new Achievement("60 minutes", "1 hour of total playtime (on and offline)", 0, function(){ return (Stats.start_date - new Date().getTime) / 1000 / 60 / 60 >= 1; }),
	new Achievement("24 hours", "1 day of total playtime (on and offline)", 0, function(){ return (Stats.start_date - new Date().getTime) / 1000 / 60 / 60 / 24 >= 1; }),
	new Achievement("2 days", "2 days of total playtime (on and offline)", 0, function(){ return (Stats.start_date - new Date().getTime) / 1000 / 60 / 60 / 24 >= 2; }),
	new Achievement("3 days", "3 days of total playtime (on and offline)", 0, function(){ return (Stats.start_date - new Date().getTime) / 1000 / 60 / 60 / 24 >= 3; }),
	new Achievement("4 days", "4 days of total playtime (on and offline)", 0, function(){ return (Stats.start_date - new Date().getTime) / 1000 / 60 / 60 / 24 >= 4; }),
	new Achievement("5 days", "6 days of total playtime (on and offline)", 0, function(){ return (Stats.start_date - new Date().getTime) / 1000 / 60 / 60 / 24 >= 6; }),
	new Achievement("6 days", "5 days of total playtime (on and offline)", 0, function(){ return (Stats.start_date - new Date().getTime) / 1000 / 60 / 60 / 24 >= 5; }),
	new Achievement("7 days", "One week of total playtime (on and offline)", 0, function(){ return (Stats.start_date - new Date().getTime) / 1000 / 60 / 60 / 24 >= 7; }),
];

// Gems wasted
Achievements.wasted = [
	new Achievement("Spillage", "Lose a gem when it falls outside the inventory", 10, function(){ return Stats.wasted >= 1; }),
	new Achievement("Buffer Overflow", "Lose 50 gems when they fall outside the inventory", 1000, function(){ return Stats.wasted >= 50; }),
	new Achievement("Why can't I hold all these gems?", "Lose 100 gems when they fall outside the inventory", 10000, function(){ return Stats.wasted >= 100; }),
];

// Misc
Achievements.misc = {
	inventory: new Achievement("So much space for activities", "Max out the inventory", 0, function(){ return false; }), // TODO
	autodrop: new Achievement("Open the Floodgates", "Upgrade to 100% autodrop", 0, function(){ return false; }), // TODO
	sell: new Achievement("Reimbursement", "Sell a factory", 100, function(){ return Stats.sold >= 1; }),
	hack: new Achievement("Script kiddie", "", -99, function(){ return true; }, {redtext: "alternatively: Introduction to the Developer Console"}),
};

function checkAll(list){
	return list.forEach(function(ach){ ach.check(); });
}

// Offline money
// Settings (export save, toggle fx/sound, etc)
// Have 3 buffs active at once