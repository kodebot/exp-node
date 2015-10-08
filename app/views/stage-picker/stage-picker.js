var vm = require("./stage-picker-vm").stageData;

exports.pageLoaded = function(args){
	args.object.bindingContext = vm;
}