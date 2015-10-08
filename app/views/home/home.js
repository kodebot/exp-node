var vmModule = require("./homeViewModel");
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = vmModule.homeViewModel;
}
exports.pageLoaded = pageLoaded;
