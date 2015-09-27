///<reference path="../typings/tsd.d.ts"/>

import webdriver = require('selenium-webdriver');
import By = webdriver.By;
import until = webdriver.until;
import _ = require("lodash");


const MTC_MAIN_URL: string = "http://www.mtcbus.org/";
const MTC_ROUTES_URL: string = "http://mtcbus.org/Routes.asp";
const MTC_STAGES_URL: string = "http://mtcbus.org/Places.asp";
export class Harvester {
	constructor(private driver: webdriver.WebDriver) {
	}

	public getRoutes(cb: (err: Error, options: string[]) => void) {
		try {
			this.driver.get(MTC_ROUTES_URL);
			return this.getValuesFromSelectOptions("cboRouteCode", cb);
		} catch (e) {
			return cb(e, null);
		}
	}

	public getStages(cb: (err: Error, options: string[]) => void) {
		try {
			this.driver.get(MTC_STAGES_URL);
			return this.getValuesFromSelectOptions("cboSourceStageName", (err, srcStages) => {
				if (err) {
					return cb(err, null);
				}

				return this.getValuesFromSelectOptions("cboDestStageName", (err, destStages) => {
					if (err) {
						return cb(err, null);
					}

					return cb(null, _.union(srcStages, destStages));
				});
			});

		} catch (e) {
			return cb(e, null);
		}
	}
	
	public getAllStagesOfARoute(route:string, cb:(err:Error, stages:string[])=>void){
		
	}

	private getValuesFromSelectOptions(elemName: string, cb: (err: Error, options: string[]) => void) {
		let results: string[] = [];

		if (!cb) {
			throw { name: "Error", message: "Callback must be specified." }
		}

		if (!elemName) {
			var error: Error = { name: "Error", message: "Element Name cannot be empty." }
			return cb(error, null);
		}

		try {
			var selectElement = this.driver.findElement(By.name(elemName));
			var options = selectElement.findElements(By.tagName("option"))
				.then(options => {
					try {
						let totalOptions = options.length;
						options.map(item => {
							try {
								item.getText()
									.then(text => {
										try {
											results.push(text);
											if (--totalOptions === 0) {
												return cb(null, results);
											}
										} catch (e) {
											return cb(e, null);
										}
									});
							} catch (e) {
								return cb(e, null);
							}
						});
					} catch (e) {
						return cb(e, null);
					}
				});
		}
		catch (e) {
			return cb(e, null);
		}
	}
}