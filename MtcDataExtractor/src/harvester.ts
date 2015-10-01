///<reference path="../typings/tsd.d.ts"/>

import {By, until, WebDriver} from "selenium-webdriver";
import * as _ from "lodash";
import * as q from "q";
import * as types  from "types";

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
		this.driver.get(MTC_ROUTES_URL);
		this.getRoutes((err, options) => {
			q.all(options.map((option, index) => {
				if (index < 3) {
					return this.driver.findElements(By.tagName("option"))
						.then(elems => elems[index].click())
						.then(_ => this.driver.findElement(By.name("submit")))
						.then(elem => elem.click())
						.then(() => this.getRouteInfo(this.driver))
						.thenCatch(err => cb(err, null));
				}
			}))
				.then(routeInfo => console.log(routeInfo.filter(route => route !== undefined)))
				.catch(err => console.error(err));
		});
	}

	public getRoutesBetweenAllStages() {
		this.driver.get(MTC_STAGES_URL);
		this.getStages((err, stages) => {

			this.driver.findElement(By.name("cboSourceStageName"))
				.findElement(By.xpath(`/html/body/table/tbody/tr[1]/td[2]/table/tbody/tr[9]/td[3]/select/option[contains(.,'C.M.B.T')]`))
				.click()
				.then(__ => {
					return this.driver.findElement(By.name("cboDestStageName"))
						.findElement(By.xpath(`/html/body/table/tbody/tr[1]/td[2]/table/tbody/tr[9]/td[3]/select/option[contains(.,'C.M.B.T')]`))
						.click();
				})
				.then(__ => {
					this.driver.findElement(By.name("submit"));
					return this.driver.findElement(By.name("dfdfsf"));
				});


			// for (var i = 0; i < stages.length - 2; i++) {
			// 	for (var j = 1; j < stages.length - 1; j++) {

			// 		this.driver.findElement(By.name("cboSourceStageName"));
			// 		this.driver.findElements(By.tagName("option"))
			// 			.then(options => {
			// 				options[i].click();
			// 				this.driver.findElement(By.name("cboDestStageName"));
			// 				return this.driver.findElements(By.tagName("option"))
			// 					.then(options1 => {
			// 						options1[j].click();
			// 						this.driver.findElement(By.name("submit"));
			// 						return this.driver.findElements(By.xpath("/html/body/table/tbody/tr[1]/td[2]/table/tbody/tr[11]/td/table/tbody/tr"))
			// 							.then(trs => {
			// 								if (trs.length > 2) {
			// 									trs.forEach((tr, index) => {
			// 										if (index > 1 && index < trs.length - 1) {
			// 											return tr.getText()
			// 												.then(text => console.log(text));
			// 										}
			// 									})
			// 								}
			// 							});
			// 					});
			// 			});
			// 	}
			// }

		});
	}


	private getRouteInfo(driver: webdriver.WebDriver) {
		let routeDetailXpath = MTC_ROUTE_INFO_TABLE_XPATH + "tr[3]/td";
		let routeInfo: types.RouteInfo = {
			routeNo: "", serviceType: "", origin: "", destination: "", journeyTime: 0, stages: []
		};

		driver.findElements(By.xpath(routeDetailXpath))
			.then(elems => {
				return q.all<any>([elems[0].getText(),
					elems[1].getText(),
					elems[2].getText(),
					elems[3].getText(),
					elems[4].getText()])
					.then(routeData => {
						routeInfo.routeNo = routeData[0];
						routeInfo.serviceType = routeData[1];
						routeInfo.origin = routeData[2];
						routeInfo.destination = routeData[3];
						routeInfo.journeyTime = routeData[4];
						return routeInfo;
					});
			});

		driver.findElements(By.xpath(MTC_ROUTE_INFO_TABLE_XPATH + "tr"))
			.then(elems => {
				return q.all(elems.map((elem, index) => {
					if (index > 4 && index < elems.length - 2) {
						return elems[index].findElements(By.tagName("td"))
							.then(tds => tds[1].getText());
					}
				}).filter(item => item !== undefined))
					.then(stages => {
						routeInfo.stages = stages;
						return routeInfo;
					});
			});

		return q.when(routeInfo);
	}

	private getStagesOfARoute(text: string, cb: (err: Error, states: { [index: string]: string[] }) => void) {
		let stages: { [index: string]: string[] } = {};
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

		this.driver.findElement(By.name(elemName))
			.then(selectElement => selectElement.findElements(By.tagName("option")))
			.then(options => q.all(options.map(item => item.getText())).then(results => cb(null, results)))
			.thenCatch(err => cb(err, null))
	}
}