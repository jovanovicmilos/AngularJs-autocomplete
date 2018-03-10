var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    rename = require('gulp-rename');

//////////////////////////
//SCRIPT
//////////////////////////

gulp.task('scripts', function(){
    gulp.src(['app/**/*.js', '!app/**/*.min.js'])
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('app'))
});

//////////////////////////
//SCSS
//////////////////////////

gulp.task('compass', function(){
    gulp.src('assets/scss/style.scss')
    .pipe(compass({
          config_file: './config.rb',
          css: 'assets/css',
          sass: 'assets/scss',
          require: ['sass']
      }))
    .pipe(gulp.dest('assets/css/'));
});

//////////////////////////
//WATCH
//////////////////////////

gulp.task('watch', function(){
    gulp.watch('app/**/*.js', ['scripts']);
    gulp.watch('assets/scss/**/*.scss', ['compass']);
});

//////////////////////////
//CONNECT
//////////////////////////

gulp.task('connect', function() {
  connect.server({
    root: '',
    port: 8080,
    livereload: true
  });
});

//////////////////////////
//DEFAULT TASKS
//////////////////////////

gulp.task('default', ['scripts', 'compass', 'watch', 'connect']);