import * as sqlite3 from "sqlite3";
import * as types from "./types";
import * as async from "async";
import * as _ from "lodash";
const DATABASE_FILE = __dirname + "/routeplanner.db";

var coachTypes: types.CoachType[] = [
	{ id: 1, name: "ord", description: "Ordinary" },
	{ id: 2, name: "exp", description: "Express Services" },
	{ id: 3, name: "dlx", description: "Delux Services" },
	{ id: 4, name: "vac", description: "Volvo A/C" },
	{ id: 5, name: "hhac", description: "Hop on Hop off Mini A/C" },
	{ id: 6, name: "nser", description: "Night Services" }
];



export function writeCoachTypes(callback: (err: Error) => void) {
	var db = new sqlite3.Database(DATABASE_FILE);
	var deleteAllTask = (cb: (err: Error) => void) => {
		console.log("deleting existing records...");
		db.run("delete from coach_type", [], cb);
	};
	var insertTasks = coachTypes.map(coachType => {
		return (cb: (err: Error) => void) => {
			console.log("Inserting coach type: " + coachType.description);
			db.run(`insert
					into
					coach_type(
						id,
						name,
						description)
					values(
						 ${coachType.id},
						'${coachType.name}',
						'${coachType.description}')`,
				[],
				cb);
		}
	});

	return async.series([deleteAllTask, ...insertTasks], (err: Error) => {
		return callback(err);
	});
}

export function writeRoutes(routes: types.RouteInfo[], callback: (err: Error) => void) {
	var db = new sqlite3.Database(DATABASE_FILE);
	var deleteAllTask = (cb: (err: Error) => void) => {
		db.run("delete from route", [], cb);
	};
	var insertTasks = routes.map(route => {
		return function(cb: (err: Error) => void) {
			var originId: number = null;
			var destId: number = null;
			var coachType = coachTypes.filter(item => {
				return item.description === route.serviceType;
			})[0];


			db.get(`select id from stage where name ='${route.origin}'`, [], (err: Error, res: any) => {
				if (err) {
					return cb(err);
				}

				originId = res;
				db.get(`select id from stage where name ='${route.destination}'`, [], (err: Error, res: any) => {
					if (err) {
						return cb(err);
					}

					destId = res;
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
						${originId},
						${destId},
						${route.journeyTime},
						${coachType.id},
						1)`, /* MTC bus */
						[], cb);
				});
			});

		};
	});

	async.series([deleteAllTask, ...insertTasks], callback);
}

export function writeStages(stages: string[], callback: (err: Error) => void) {
	var db = new sqlite3.Database(DATABASE_FILE);
	var deleteAllTask = (cb: (err: Error) => void) => {
		db.run("delete from stage", [], cb);
	};
	var insertTasks = stages.map(stage => {
		return function(cb: (err: Error) => void) {
			console.log("inserting stage - " + stage);
			db.run(`insert
			into
			stage (name,
				   description)
			values(
				'${_.escape(stage) }',
				'${_.escape(stage) }')`,
				[], cb);
		};
	});

	async.series([deleteAllTask, ...insertTasks], callback);
}

export function read(cb: (err: Error, data: any[]) => void) {
	var db = new sqlite3.Database(DATABASE_FILE);
	db.all("select * from test_table", [], cb);
}