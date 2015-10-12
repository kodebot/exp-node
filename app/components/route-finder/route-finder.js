var dialogs = require("ui/dialogs");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;

exports.onLoaded = function (args) {
	var page = args.object;
	page.bindingContext = new Observable({ source: new ObservableArray(["1", "2", "3", "4", "5", "6"]) });
}

exports.onNavigatedTo = function (args) {
	var page = args.object;

	if (page.navigationContext) {
		dialogs.alert(page.navigationContext.index.toString());
	}
}

exports.onOriginStageTap = function () {
	dialogs.alert("on origin stage tap");
}

exports.onSubmit = function (args) {
	dialogs.alert(args.object.text);
}

exports.onClear = function (args) {
	dialogs.alert("cleared");
}