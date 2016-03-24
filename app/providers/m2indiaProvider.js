/// <reference path="../../typings/main/ambient/selenium-webdriver/selenium-webdriver.d.ts" />
"use strict";
const selenium_webdriver_1 = require("selenium-webdriver");
const driver_1 = require("../driver/driver");
const pageMapRepository_1 = require("../pageMaps/pageMapRepository");
const rateRepository_1 = require("../rates/rateRepository");
const URL = "https://m2inet.icicibank.co.in/m2iNet/exchangeRate.misc";
const SCRAPE_FREQUENCY_IN_HOURS = 12;
class M2indiaProvider {
    read() {
        this._getRate();
    }
    _getRate() {
        let pageMaps = this._getPageMaps();
        for (let pageMap of pageMaps) {
            let lastScrapedBefore = pageMap.lastProcessedDateTime && ((new Date().getTime() - Date.parse(pageMap.lastProcessedDateTime)) / (1000 * 60 * 60));
            if (!lastScrapedBefore || lastScrapedBefore > SCRAPE_FREQUENCY_IN_HOURS) {
                this._scrapeRate(pageMap);
            }
        }
    }
    _scrapeRate(pageMap) {
        if (pageMap.indicative) {
            this._setSearchParameters(pageMap.currencyValue, pageMap.transferMode, pageMap.deliveryMode);
            this._getRatesForIndicative(pageMap.skipOptionClick)
                .then(result => this._processResult(pageMap, result))
                .thenCatch(err => this._handleError(pageMap, err));
        }
        if (pageMap.fixed) {
            this._setSearchParameters(pageMap.currencyValue, pageMap.transferMode, pageMap.deliveryMode);
            this._getRatesForFixed(pageMap.skipOptionClick)
                .then(result => this._processResult(pageMap, result))
                .thenCatch(err => this._handleError(pageMap, err));
        }
    }
    _processResult(pageMap, result) {
        var formattedResult = [];
        var chunkSize = 3;
        for (let i = chunkSize; i < result.length; i += chunkSize) {
            formattedResult.push(result.slice(i, i + chunkSize));
        }
        formattedResult = formattedResult.map(item => {
            if (item[0] === "Less Than") {
                item[0] = "0";
                return item;
            }
            ;
            if (item[1] === "and above") {
                item[1] = "MAX";
                return item;
            }
            ;
            return item;
        });
        console.log(formattedResult);
        rateRepository_1.rateRepository.postRate(pageMap.provider, formattedResult, err => {
            if (!err) {
                pageMapRepository_1.pageMapRepository.updateLastProcessedDateTime(pageMap);
                console.log(`Extracted ${pageMap.indicative ? "indicative" : "fixed"} rates for 
                    currency: ${pageMap.currencyValue}, transferMode:${pageMap.transferMode}, 
                    deliveryMode: ${pageMap.deliveryMode} successfully`);
            }
        });
    }
    _handleError(pageMap, err) {
        console.log(`Error while retrieving ${pageMap.indicative ? "indicative" : "fixed"}  rates for search
             parameters currency: ${pageMap.currencyValue}, transferMode:${pageMap.transferMode}, 
             deliveryMode: ${pageMap.deliveryMode}. Error: ${err.message}`);
    }
    _setSearchParameters(currency, transferMode, deliveryMode) {
        driver_1.default.get(URL);
        var locators = [
            selenium_webdriver_1.By.xpath(`//*[@id='currencyId']/option[text()='${currency}'] `),
            selenium_webdriver_1.By.xpath(`//*[@id='product']/option[text()='${transferMode}'] `),
            selenium_webdriver_1.By.xpath(`//*[@id='deliveryMode']/option[text()='${deliveryMode}']`)];
        var promises = locators.map(locator => this._waitAndClick(locator));
        return selenium_webdriver_1.promise.all(promises)
            .then(_ => console.log(`Search parameters currency: ${currency}, transferMode:${transferMode}, deliveryMode: ${deliveryMode} set successfully`))
            .thenCatch(err => console.log(`Error while setting search parameters currency: 
                ${currency}, transferMode:${transferMode}, deliveryMode: ${deliveryMode}. Error: ${err.message}`));
    }
    _getRatesForIndicative(skipOptionClick) {
        var promises = [];
        if (!skipOptionClick) {
            promises.push(this._waitAndClick(selenium_webdriver_1.By.xpath(`//*[@id='nonINRradio']/*[@id='moneyType']`)));
        }
        promises.push(driver_1.default.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath(`//*[@id="txnAmountDiv1"]/input`)), 5 * 1000)
            .then(el => el.sendKeys('1000')));
        promises.push(this._waitAndClick(selenium_webdriver_1.By.xpath(`//a[@onclick='calculate();']`)));
        return selenium_webdriver_1.promise.all(promises)
            .then(_ => this._extractRates(true))
            .then(resultPromise => selenium_webdriver_1.promise.all(resultPromise));
    }
    _getRatesForFixed(skipOptionClick) {
        var promises = [];
        if (!skipOptionClick) {
            promises.push(this._waitAndClick(selenium_webdriver_1.By.xpath(`//*[@id='INRradio']/*[@id='moneyType']`)));
        }
        promises.push(driver_1.default.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath(`//*[@id="txnAmountDiv21"]/input`)), 5 * 1000)
            .then(el => el.sendKeys('100000')));
        promises.push(this._waitAndClick(selenium_webdriver_1.By.xpath(`//a[@onclick='calculate();']`)));
        return selenium_webdriver_1.promise.all(promises)
            .then(_ => this._extractRates(false))
            .then(resultPromise => selenium_webdriver_1.promise.all(resultPromise));
    }
    _extractRates(isIndicative) {
        var path = `//*[@id="fixslabs"]/table/tbody/tr/td`;
        if (isIndicative) {
            path = `//*[@id="slabsMe"]/table/tbody/tr/td`;
        }
        return driver_1.default.wait(selenium_webdriver_1.until.elementsLocated(selenium_webdriver_1.By.xpath(path)), 5 * 1000)
            .then(els => els.map(el1 => el1.getText()));
    }
    _waitAndClick(locator) {
        return driver_1.default.wait(selenium_webdriver_1.until.elementLocated(locator), 5 * 1000)
            .then(el => el.click());
    }
    _getPageMaps() {
        return pageMapRepository_1.pageMapRepository.getAllForProvider("ICICIM2India");
    }
}
exports.M2indiaProvider = M2indiaProvider;
//# sourceMappingURL=m2indiaProvider.js.map