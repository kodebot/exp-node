"use strict";
const selenium_webdriver_1 = require("selenium-webdriver");
const driver_1 = require("../driver/driver");
const URL = "https://secure.xendpay.com/quote/start/GB/en";
class XendPayProvider {
    // https://secure.xendpay.com/quote/start/GB/en
    // payment amount - #paymentAmount
    // source currency - #paymentCurrencies > option[text() GBP] , EUR, USD
    // Target - #deliveryCountries > option[India]
    // Amount - #deliveryAmount
    getRates() {
        this._getRates();
    }
    _getRates() {
        let pageMaps = this._getPageMaps();
        for (let pageMap of pageMaps) {
            if (pageMap.isActive && pageMap.indicative) {
                this._getIndicativeRate(pageMap);
            }
        }
    }
    _getIndicativeRate(pageMap) {
        driver_1.default.get(URL);
        driver_1.default.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.css("#paymentAmount")), 5 * 1000)
            .then(el => el.sendKeys("1"));
        //  driver.wait(until.elementLocated(By.xpath(`//*[@id="paymentCurrencies"]/option[text()="${pageMap.currencyValue}"]`)), 15 * 1000)
        //.then(el => el.click());
        driver_1.default.findElement(selenium_webdriver_1.By.xpath(`//*[@id='deliveryCountries']/option[text()='India']`))
            .then(el => el.click());
        // driver.findElement(By.css("#deliveryAmount"))
        //     .then(el => el.getText().then(text => console.log(text)));
    }
    _getPageMaps() {
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
exports.XendPayProvider = XendPayProvider;
//# sourceMappingURL=XendPayProvider.js.map