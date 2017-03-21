var DEFAULT_COST_FACTOR = 1.15;
var DEFAULT_GEM_RADIUS = 20;

//////////////

// Gem constructor
function Gem(options){
	// Initialize gem defaults
	var gem = {
		name: null,
		baseValue: null,
		getValue: function() { return this.baseValue; },
		clickpower: {
			owned: false,
			baseCost: null,
			getCost: function(){ return this.baseCost; },
			baseRate: 1,
			getRate: function(){ return this.baseRate; },
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