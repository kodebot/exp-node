var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var navUtils = require("../../nav-manager/nav-manager");
var dataManager = require("../../data-manager/data-manager");
var dialogs = require("ui/dialogs");

var navigationContext = null;
var stageData = new Observable({
	filterText: "",
	stages: new ObservableArray([])
});
stageData.set("filter", filter);

dataManager.getAllStages(function (err, rows) {
	var resultSet = rows.map(function(item){
		return {id:item[0], name:item[1], desc:item[2]};
	});
	stageData.set("stages", new ObservableArray(resultSet));
});

var filteredStagesOnView = stageData.stages;

function filter(value) {
	filteredStagesOnView = value.filter(function (item) {
		return item.name.toLowerCase().indexOf(stageData.get("filterText").toLowerCase()) === 0;
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