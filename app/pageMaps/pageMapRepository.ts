import low = require("lowdb");
import * as storage from "lowdb/file-sync";
const PAGE_MAP_DB = "pageMaps";
class PageMapRepository {
    private _pageMaps;

    constructor() {
        var database = low("pageMaps.json", { storage: storage });
        this._pageMaps = database(PAGE_MAP_DB);
    }

    getAllForProvider(providerName:any):any[] {
        return this._pageMaps.chain().filter({"provider":providerName}).value();
    }

    updateLastProcessedDateTime(finder: any) {
        this._pageMaps.chain().find(finder).assign({ "lastProcessedDateTime": new Date().toUTCString() }).value();
    }
}

export var pageMapRepository = new PageMapRepository();


