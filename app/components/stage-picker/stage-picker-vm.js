var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var navUtils = require("../../nav-manager/nav-manager");

var navigationContext = null;
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

var filteredStagesOnView = stageData.stages;

function filter(value) {
	filteredStagesOnView = stageData.stages.filter(function (item) {
		return item.value.toLowerCase().indexOf(stageData.get("filterText").toLowerCase()) === 0;
	});
	
	return filteredStagesOnView;
}

function goToRouteFinder(selectedItemIndex) {
	if (navigationContext && filteredStagesOnView) {
		navigationContext.selectedStage = filteredStagesOnView[selectedItemIndex];
		navUtils.goToRouteFinder(navigationContext);
	}
}

function onNavigatedTo(navCntx) {
	// filteredStagesOnView = null;
	// stageData.set("filterText", "");
	
	navigationContext = navCntx;
}

exports.stageData = stageData;
exports.goToRouteFinder = goToRouteFinder;
exports.onNavigatedTo = onNavigatedTo;