var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    //imageResize = require('gulp-image-resize'),
    //parallel = require('concurrent-transform'),
    os = require('os'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var concatCss = require('gulp-concat-css');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css', function(){
  var processors = [
    autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}),
    mqpacker
  ]
  return gulp.src('./src/scss/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist/css'));
});

// Static server
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

// Concatenate & Minify
gulp.task('scripts', function(){
  var jsFiles = [
    './src/components/jquery/dist/jquery.min.js',
    './src/js/*.js'];
  return gulp.src(jsFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({stream:true}));
});

// Images
gulp.task('images', function(){
  return gulp.src('./src/images/**/*')
    /*.pipe(parallel(
      imageResize({ width: 600 })
    ))*/
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// HTML
gulp.task('html', function(){
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'))
});

// Watch
gulp.task('watch', function(){
  gulp.watch('./src/**/*.scss', ['css', browserSync.reload]);

  gulp.watch('./src/**/*.js', ['scripts', browserSync.reload]);

  gulp.watch(['*.html','./src/*.html'], ['html', browserSync.reload]);
});


gulp.task('default', ['css','browser-sync', 'html', 'scripts', 'watch']);
