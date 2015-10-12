var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;

var stageData = new Observable({
	filterText: "",
	stages: new ObservableArray([
		{ id: 1, value: "Test 1" },
		{ id: 2, value: "Something" },
		{ id: 3, value: "Test 2" },
		{ id: 4, value: "Test 3" },
		{ id: 5, value: "Sample" },
		{ id: 6, value: "Mark" },
		{ id: 7, value: "New" },
		{ id: 8, value: "Computer" },
		{ id: 9, value: "Table" },
		{ id: 10, value: "Some random" },
		{ id: 11, value: "more than one screen" }
	])
});

stageData.set("filter", filter);

function filter(value) {
	return stageData.stages.filter(function (item) {
		return item.value.toLowerCase().indexOf(stageData.get("filterText").toLowerCase()) === 0;
	});
}

exports.stageData = stageData;