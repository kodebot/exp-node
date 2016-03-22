/// <reference path="../../typings/main/ambient/selenium-webdriver/selenium-webdriver.d.ts" />
"use strict";
var selenium_webdriver_1 = require("selenium-webdriver");
var driver_1 = require("../driver/driver");
var pageMapRepository_1 = require("../pageMaps/pageMapRepository");
var URL = "https://m2inet.icicibank.co.in/m2iNet/exchangeRate.misc";
var M2indiaProvider = (function () {
    function M2indiaProvider() {
    }
    M2indiaProvider.prototype.read = function () {
        this._getRate();
    };
    M2indiaProvider.prototype._getRate = function () {
        var _this = this;
        var pageMaps = this._getPageMaps();
        var _loop_1 = function(pageMap) {
            driver_1.default.get(URL);
            this_1._setSearchParameters(pageMap.currencyValue, pageMap.transferMode, pageMap.deliveryMode);
            if (pageMap.indicative) {
                this_1._getRatesForIndicative(pageMap.skipOptionClick)
                    .then(function (result) { return _this._processResult(pageMap, result); })
                    .thenCatch(function (err) { return _this._handleError(pageMap, err); });
            }
            if (pageMap.fixed) {
                this_1._getRatesForFixed(pageMap.skipOptionClick)
                    .then(function (result) { return _this._processResult(pageMap, result); })
                    .thenCatch(function (err) { return _this._handleError(pageMap, err); });
            }
        };
        var this_1 = this;
        for (var _i = 0, pageMaps_1 = pageMaps; _i < pageMaps_1.length; _i++) {
            var pageMap = pageMaps_1[_i];
            _loop_1(pageMap);
        }
    };
    M2indiaProvider.prototype._processResult = function (pageMap, result) {
        var formattedResult = [];
        var chunkSize = 3;
        for (var i = 0; i <= result.length; i += chunkSize) {
            formattedResult.push(result.slice(i, i + chunkSize));
        }
        console.log(formattedResult.map(function (item) {
            if (item === "Less Than")
                return 0;
            if (item === "and above")
                return "MAX";
            return item;
        }));
        pageMapRepository_1.pageMapRepository.updateLastProcessedDateTime(pageMap);
        console.log("Extracted " + (pageMap.indicative ? "indicative" : "fixed") + " rates for currency: " + pageMap.currencyValue + ", transferMode:" + pageMap.transferMode + ", deliveryMode: " + pageMap.deliveryMode + " successfully");
    };
    M2indiaProvider.prototype._handleError = function (pageMap, err) {
        console.log("Error while retrieving " + (pageMap.indicative ? "indicative" : "fixed") + "  rates for search parameters currency: " + pageMap.currencyValue + ", transferMode:" + pageMap.transferMode + ", \n        deliveryMode: " + pageMap.deliveryMode + ". Error: " + err.message);
    };
    M2indiaProvider.prototype._setSearchParameters = function (currency, transferMode, deliveryMode) {
        var _this = this;
        var locators = [
            selenium_webdriver_1.By.xpath("//*[@id='currencyId']/option[text()='" + currency + "'] "),
            selenium_webdriver_1.By.xpath("//*[@id='product']/option[text()='" + transferMode + "'] "),
            selenium_webdriver_1.By.xpath("//*[@id='deliveryMode']/option[text()='" + deliveryMode + "']")];
        var promises = locators.map(function (locator) { return _this._waitAndClick(locator); });
        return selenium_webdriver_1.promise.all(promises)
            .then(function (_) { return console.log("Search parameters currency: " + currency + ", transferMode:" + transferMode + ", deliveryMode: " + deliveryMode + " set successfully"); })
            .thenCatch(function (err) { return console.log("Error while setting search parameters currency: " + currency + ", transferMode:" + transferMode + ", deliveryMode: " + deliveryMode + ". Error: " + err.message); });
    };
    M2indiaProvider.prototype._getRatesForIndicative = function (skipOptionClick) {
        var _this = this;
        var promises = [];
        if (!skipOptionClick) {
            promises.push(this._waitAndClick(selenium_webdriver_1.By.xpath("//*[@id='nonINRradio']/*[@id='moneyType']")));
        }
        promises.push(driver_1.default.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//*[@id=\"txnAmountDiv1\"]/input")), 5 * 1000)
            .then(function (el) { return el.sendKeys('1000'); }));
        promises.push(this._waitAndClick(selenium_webdriver_1.By.xpath("//a[@onclick='calculate();']")));
        return selenium_webdriver_1.promise.all(promises)
            .then(function (_) { return _this._extractRates(true); })
            .then(function (resultPromise) { return selenium_webdriver_1.promise.all(resultPromise); });
    };
    M2indiaProvider.prototype._getRatesForFixed = function (skipOptionClick) {
        var _this = this;
        var promises = [];
        if (!skipOptionClick) {
            promises.push(this._waitAndClick(selenium_webdriver_1.By.xpath("//*[@id='INRradio']/*[@id='moneyType']")));
        }
        promises.push(driver_1.default.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath("//*[@id=\"txnAmountDiv21\"]/input")), 5 * 1000)
            .then(function (el) { return el.sendKeys('100000'); }));
        promises.push(this._waitAndClick(selenium_webdriver_1.By.xpath("//a[@onclick='calculate();']")));
        return selenium_webdriver_1.promise.all(promises)
            .then(function (_) { return _this._extractRates(false); })
            .then(function (resultPromise) { return selenium_webdriver_1.promise.all(resultPromise); });
    };
    M2indiaProvider.prototype._extractRates = function (isIndicative) {
        var path = "//*[@id=\"fixslabs\"]/table/tbody/tr/td";
        if (isIndicative) {
            path = "//*[@id=\"slabsMe\"]/table/tbody/tr/td";
        }
        return driver_1.default.wait(selenium_webdriver_1.until.elementsLocated(selenium_webdriver_1.By.xpath(path)), 5 * 1000)
            .then(function (els) { return els.map(function (el1) { return el1.getText(); }); });
    };
    M2indiaProvider.prototype._waitAndClick = function (locator) {
        return driver_1.default.wait(selenium_webdriver_1.until.elementLocated(locator), 5 * 1000)
            .then(function (el) { return el.click(); });
    };
    M2indiaProvider.prototype._getPageMaps = function () {
        return pageMapRepository_1.pageMapRepository.getAllForProvider("ICICIM2India");
    };
    return M2indiaProvider;
}());
exports.M2indiaProvider = M2indiaProvider;
//# sourceMappingURL=m2indiaProvider.js.map