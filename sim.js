// Simulates optimal gameplay
function simulate(){
	var t = 0;
	var delta = 60;
	var CPS = 0;
	var maxtime = 50 * 60 * 60; // when to end simulation, in seconds

	// Init spreadsheet
	var spreadsheet = "Time,Money,Total Income, Factory Income, Click Income,";
	Gems.forEach(function(gem){
		spreadsheet += gem.name + " Click Power,"
			+ gem.name + " Factories,"
			+ gem.name + " Factory Cost,"
	});
	spreadsheet+="\n";

	// Run sim
	var factoryMoney = 0;
	for(t = 0; t <= maxtime; t += delta){
		// INCOME
		var factoryIncome = 0;
		Gems.forEach(function(gem){
			factoryIncome += gem.factory.owned * gem.factory.getRate() * gem.getValue();
		});
		money += factoryIncome * delta;

		var clickIncome = 0;
		for(var i = 0; i < CPS; i++)
			doClick().forEach(function(gem){
				clickIncome += gem.getValue();
			});
		money += clickIncome * delta;
		console.log(t+":" + formatMoney(money));

		var totalIncome = factoryIncome + clickIncome;

		// PURCHASE
		var bestScore = Infinity;
		Gems.forEach(function(gem){
			// Factory
			gem.factory.score = (gem.factory.getCost() / totalIncome) + (gem.factory.getCost() / (totalIncome + gem.factory.getRate() * gem.getValue()));
			bestScore = Math.min(bestScore, gem.factory.score);
			//console.log(gem.name + " factory has score " + gem.factory.score);

			// Clickpower
			if(!gem.clickpower.owned){
				gem.clickpower.score = (gem.clickpower.getCost() / totalIncome) + (gem.clickpower.getCost() / (totalIncome + gem.clickpower.getRate() * CPS * gem.getValue()));
				bestScore = Math.min(bestScore, gem.clickpower.score);
				//console.log(gem.name + " cp has score " + gem.clickpower.score);
			}
		});

		Gems.forEach(function(gem){
			if(gem.factory.score === bestScore){
				buyFactory(gem);
				console.log(t+": bought "+gem.name+" factory");
				return;
			} else if(gem.clickpower.score === bestScore){
				buyClickPower(gem);
				console.log(t+": bought "+gem.name+" clickpower");
				return;
			}
		});

		// RECORD
		spreadsheet += (t/60)+","+money+","+totalIncome+","+factoryIncome+","+clickIncome+",";
		Gems.forEach(function(gem){
			spreadsheet += (gem.clickpower.owned ? 1 : 0) + ","
				+ gem.factory.owned + ","
				+ gem.factory.getCost() + ","
		});
		spreadsheet += "\n";
	}

	//console.log(spreadsheet);
	window.open("data:text/csv;charset=utf-8," + encodeURIComponent(spreadsheet));
	//window.prompt("Copy to clipboard: Ctrl+C, Enter", spreadsheet);
}

Gems[0].factory.owned = 1;
simulate();