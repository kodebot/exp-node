var Observable = require("data/observable").Observable;
var navManager = require("../../nav-manager/nav-manager");
var devUtils = require("../../dev-utils/dev-utils");

var routeFinderData = new Observable({
	origin: "tap to select origin",
	dest: "tap to select destination"
});

function goToStagePicker(context){
	navManager.goToStagePicker(context);
}

function onNavigatedTo(context){
	if(context && context.origin){
		routeFinderData.set("origin", context.selectedStage.value)	
	}
	
	if(context && context.dest){
		routeFinderData.set("dest", context.selectedStage.value)
	}
}

exports.routeFinderData = routeFinderData;
exports.goToStagePicker = goToStagePicker;
exports.onNavigatedTo = onNavigatedTo;