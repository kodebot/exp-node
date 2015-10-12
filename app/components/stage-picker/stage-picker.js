var Color = require("color").Color;
var views = require("ui/core/view");
var frames = require("ui/frame");
var dialogs = require("ui/dialogs");
var application = require("application");
var vm = require("./stage-picker-vm").stageData;
var config = require("./../../config");
var devUtils = require("./../../dev-utils/dev-utils");

exports.pageLoaded = function (args) {
	var page = args.object;
	page.bindingContext = vm;

	if (page.android) {
		application.android.foregroundActivity.getWindow().setStatusBarColor(new Color(config.styles.primaryColor).android);
		// this is private field and used directly as there is no other way to get the reference
		page.actionBar._toolbar.setTitleTextColor(new Color(config.styles.primaryTextColor).android);
	}
}

exports.onStageSelect = function (args) {
	var topmost = frames.topmost();
	topmost.navigate({
		moduleName: "components/route-finder/route-finder",
		context: { index: args.index },
		animate: false
	});
}