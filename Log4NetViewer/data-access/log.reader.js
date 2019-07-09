const sql = require("mssql/msnodesqlv8");

const appSettings = require("../core/app-settings");

const config = {
    connectionString: `${appSettings.connectionStrings.logging}`,
};

class LogReader {

    search(filters, pagingSetup) {
        const query = this._buildQuery(filters, pagingSetup);
        return this._runQuery(query, filters);
    }

    _runQuery(query, filters) {
        return new Promise((resolve, reject) => {

            sql.connect(config)
                .then(pool => {
                    let request = pool.request();
                    filters.forEach(filter => {
                        if (this._isValidField(filter.field)) {
                            request = request.input(filter.field, filter.value);
                        }
                    });
                    return request.query(query);
                }).then(result => {
                    resolve(result)
                    sql.close();
                }).catch(err => {
                    console.error(err);
                    reject(err);
                });
        })
    }

    _buildQuery(filters, pagingSetup) {
        /** DO NOT append user input - use input (parameter) for adding user input to query to avoid sql injection*/

        const filterTemplate = (field, op) => `(@${field} is null or ${field} ${op} @${field})`;
        const pagingTemplate = (orderBy, desc, pageNumber, pageSize) =>
            `order by ${orderBy} ${desc?'desc':''} offset ${(pageNumber-1) * pageSize} rows fetch next ${pageSize} rows only`;
        const queryTemplate = (filterQuerySection, pagingQuerySection) => `select * from logging.log4net.Log ${filterQuerySection?' where ': ''} ${filterQuerySection} ${pagingQuerySection}`

        const filterQuerySection = filters
            .map(filter => this._buildFilterSection(filter, filterTemplate))
            .filter(filter => !!filter)
            .join(" and ");
        const pagingQuerySection = pagingTemplate(pagingSetup.orderBy, pagingSetup.desc, pagingSetup.pageNumber, pagingSetup.pageSize);

        return queryTemplate(filterQuerySection, pagingQuerySection);
    }

    _buildFilterSection(filter, filterTemplate) {
        if (this._isValidField(filter.field) && this._isValidOp(filter.op)) {
            return filterTemplate(filter.field, filter.op);
        }
        return null;
    }

    _isValidField(field) {
        const validFields = ['date', 'logger', 'message', 'exception', 'level'];
        const normalisedField = field.toLowerCase();
        return (validFields.indexOf(normalisedField) > -1);
    }

    _isValidOp(op) {
        const validOps = ['like', '>', '>=', '<', '<=', '='];
        const normalisedOp = op.toLowerCase();
        return (validOps.indexOf(normalisedOp) > -1);
    }
}

module.exports = LogReader;