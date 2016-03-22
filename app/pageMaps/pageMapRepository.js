"use strict";
var low = require("lowdb");
var storage = require("lowdb/file-sync");
var PAGE_MAP_DB = "pageMaps";
var PageMapRepository = (function () {
    function PageMapRepository() {
        var database = low("pageMaps.json", { storage: storage });
        this._pageMaps = database(PAGE_MAP_DB);
    }
    PageMapRepository.prototype.getAllForProvider = function (providerName) {
        return this._pageMaps.chain().filter({ "provider": providerName }).value();
    };
    PageMapRepository.prototype.updateLastProcessedDateTime = function (finder) {
        this._pageMaps.chain().find(finder).assign({ "lastProcessedDateTime": new Date().toUTCString() }).value();
    };
    return PageMapRepository;
}());
exports.pageMapRepository = new PageMapRepository();
//# sourceMappingURL=pageMapRepository.js.map