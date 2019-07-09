"use strict";
const low = require("lowdb");
const storage = require("lowdb/file-sync");
const PAGE_MAP_DB = "pageMaps";
class PageMapRepository {
    constructor() {
        var database = low("pageMaps.json", { storage: storage });
        this._pageMaps = database(PAGE_MAP_DB);
    }
    getAllForProvider(providerName) {
        return this._pageMaps.chain().filter({ "provider": providerName }).value();
    }
    updateLastProcessedDateTime(finder) {
        this._pageMaps.chain().find(finder).assign({ "lastProcessedDateTime": new Date().toUTCString() }).value();
    }
}
exports.pageMapRepository = new PageMapRepository();
//# sourceMappingURL=pageMapRepository.js.map