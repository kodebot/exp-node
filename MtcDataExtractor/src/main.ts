/// <reference path="../typings/tsd.d.ts" />

import {By, until, WebDriver} from "selenium-webdriver";
import {Harvester} from "./harvester";
import {DriverHelper} from "./driverhelper";
import * as types from "./types";
import * as async from "async";

var driver: webdriver.WebDriver = new DriverHelper().getDriver();
var harvester = new Harvester(driver);

async.series([harvester.getRoutes.bind(harvester), harvester.getStages.bind(harvester)], (err, results) => {
	if (err) {
		console.log("Error occured while routes and stages " + err.message);
		return;
	}

	let routes = results[0];
	let stages = results[1];

	console.log("stages and routes are retrieved successfully...");

	async.series([
		/*(cb) => harvester.getAllStagesOfAllRoute.call(harvester, routes, cb),*/
		(cb) => harvester.getRoutesBetweenAllStages.call(harvester, stages, cb)],
		(err, results) => {
			if (err) {
				console.log("Error while retrieving stages and routes combination " + err.message);
			}

			console.log(results);
			async.filter(
				<Array<types.RoutesBetweenStages>>results[0],
				(item, cb) => {
					var res = !!item.routeNos;
					return cb(res)
				},
				(data) => {
					console.log("Stages and Routes combination retrieved successfully...");
					return;
				});

		});
});

driver.quit();
