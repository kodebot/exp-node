const LogReader = require("../data-access/log.reader");

class LogSearchService {

    constructor() {
        this._logReader = new LogReader();
    }

    search(query) {
        let filters = [];
        let pagingSetup = this._getDefaultPagingSetup();

        for (let key in query) {
            const filterData = this._getFilterData(query[key]);
            if (filterData) {
                filterData.field = key;
                filters.push(filterData);
            } else {
                this._updatePagingSetup(key, query[key], pagingSetup);
            }
        }

        return this._logReader.search(filters, pagingSetup);
    }

    _getFilterData(value) {
        const pattern = /^(\$.*\$)/;
        const regExp = new RegExp(pattern);
        const matched = value.split(regExp);
        if (matched && matched.length == 3) {
            switch (matched[1]) {
                case "$eq$":
                    return { op: "=", value: matched[2] };
                case "$like$":
                    return { op: "like", value: matched[2] };
                case "$gt$":
                    return { op: ">", value: matched[2] };
                case "$gte$":
                    return { op: ">=", value: matched[2] };
                case "$lt$":
                    return { op: "<", value: matched[2] };
                case "$lte$":
                    return { op: "<=", value: matched[2] }
            }
        }
    }

    _updatePagingSetup(setupParam, value, pagingSetup) {
        switch (setupParam) {
            case "orderBy":
                pagingSetup.orderBy = value;
                return;
            case "desc":
                pagingSetup.desc = !!value;
                return;
            case "pageNumber":
                pagingSetup.pageNumber = +value || 1;
                return;
            case "pageSize":
                pagingSetup.pageSize = +value || 25;
                return;
            default:
                console.warn("Invalid filter option or page setup received");
        }
    }

    _getDefaultPagingSetup() {
        return {
            orderBy: 'date',
            desc: false,
            pageSize: 25,
            pageNumber: 1
        };
    }
}

module.exports = LogSearchService;