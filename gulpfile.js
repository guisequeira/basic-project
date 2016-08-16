'use strict';

var gulp          = require('gulp');
var runSequence   = require('run-sequence');

var browserSync   = require('browser-sync').create();


var htmlmin 			= require('gulp-htmlmin');


var sass 					= require('gulp-sass');
var scsslint = require('gulp-scss-lint');

gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('scss-lint', function() {
  return gulp.src('src/app/scss/*.scss')
    .pipe(scsslint());
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