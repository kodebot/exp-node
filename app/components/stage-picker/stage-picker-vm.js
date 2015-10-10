var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;

var stageData = new Observable({
	filterText: "",
	stages: new ObservableArray([
		"Test 1",
		"Something",
		"Test 2",
		"Test 3", 
		"Sample",
		"Mark", 
		"New",
		"Computer",
		"Table",
		"Some random",
		"more than one screen"
		])
});

stageData.set("filter", filter);

function filter(value){
	return stageData.stages.filter(function(item){
		return item.indexOf(stageData.get("filterText")) === 0;
	});
}

exports.stageData = stageData;