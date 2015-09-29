///<reference path="../typings/tsd.d.ts"/>

import webdriver = require('selenium-webdriver');
import By = webdriver.By;
import until = webdriver.until;
import _ = require("lodash");
import q = require("q");
import types = require("types");


const MTC_MAIN_URL: string = "http://www.mtcbus.org/";
const MTC_ROUTES_URL: string = "http://mtcbus.org/Routes.asp";
const MTC_STAGES_URL: string = "http://mtcbus.org/Places.asp";
const MTC_ROUTES_SELECT_ELEM: string = "cboRouteCode";
const MTC_ROUTE_INFO_TABLE_XPATH: string = "/html/body/table/tbody/tr[1]/td[2]/table/tbody/tr/td/table/tbody/tr[7]/td/table/tbody/";
export class Harvester {
	constructor(private driver: webdriver.WebDriver) {
	}

	public getRoutes(cb: (err: Error, options: string[]) => void) {
		try {
			this.driver.get(MTC_ROUTES_URL);
			return this.getValuesFromSelectOptions(MTC_ROUTES_SELECT_ELEM, cb);
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

	public getAllStagesOfAllRoute(cb: (err: Error, stages: { [index: string]: string[] }) => void) {
		try {
			this.driver.get(MTC_ROUTES_URL);

			this.getRoutes((err, options) => {
				var actions: any[] = [];

				options.forEach((option, index) => {
					actions.push(this.driver.findElements(By.tagName("option"))
						.then(elems => elems[index].click())
						.then(_ => this.driver.findElement(By.name("submit")))
						.then(elem => elem.click())
						.then(() => this.getRouteInfo(this.driver)));
				});

				return q.all(actions).then(data => console.log(data));

			});



		} catch (e) {
			return cb(e, null);
		}
	}

	private getRouteInfo(driver: webdriver.WebDriver) {
		let routeDetailXpath = MTC_ROUTE_INFO_TABLE_XPATH + "tr[3]/td";

		let routeInfo: types.RouteInfo = {
			routeNo: "", serviceType: "", origin: "", destination: "", journeyTime: 0, stages: []
		};
		var pr1 = driver.findElements(By.xpath(routeDetailXpath))
			.then(elems => {
				return q.all<any>([elems[0].getText().then(text=> routeInfo.routeNo = text),
					elems[1].getText().then(text=> routeInfo.serviceType = text),
					elems[2].getText().then(text=> routeInfo.origin = text),
					elems[3].getText().then(text=> routeInfo.destination = text),
					elems[4].getText().then(text=> routeInfo.journeyTime = parseInt(text))
				]);
			});

		var pr2 = driver.findElements(By.xpath(MTC_ROUTE_INFO_TABLE_XPATH + "tr"))
			.then(elems => {
				var actions = elems.map((elem, index) => {
					if (index > 4 && index < elems.length - 2) {
						return elems[index].findElements(By.tagName("td"))
							.then(tds => tds[1].getText().then(text => routeInfo.stages.push(text)));
					}
				});

				return q.all(actions);
			});

		return q.all<any>([pr1, pr2])
			.then(_ => routeInfo);
	}

	private getStagesOfARoute(text: string, cb: (err: Error, states: { [index: string]: string[] }) => void) {
		let stages: { [index: string]: string[] } = {};
		console.log(text);
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