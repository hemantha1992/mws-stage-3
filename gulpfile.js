var gulp = require('gulp');
var imagemin=require('gulp-imagemin')
var imageminMozjpeg = require('imagemin-mozjpeg');
let rename = require("gulp-rename");
let uglify = require('gulp-uglify-es').default;
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var minifyCSS = require('gulp-minify-css');

gulp.task('imageMin', gulp.series(function(done) {    
    // task code here
  gulp.src('pre-img/*.jpg')
  .pipe(imagemin([imageminMozjpeg({
    quality: 30
})]))
  .pipe(gulp.dest('img'));
    done();
}));

gulp.task("uglify", function () {
    return gulp.src("js/restaurant_info.js")
        .pipe(rename("restaurant_info.js"))
        .pipe(uglify(/* options */))
        .pipe(gulp.dest("js-post"));
});

gulp.task('minify-css', () => {
    return gulp.src('css/*.css')
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('css-pro'));
  });