'use strict';

var gulp          = require('gulp');
var runSequence   = require('run-sequence');

var browserSync   = require('browser-sync').create();


var htmlmin 			= require('gulp-htmlmin');


var sass 					= require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var through = require('through2');

gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

var csslintErrorCount = {};

gulp.task('scss-lint', function() {
  var gutil = require('gulp-util');
  var errors = {
      'known-properties' : 0,
      //'display-property-grouping',
      //'compatible-vendor-prefixes',
      'regex-selectors' : 0,
      'duplicate-background-images' : 2,
      'duplicate-properties' : 0,
      'empty-rules' : 0,
      'import' : 0,
      'selector-max' : 5000000,
      'universal-selector' : 3,
      'unqualified-attributes' : 0,
      'vendor-prefix' : 0
  };

  var customReporter = function() {
    return through.obj(function(file, enc, cb) {
      var foundErrors = [];
      //gutil.log(gutil.colors.cyan(file.csslint.errorCount)+' errors in '+gutil.colors.magenta(file.path));

      var reportFile = file.csslint || 0;

      if (reportFile) {

        if(!file.csslint.results) {
          gutil.log(gutil.colors.cyan(' No results for '+gutil.colors.magenta(file.path)));
          return cb(null, file);
        }

        file.csslint.results.forEach(function(result) {
          var isError = false;
          _.forOwn(errors, function(c, e){
            if(result.error.rule.id === e)
            {
              var count = csslintErrorCount[e];
              if(!count){
                count = 1;
              }
              else{
                count++;
              }
              csslintErrorCount[e] = count;
              foundErrors.push(result);
            }
          });
        });

        gutil.log(gutil.colors.cyan(foundErrors.length) +
        ' filtered errors in '+gutil.colors.magenta(file.path));
        foundErrors.forEach(function(result) {
          gutil.log(result.error.rule.id + ' - ' + result.error.message +
          ' on line '+result.error.line);
          gutil.log(gutil.colors.yellow(result.error.evidence));
        });

        //Should break build because of errors?

      }

      var shouldBreakBuild = false;

      if(foundErrors.length){
        _.forOwn(errors,function(c, e){
          if(csslintErrorCount[e] > c){
            gutil.log(gutil.colors.red(e + ' - ' + csslintErrorCount[e] +
            ' errors. Exceeds global project accepted count (' + c + ').'));
            shouldBreakBuild = true;
          }
          else{
            if(csslintErrorCount[e]){
                gutil.log(gutil.colors.magenta(e + ' - ' +
                csslintErrorCount[e] +
                ' errors. Under global accepted count (' + c + ').'));
            }
            //shouldBreakBuild = true;
          }
        });
      }

      if(shouldBreakBuild){
        gutil.log(gutil.colors.red('--------------'));
        gutil.log(gutil.colors.red('csslint failed'));
        gutil.log(gutil.colors.red('--------------'));
        return cb(new gutil.PluginError('csslint', 'CSSLint failed for ' +
        file.relative), file);
      }
      return cb(null, file);
    });
  };

  csslintErrorCount = {};
  return gulp.src('src/app/scss/*.scss')
    .pipe(scsslint({
      config: './.scss-lint.yml'
    }))
    .pipe(customReporter());
    // .pipe(scsslint.failReporter());
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