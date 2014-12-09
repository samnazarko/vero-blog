var gulp = require('gulp'); 
var del = require('del');
var merge = require('merge-stream');
var rev = require('gulp-rev');
var inject = require('gulp-inject');
var htmlmin = require('gulp-minify-html');
var sass = require('gulp-sass');
var compass = require('gulp-compass');
var cssmin = require('gulp-cssmin');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var dist = 'dist/';
var src = 'src/';
var bower = 'bower_components/';

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "dist"
    }
  });
});

// style
gulp.task('style', function () {
  return gulp.src(src + 'assets/style/style.*')
  
    .pipe(compass({
      css: src + 'assets/css',
      sass: src + 'assets/style',
      image: src + 'assets/img',
      import_path: bower
    }))
    .pipe(prefix())
    .pipe(cssmin())
    .pipe(gulp.dest(dist + 'assets/css'))
    .pipe(gulp.dest(src + 'assets/css'))
    .pipe(reload({stream:true}));
    
});

// minify js
gulp.task('minify', function () {
  return gulp.src([
    src + "assets/js/app.js"
  ])
  .pipe(uglify())
  .pipe(concat('minify.js'))
  .pipe(gulp.dest(src + 'assets/js'));
});

// js
gulp.task('js', ['minify'], function () {
  return gulp.src([
    src + "assets/js/minify.js"
  ])
  .pipe(concat('main.js'))
  .pipe(gulp.dest(dist + 'assets/js'))
  .pipe(gulp.dest(src + 'assets/js'));
});

gulp.task('html', function () {
  return gulp.src(src + '*.html')
    .pipe(gulp.dest(dist));
});

gulp.task('default', ['html', 'style', 'js', 'browser-sync'], function () {
  gulp.watch(src + "*.html", ['html', reload]);
  gulp.watch(src + "assets/style/style.*", ['style']);
  gulp.watch(src + "assets/js/app.js", ['js', reload]);
});




// BUILD TASKS

gulp.task('clean', ['style', 'js'], function (cb) {
  del([
    dist + "assets/js/**",
    dist + "assets/css/**"
  ], cb);
});

gulp.task('revision', ['clean'], function () {
  var css = gulp.src(src + 'assets/css/style.css')
    .pipe(rev())
    .pipe(gulp.dest(dist + 'assets/css'));
  
  var js = gulp.src(src + 'assets/js/main.js')
    .pipe(rev())
    .pipe(gulp.dest(dist + 'assets/js'));
  
  var img = gulp.src(src + 'assets/img/**/*')
    .pipe(gulp.dest(dist + 'assets/img'));
  
  browserSync.reload();
  return merge(css, js, img);
});

gulp.task('injection', ['revision'], function () {
  return gulp.src(src + '*.html')
    .pipe(inject(gulp.src(dist + "assets/js/main-*.js", {read: false}), {ignorePath: 'dist', addRootSlash: false}))
    .pipe(inject(gulp.src(dist + "assets/css/style-*.css", {read: false}), {ignorePath: 'dist', addRootSlash: false}))
    .pipe(htmlmin())
    .pipe(gulp.dest(dist));
});

gulp.task('reloadbuild', ['injection'], function () {
  browserSync.reload;
});

gulp.task('build', ['reloadbuild', 'browser-sync'], function () {
  gulp.watch(src + "*.html", ['reloadbuild']);
  gulp.watch(src + "assets/style/style.*", ['reloadbuild']);
  gulp.watch(src + "assets/js/app.js", ['reloadbuild']);
});