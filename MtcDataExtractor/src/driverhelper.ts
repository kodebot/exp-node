///<reference path="../typings/tsd.d.ts"/>

import webdriver = require('selenium-webdriver');

export class DriverHelper{
	
	public getDriver():webdriver.WebDriver{
		var driver =  new webdriver.Builder()
		.forBrowser('firefox')
		.build();
		
		driver.manage().timeouts().implicitlyWait(10*1000);
		return driver;
	}
}