const gulp = require("gulp");
const argv = require('yargs').argv;
const runSequence = require("run-sequence");
const sourcemaps = require("gulp-sourcemaps");
const nodemon = require("gulp-nodemon");
const rimraf = require("rimraf");
const path = require("path");

// Clean
const CLEAN_BUILD = "clean:build";
const CLEAN_COVERAGE = "clean:coverage";
const CLEAN_DOC = "clean:doc";

// Lint
const TSLINT = "tslint";
const TSLINT_DEV = "tslint:dev";

// Build
const COMPILE_TYPESCRIPT = "compile:typescript";
const BUILD = "build";

// Test
const PRETEST = "pretest";
const RUN_TESTS = "run:tests";
const RUN_TESTS_COVERAGE = "run:tests:coverage";
const COVERAGE = "coverage";
const TEST = "test";
const WATCH = "watch";
const SERVE = "serve";

const TS_SRC_GLOB = "./src/**/*.ts";
const TS_TEST_GLOB = "./tests/**/*.ts";
const TS_TEST_UNIT = "./tests/Unit/*.ts";
const JS_TEST_UNIT = "./dist/tests/Unit/";
const JS_TEST_ACCEPTANCE = "./dist/tests/Acceptance/";
const JS_TEST_GLOB = "./dist/tests/*/";
const TS_GLOB = [TS_SRC_GLOB, TS_TEST_GLOB];

// Removes the ./build directory with all its content.
gulp.task(CLEAN_BUILD, function (callback) {
  rimraf("./dist", callback);
});

// Removes the ./coverage directory with all its content.
gulp.task(CLEAN_COVERAGE, function (callback) {
  rimraf("./coverage", callback);
});

// Checks source *.ts-files if they are conform to the rules specified in tslint.json.
gulp.task(TSLINT, function () {
  const tslint = require("gulp-tslint");
  return gulp.src(TS_SRC_GLOB)
    .pipe(tslint({
      configuration: "tslint.json"
    }))
    .pipe(tslint.report({
      // set this to true, if you want the build process to fail on tslint errors.
      emitError: true
    }));
});

// Checks all *.ts-files if they are conform to the rules specified in tslint.json. WON'T ERROR ON LINTING ERROR.
gulp.task(TSLINT_DEV, function () {
  const tslint = require("gulp-tslint");
  return gulp.src(TS_GLOB)
    .pipe(tslint({
      configuration: "tslint.json"
    }))
    .pipe(tslint.report({
      // set this to true, if you want the build process to fail on tslint errors.
      emitError: false
    }));
});

// Compiles all *.ts-files to *.js-files.
gulp.task(COMPILE_TYPESCRIPT, function () {
  const ts = require("gulp-typescript");
  const tsProject = ts.createProject("tsconfig.json");

  return gulp.src(TS_GLOB, {
      base: "./"
    })
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist"));
});

// Runs all required steps for the build in sequence.
gulp.task(BUILD, function (callback) {
  runSequence(CLEAN_BUILD, COMPILE_TYPESCRIPT, callback);
});

// Runs the build task and starts the server every time changes are detected.
gulp.task(WATCH, [BUILD], function () {
  return nodemon({
    ext: "ts js json",
    script: "dist/src/app.js",
    watch: ["src/*", "tests/*"],
    tasks: [BUILD]
  });
});

// Runs the build task and starts the server once.
gulp.task(SERVE, [BUILD], function () {
  require("./dist/src/app");
});

// Sets environment variable for testing
gulp.task(PRETEST, function () {
  process.env.NODE_ENV = 'test';
});

// Runs all required steps for testing in sequence.
gulp.task(TEST, function (callback) {
  runSequence(BUILD, RUN_TESTS, callback);
});

// Runs all required steps for coverage in sequence.
gulp.task(COVERAGE, function (callback) {
  runSequence(CLEAN_COVERAGE, RUN_TESTS_COVERAGE, callback);
});

// Run the tests via mocha
gulp.task(RUN_TESTS, [PRETEST], function (callback) {
  var mochaError;
  const mocha = require("gulp-mocha");

  var testFolder = JS_TEST_GLOB;
  if (argv.acceptance === true) {
    console.log("Running Acceptance Tests...");
    testFolder = JS_TEST_ACCEPTANCE;
  } else if (argv.unit === true) {
    console.log("Running Unit Tests...");
    testFolder = JS_TEST_UNIT;
  }

  gulp.src(testFolder, {
      read: false
    })
    .pipe(mocha({
      reporter: "nyan"
    }))
    .on("error", function (err) {
      mochaError = err;
    })
    .on("end", function () {
      callback(mochaError);
    });
});

// Run unit tests via mocha and generate a coverage report.
gulp.task(RUN_TESTS_COVERAGE, [PRETEST], function (callback) {
  const exec = require('child_process').exec;
  const nyc_path = '.' + path.sep + 'node_modules' + path.sep + 'nyc' + path.sep + 'bin' + path.sep + 'nyc.js';
  const mocha_path = '.' + path.sep + 'node_modules' + path.sep + 'mocha' + path.sep + 'bin' + path.sep + 'mocha';

  const nyc_cmd = nyc_path + ' --reporter=html --reporter=text';
  const mocha_cmd = mocha_path + ' ' + TS_TEST_UNIT + ' --reporter=nyan';

  exec('node ' + nyc_cmd + ' ' + mocha_cmd, function (err, stdout, stderr) {
    console.log(stdout);
    if (!err) {
      console.log("--> For a more detailed report, check the ./coverage directory <--");
    }
    callback(err);
  });
});
