/// <reference path="../../typings/main/ambient/selenium-webdriver/selenium-webdriver.d.ts" />

import {By, until, promise, error} from "selenium-webdriver";
import driver from "../driver/driver";
import {Currency} from "../model/model";
import {pageMapRepository} from "../pageMaps/pageMapRepository";
import {rateRepository} from "../rates/rateRepository";

const URL: string = "https://m2inet.icicibank.co.in/m2iNet/exchangeRate.misc";
const SCRAPE_FREQUENCY_IN_HOURS = 12;

export class M2indiaProvider {
    read() {
        this._getRate();
    }

    private _getRate() {
        let pageMaps = this._getPageMaps();
        for (let pageMap of pageMaps) {
            let lastScrapedBefore = pageMap.lastProcessedDateTime && ((new Date().getTime() - Date.parse(pageMap.lastProcessedDateTime)) / (1000 * 60 * 60));
            if (!lastScrapedBefore || lastScrapedBefore > SCRAPE_FREQUENCY_IN_HOURS) {
                this._scrapeRate(pageMap);
            }
        }
    }

    private _scrapeRate(pageMap) {
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

    private _processResult(pageMap, result) {
        var formattedResult = [];

        var chunkSize = 3;
        for (let i = chunkSize; i < result.length; i += chunkSize) {
            formattedResult.push(result.slice(i, i + chunkSize));
        }
        formattedResult = formattedResult.map(item => {
            if (item[0] === "Less Than") {item[0] = "0"; return item;};
            if (item[1] === "and above") {item[1] = "MAX"; return item;};
            return item;
        });
        console.log(formattedResult);
        rateRepository.postRate(pageMap.provider, formattedResult, err => {
            if (!err) {
                pageMapRepository.updateLastProcessedDateTime(pageMap);
                console.log(`Extracted ${pageMap.indicative ? "indicative" : "fixed"} rates for 
                    currency: ${pageMap.currencyValue}, transferMode:${pageMap.transferMode}, 
                    deliveryMode: ${pageMap.deliveryMode} successfully`);
            }
        });

    }

    private _handleError(pageMap, err) {
        console.log(`Error while retrieving ${pageMap.indicative ? "indicative" : "fixed"}  rates for search
             parameters currency: ${pageMap.currencyValue}, transferMode:${pageMap.transferMode}, 
             deliveryMode: ${pageMap.deliveryMode}. Error: ${err.message}`);
    }

    private _setSearchParameters(currency, transferMode, deliveryMode) {
        driver.get(URL);
        var locators = [
            By.xpath(`//*[@id='currencyId']/option[text()='${currency}'] `),
            By.xpath(`//*[@id='product']/option[text()='${transferMode}'] `),
            By.xpath(`//*[@id='deliveryMode']/option[text()='${deliveryMode}']`)];

        var promises = locators.map(locator => this._waitAndClick(locator));

        return promise.all(promises)
            .then(_ => console.log(`Search parameters currency: ${currency}, transferMode:${transferMode}, deliveryMode: ${deliveryMode} set successfully`))
            .thenCatch(err => console.log(`Error while setting search parameters currency: 
                ${currency}, transferMode:${transferMode}, deliveryMode: ${deliveryMode}. Error: ${err.message}`));
    }

    private _getRatesForIndicative(skipOptionClick) {
        var promises = [];
        if (!skipOptionClick) {
            promises.push(this._waitAndClick(By.xpath(`//*[@id='nonINRradio']/*[@id='moneyType']`)));
        }
        promises.push(driver.wait(until.elementLocated(By.xpath(`//*[@id="txnAmountDiv1"]/input`)), 5 * 1000)
            .then(el => el.sendKeys('1000')));
        promises.push(this._waitAndClick(By.xpath(`//a[@onclick='calculate();']`)));

        return promise.all(promises)
            .then(_ => this._extractRates(true))
            .then(resultPromise => promise.all(resultPromise));
    }

    private _getRatesForFixed(skipOptionClick) {
        var promises = [];
        if (!skipOptionClick) {
            promises.push(this._waitAndClick(By.xpath(`//*[@id='INRradio']/*[@id='moneyType']`)));
        }

        promises.push(driver.wait(until.elementLocated(By.xpath(`//*[@id="txnAmountDiv21"]/input`)), 5 * 1000)
            .then(el => el.sendKeys('100000')));
        promises.push(this._waitAndClick(By.xpath(`//a[@onclick='calculate();']`)));

        return promise.all(promises)
            .then(_ => this._extractRates(false))
            .then(resultPromise => promise.all(resultPromise));
    }

    private _extractRates(isIndicative) {
        var path = `//*[@id="fixslabs"]/table/tbody/tr/td`

        if (isIndicative) {
            path = `//*[@id="slabsMe"]/table/tbody/tr/td`;
        }

        return driver.wait(until.elementsLocated(By.xpath(path)), 5 * 1000)
            .then(els => els.map(el1 => el1.getText()));
    }

    private _waitAndClick(locator: webdriver.Locator) {
        return driver.wait(until.elementLocated(locator), 5 * 1000)
            .then(el => el.click());
    }

    private _getPageMaps(): any[] {
        return pageMapRepository.getAllForProvider("ICICIM2India");
    }

}