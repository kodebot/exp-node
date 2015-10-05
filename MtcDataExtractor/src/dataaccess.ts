import * as sqlite3 from "sqlite3";
import * as types from "./types";
import * as async from "async";
import * as _ from "lodash";
const DATABASE_FILE = __dirname + "/routeplanner.db";

export function writeRoutes(routes: types.RouteInfo[], callback: (err: Error) => void) {
	var db = new sqlite3.Database(DATABASE_FILE);

	var insertTasks = routes.map(route => {
		return function(cb: (err: Error) => void) {
			db.run(`insert
			into
			route (
					name,
					description,
					origin,
					destination,
					duration,
					coach_type,
					transport_type)
			values(
				'${route.routeNo}',
				'${route.routeNo}',
				'${route.origin}',
				'${route.destination}',
				${route.journeyTime},
				1,
				1)`, /* MTC bus */
				[], cb);
		};
	});

	async.series(insertTasks, callback);
}

export function writeStages(stages: string[], callback: (err: Error) => void) {
	var db = new sqlite3.Database(DATABASE_FILE);
	var insertTasks = stages.map(stage => {
		return function(cb: (err: Error) => void) {
			console.log("inserting stage - " + stage);
			db.run(`insert
			into
			stage (name,
				   description)
			values(
				'${_.escape(stage)}',
				'${_.escape(stage)}')`,
				[], cb);
		};
	});

	async.series(insertTasks, callback);
}

export function read(cb: (err: Error, data: any[]) => void) {
	var db = new sqlite3.Database(DATABASE_FILE);
	db.all("select * from test_table", [], cb);
}