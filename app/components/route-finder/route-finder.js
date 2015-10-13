var vm = require("./route-finder-vm").routeFinderData;
var navManager = require("./../../nav-manager/nav-manager");

exports.onLoaded = function (args) {
	var page = args.object;
	page.bindingContext = vm;
}

exports.onNavigatedTo = function (args) {

}

exports.onOriginStageTap = function () {
	navManager.goToStagePicker();
}

exports.onDestStageTap = function () {
	navManager.goToStagePicker();
}