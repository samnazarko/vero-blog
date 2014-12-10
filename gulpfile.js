var gulp = require('gulp'); 
var sass = require('gulp-sass');
var compass = require('gulp-compass');
var cssmin = require('gulp-cssmin');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var cp = require('child_process');

var dist = 'dist/';
var site = 'dist/_site/';
var src = 'src/';
var bower = 'bower_components/';

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "dist/_site"
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
    .pipe(gulp.dest(site + 'assets/css'))
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
  .pipe(gulp.dest(site + 'assets/js'));
});

gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit', cwd: 'dist' })
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('default', ['style', 'js', 'browser-sync'], function () {
  gulp.watch([dist + "**/*.html", dist + "**/*.md", "!dist/_site/**/*"], ['jekyll-rebuild']);
  gulp.watch(src + "assets/style/style.scss", ['style']);
  gulp.watch(src + "assets/js/app.js", ['js', reload]);
});