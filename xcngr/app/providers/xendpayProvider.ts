import {By, until, promise} from "selenium-webdriver"
import driver from "../driver/driver";

const URL: string = "https://secure.xendpay.com/quote/start/GB/en";
export class XendPayProvider {

    // https://secure.xendpay.com/quote/start/GB/en

    // payment amount - #paymentAmount
    // source currency - #paymentCurrencies > option[text() GBP] , EUR, USD

    // Target - #deliveryCountries > option[India]

    // Amount - #deliveryAmount


    getRates() {
        this._getRates();
    }

    private _getRates() {
        let pageMaps = this._getPageMaps();
        for (let pageMap of pageMaps) {
            if (pageMap.isActive && pageMap.indicative) {
                this._getIndicativeRate(pageMap);
            }
        }
    }

    private _getIndicativeRate(pageMap) {
        driver.get(URL);
     

        driver.wait(until.elementLocated(By.css("#paymentAmount")), 5 * 1000)
            .then(el => el.sendKeys("1"));
            
             //  driver.wait(until.elementLocated(By.xpath(`//*[@id="paymentCurrencies"]/option[text()="${pageMap.currencyValue}"]`)), 15 * 1000)
            //.then(el => el.click());

        driver.findElement(By.xpath(`//*[@id='deliveryCountries']/option[text()='India']`))
             .then(el => el.click())

        // driver.findElement(By.css("#deliveryAmount"))
        //     .then(el => el.getText().then(text => console.log(text)));
    }

    private _getPageMaps() {
        return [
            {
                "provider": "XendPay",
                "currencyId": "EURO",
                "currencyValue": "EUR",
                "fixed": false,
                "indicative": true,
                "isActive": true
            },
            {
                "provider": "XendPay",
                "currencyId": "GBP",
                "currencyValue": "GBP",
                "fixed": false,
                "indicative": true,
                "isActive": true
            },
            {
                "provider": "XendPay",
                "currencyId": "USD",
                "currencyValue": "USD",
                "fixed": false,
                "indicative": true,
                "isActive": true
            }
        ];
    }

}