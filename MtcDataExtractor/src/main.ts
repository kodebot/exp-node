/// <reference path="../typings/tsd.d.ts" />

import {By, until, WebDriver} from "selenium-webdriver";
import {Harvester} from "./harvester";
import {DriverHelper} from "./driverhelper";

var driver: webdriver.WebDriver = new DriverHelper().getDriver();
var harvester = new Harvester(driver);

// harvester.getRoutes((err, routes) => {
// 	if (err) {
// 		console.log("Error while retrieving routes.");
// 		return;
// 	}

	harvester.getStages((err, stages) => {
		if (err) {
			console.log("Error while retrieving routes.");
			return;
		}
		// harvester.getAllStagesOfAllRoute(routes, (err, data) => {
		// 	if (err) {
		// 		console.log("Error while retrieving stages of all routes");
		// 	}
			
		// 	console.log(data);
		// });
		harvester.getRoutesBetweenAllStages(stages);
	});
// });




driver.quit();
