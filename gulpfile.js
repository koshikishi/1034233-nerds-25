'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');

gulp.task('css', function () {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('css'))
    .pipe(gulp.dest('css'));
});

gulp.task('watcher', function () {
  gulp.watch('source/sass/**/*.scss', ['css']);
});
