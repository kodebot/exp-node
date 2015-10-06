/// <reference path="../typings/tsd.d.ts" />

import {By, until, WebDriver} from "selenium-webdriver";
import {Harvester} from "./harvester";
import {DriverHelper} from "./driverhelper";
import * as types from "./types";
import * as async from "async";

import * as dataaccess from "./dataaccess";

var driver: webdriver.WebDriver = new DriverHelper().getDriver();
var harvester = new Harvester(driver);

// dataaccess.writeCoachTypes((err) => {
// 	if (err) {
// 		console.log("Error while writing coach types...");
// 	} else {
// 		console.log("Coach types were written successfully...");

async.series(
	[harvester.getStages.bind(harvester),
		harvester.getRoutes.bind(harvester),
		dataaccess.writeCoachTypes.bind(dataaccess)]
	,
	(err: Error, results: any) => {
		if (err) {
			console.log("Error occured while routes and stages " + err.message);
			return;
		}

		let stages = results[0];
		let routes = results[1];
		console.log("stages and routes are retrieved successfully...");

		harvester.getAllStagesOfAllRoute(routes, (err, res) => {
			driver.quit(); // all scrapings are done here...
			if (err) {
				console.log("Error while retrieving route info..." + err.message);
				return;
			}
			async.series(
				[(cb) => dataaccess.writeStages(<string[]>stages, cb),
					(cb) => dataaccess.writeRoutes(<types.RouteInfo[]>res, cb)
				]
				,
				(err: Error, result: any) => {
					if (err) {
						console.log("Error while writing stages and routes " + err.message);
					} else {
						console.log("Stages and Routes are written successfully...");
					}
				});
		});




	});
//}
// });

// harvester.getStages((err: Error, res: string[]) => {
// 	if(err){
// 		console.log("error");
// 	}else{
// 		console.log(res);
// 	}
// });



	

// async.series([
// 	/*(cb) => harvester.getAllStagesOfAllRoute.call(harvester, routes, cb),*/
// 	(cb) => harvester.getRoutesBetweenAllStages.call(harvester, stages, cb)],
// 	(err, results) => {
// 		if (err) {
// 			console.log("Error while retrieving stages and routes combination " + err.message);
// 		}

// 		console.log(results);
// 		async.filter(
// 			<Array<types.RoutesBetweenStages>>results[0],
// 			(item, cb) => {
// 				var res = !!item.routeNos;
// 				return cb(res)
// 			},
// 			(data) => {
// 				console.log("Stages and Routes combination retrieved successfully...");
// 				return;
// 			});

// 	});
// });


