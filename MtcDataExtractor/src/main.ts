/// <reference path="../typings/tsd.d.ts" />

import webdriver = require('selenium-webdriver');
import By = webdriver.By;
import until = webdriver.until;

import harvestors = require("./harvester");
import driverHelpers = require("./driverhelper");

var driver: webdriver.WebDriver= new driverHelpers.DriverHelper().getDriver();
var harvester = new harvestors.Harvester(driver);
harvester.getRoutes((err, options) =>{
	if(err){
		console.log("Error while retrieving routes.");
		return;
	}
	
	options.forEach(option => console.log(option));
});

harvester.getStages((err, options) =>{
	if(err){
		console.log("Error while retrieving routes.");
		return;
	}
	
	options.forEach(option => console.log(option));
});
 driver.quit();