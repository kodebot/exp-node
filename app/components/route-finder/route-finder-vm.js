var Observable = require("data/observable").Observable;

var routeFinderData = new Observable({
	origin: "tap to select origin",
	dest: "tap to select destination"
});

exports.routeFinderData = routeFinderData;