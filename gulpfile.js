const gulp = require('gulp');
const sass = require('gulp-sass');
const uglifycss = require('gulp-uglifycss');


sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
  return gulp.src('./scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('css', function () {
  gulp.src('./css/*.css')
    .pipe(uglifycss({
      "uglyComments": true
    }))
    .pipe(gulp.dest('./css'));
});

gulp.task('run', ['sass', 'css']);

gulp.task('watch', function(){
    gulp.watch('./scss/*.scss', ['sass']);
    gulp.watch('./css/*.css', ['css']);
});


exports.default = defaultTask;
