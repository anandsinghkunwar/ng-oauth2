var gulp = require('gulp');
var browserify = require('browserify');
var karma = require('karma').server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './src');

// tests
var testDirectory = path.join(rootDirectory, './test/unit');

var sourceFiles = [

    // Add all ts files
    path.join(sourceDirectory, '/**/*.ts'),

];

var lintFiles = [
    'gulpfile.js',
    // Karma configuration
    'karma-*.conf.js'
].concat(sourceFiles);

// Creating Typescript Project from tsconfig.json
var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
    var tsResult = gulp.src(sourceFiles)
        .pipe(tsProject());
    // .pipe(concat('ng-oauth2.js'))
    return tsResult.js.pipe(gulp.dest('./build/'))
        .pipe(uglify())
        .pipe(rename('ng-oauth2.min.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('browserify', function() {
    var tsResult = gulp.src(sourceFiles)
        .pipe(tsProject());
    var b = browserify({
        entries: ['./build/main.js']
    });
    return b.bundle()
        .pipe(source('ng-oauth2.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(gulp.dest('./examples/frontend/public/'))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        // .on('error', gutil.log)
        // .pipe(sourcemaps.write('./dist/'))
        .pipe(rename('ng-oauth2.min.js'))
        .pipe(gulp.dest('./dist/'));
});

/**
 * Process
 */
gulp.task('process-all', function(done) {
    // runSequence('tslint', 'test-src', 'build', done);
    runSequence('tslint', 'build', 'browserify', done);
});

/**
 * Watch task
 */
gulp.task('watch', function() {

    // Watch JavaScript files
    gulp.watch(sourceFiles, ['process-all']);

    // watch test files and re-run unit tests when changed
    // TODO: Tests are right now commented as they will be supported in the future
    // and not right now
    // gulp.watch(path.join(testDirectory, '/**/*.js'), ['test-src']);
});

/**
 * Validate source TypeScript
 */
gulp.task('tslint', function() {
    return gulp.src(lintFiles)
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report());
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function() {
    return gulp.src(lintFiles)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

/**
 * Run test once and exit
 */
gulp.task('test-src', function(done) {
    karma.start({
        configFile: __dirname + '/karma-src.conf.js',
        singleRun: true
    }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function(done) {
    karma.start({
        configFile: __dirname + '/karma-dist-concatenated.conf.js',
        singleRun: true
    }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function(done) {
    karma.start({
        configFile: __dirname + '/karma-dist-minified.conf.js',
        singleRun: true
    }, done);
});

gulp.task('default', function() {
    runSequence('process-all', 'watch');
});
