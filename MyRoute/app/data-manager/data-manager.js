var Sqlite = require("nativescript-sqlite");
var dialogs = require("ui/dialogs");
var dbname = "routeplanner.db";
var db = null;

// function init() {
// 	copyDatabase();
// }

copyDatabase();

function copyDatabase() {
	if (!Sqlite.exists(dbname)) {
		Sqlite.copyDatabase(dbname);
	}
}

function getAllStages(cb) {
	new Sqlite(dbname, function (err, db) {
		db.all("select * from stage", [], function (err, rows) {
			cb(err, rows);
		});
	});
}


exports.getAllStages = getAllStages;

