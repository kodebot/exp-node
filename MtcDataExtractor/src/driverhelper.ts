///<reference path="../typings/tsd.d.ts"/>

import {WebDriver, Builder} from "selenium-webdriver";

export class DriverHelper {
	public getDriver(): WebDriver {
		var driver = new Builder()
			.forBrowser('firefox')
			.build();

		driver.manage().timeouts().implicitlyWait(10 * 1000);
		return driver;
	}
}