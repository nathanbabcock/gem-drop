var DEFAULT_COST_FACTOR = 1.15;

var UPGRADE_CATEGORY = {
	AUTO_DROP: 0
}

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
			baseRate: 1,
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

var Gems = [
	new Gem({
		name: "Quartz",
		baseValue: 1,
		clickpower: {
			owned: true,
			baseCost: 0
		},
		factory: {
			baseCost: 12
		}
	}),
	new Gem({
		name: "Topaz",
		baseValue: 12,
		clickpower: {
			baseCost: 100
		},
		factory: {
			baseCost: 150
		}
	}),
	new Gem({
		name: "Amethyst",
		baseValue: 150,
		clickpower: {
			baseCost: 1750
		},
		factory: {
			baseCost: 2000
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

//Gems.all = [Gems.quartz, Gems.topaz, Gems.amethyst, Gems.sapphire, Gems.emerald, Gems.ruby, Gems.diamond, Gems.rainbow];

var Upgrades = [
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