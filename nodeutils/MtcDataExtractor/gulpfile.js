var gulp = require("gulp");
var typeScript = require("gulp-typescript");
var shell = require("gulp-shell");
var del = require("del");

var jsSrcPath = "srcjs";
var mainFile = "main.js";

gulp.task("clean", function(){
	return del([jsSrcPath]);
});

gulp.task("transpile", ["clean"], function(){
	var tsResult = gulp
					.src("src/**/*.ts")
					.pipe(typeScript({noImplicitAny: true, "module":"commonjs"}));
	
	return tsResult
			.js
			.pipe(gulp.dest(jsSrcPath));
});

gulp.task("run", ["transpile"], shell.task("node .\\srcjs\\main.js"));

gulp.task("default", ["run"]);

