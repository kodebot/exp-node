var Color = require("color").Color;
var application = require("application");
var vm = require("./stage-picker-vm");
var config = require("./../../config");

function pageLoaded(args) {
	var page = args.object;
	page.bindingContext = vm.stageData;

	if (page.android) {
		application.android.foregroundActivity.getWindow().setStatusBarColor(new Color(config.styles.primaryColor).android);
		// this is private field and used directly as there is no other way to get the reference
		page.actionBar._toolbar.setTitleTextColor(new Color(config.styles.primaryTextColor).android);
	}
}

function onNavigatedTo(args){
	vm.onNavigatedTo(args.context);	
}

function onStageSelect(args) {
	vm.goToRouteFinder(args.index);
}


exports.pageLoaded = pageLoaded;
exports.onNavigatedTo = onNavigatedTo;
exports.onStageSelect = onStageSelect;