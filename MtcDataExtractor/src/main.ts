/// <reference path="../typings/tsd.d.ts" />

import {By, until, WebDriver} from "selenium-webdriver";
import {Harvester} from "./harvester";
import {DriverHelper} from "./driverhelper";

var driver: webdriver.WebDriver= new DriverHelper().getDriver();
var harvester = new Harvester(driver);
// harvester.getRoutes((err, options) =>{
// 	if(err){
// 		console.log("Error while retrieving routes.");
// 		return;
// 	}
	
// 	options.forEach(option => console.log(option));
// });

// harvester.getStages((err, options) =>{
// 	if(err){
// 		console.log("Error while retrieving routes.");
// 		return;
// 	}
	
// 	options.forEach(option => console.log(option));
// });

harvester.getAllStagesOfAllRoute(null);
 driver.quit();