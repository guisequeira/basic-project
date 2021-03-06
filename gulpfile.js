'use strict';

var gulp          = require('gulp');
var runSequence   = require('run-sequence');

var browserSync   = require('browser-sync').create();


var htmlmin 			= require('gulp-htmlmin');


var sass 					= require('gulp-sass');
var scsslint = require('gulp-scss-lint');


var jshint = require('gulp-jshint');
var jshintXMLReporter = require('gulp-jshint-xml-file-reporter');

gulp.task('lint', function() {
  return gulp.src('./src/assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(jshintXMLReporter))
        .on('end', jshintXMLReporter.writeFile({
            format: 'jslint',
            filePath: './reports/jshint.xml'
        }));
});

gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

var csslintErrorCount = {};

gulp.task('scss-lint', function() {
  return gulp.src('src/app/scss/*.scss')
    .pipe(scsslint({
      'reporterOutputFormat': 'Checkstyle',
      'filePipeOutput': 'scssReport.xml'
    }))
    .pipe(gulp.dest('./reports'));
});


gulp.task('sass', function(){
	return gulp.src('src/app/scss/**/*.scss')
    .pipe(scsslint())
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./src/assets/css'));
});

// watch
gulp.task('watch', ['browserSync'], function(){
  gulp.watch('src/app/scss/**/*.scss', ['sass'], browserSync.reload);
  // gulp.watch('src/app/coffee/**/*.coffee', ['coffee']); 

  gulp.watch('src/*.html', browserSync.reload);
});


gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})


// browserSync
gulp.task('browserSync', function() {
  browserSync.init({
  	injectChanges: true,
    server: {
      baseDir: "src",
      routes: {
           "/bower_components": "./bower_components"
      }
    }
  })
});