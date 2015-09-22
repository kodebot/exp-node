///<reference path="../typings/tsd.d.ts"/>

import webdriver = require('selenium-webdriver');
import By = webdriver.By;
import until = webdriver.until;

const MTC_MAIN_URL: string = "http://www.mtcbus.org/";
const MTC_ROUTES_URL: string = "http://mtcbus.org/Routes.asp";


export class Harvester{
	constructor(private driver:webdriver.WebDriver){
	}
	
	getRoutes(cb:(options:string[]) => void){
		let routes: string[] = [];
		this.driver.get(MTC_ROUTES_URL);
			
		var selectElement = this.driver.findElement(By.name("cboRouteCode"));
		var options = selectElement.findElements(By.tagName("option"))
		.then(options => {
			let totalOptions = options.length;
			options.map(item => {
						item.getText()
							.then(text => {
										routes.push(text);
										if(--totalOptions === 0){
											cb(routes);
										}
				});
			});
		});
	}
}