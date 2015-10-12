var dialogs = require("ui/dialogs");

exports.propsInspector = function (target) {
	if (target) {
		var val = "";
		for (var key in target) {
			val = val + key + "\n";
		}
		dialogs.alert(val);
	}
}