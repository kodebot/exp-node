var frames = require("ui/frame");

module.exports = {
	goToStagePicker: function(context){
		navigateTo("./components/stage-picker/stage-picker", context);
	},
	goToRouteFinder: function(context){
		navigateTo("./components/route-finder/route-finder", context);
	}
}

function navigateTo(componentPath, context){
	frames.topmost().navigate({
			moduleName: componentPath,
			context:context,
			animate:true
	});
}