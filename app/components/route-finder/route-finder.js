var vm = require("./route-finder-vm");
var navManager = require("./../../nav-manager/nav-manager");

function onPageLoaded(args) {
	var page = args.object;
	page.bindingContext = vm.routeFinderData;
}

function onOriginStageTap() {
	vm.goToStagePicker({ origin: true, dest: false })
}

function onNavigatedTo(args) {
	vm.onNavigatedTo(args.context)
}

function onDestStageTap() {
	vm.goToStagePicker({ origin: false, dest: true })
}



exports.onLoaded = onPageLoaded;
exports.onNavigatedTo = onNavigatedTo;
exports.onOriginStageTap = onOriginStageTap;
exports.onDestStageTap = onDestStageTap;