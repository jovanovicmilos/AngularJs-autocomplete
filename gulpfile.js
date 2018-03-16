var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    browsersync = require('browser-sync'),
    reload = browsersync.reload,
    compass = require('gulp-compass'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');

//////////////////////////
//SCRIPT
//////////////////////////

gulp.task('scripts', function () {
    gulp.src(['build/app/**/*.js', '!build/app/**/*.min.js'])
        .pipe(plumber())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/app'))
        .pipe(reload({
            stream: true
        }));
});

//////////////////////////
//SCSS
//////////////////////////

//gulp.task('compass', function () {
//    gulp.src('build/scss/style.scss')
//        .pipe(plumber())
//        .pipe(compass({
//            config_file: './config.rb',
//            css: 'dist/css',
//            sass: 'build/scss',
//            require: ['sass']
//        }))
//        .pipe(gulp.dest('dist/css/'))
//        .pipe(reload({
//            stream: true
//        }));
//});

//////////////////////////
//HTML
//////////////////////////

gulp.task('html', function () {
    gulp.src('build/app/**/*.html')
        .pipe(reload({
            stream: true
        }))
        .pipe(gulp.dest('dist/app'))
});

//////////////////////////
//BROWSER SYNC TASK
//////////////////////////

gulp.task('browser-sync', function () {
    browsersync({
        server: {
            baseDir: "./"
        }
    })
});

//////////////////////////
//WATCH
//////////////////////////

//gulp.task('watch', function () {
//    gulp.watch('build/app/**/*.js', ['scripts']);
//    gulp.watch('build/scss/**/*.scss', ['compass']);
//    gulp.watch('build/app/**/*.html', ['html']);
//});


//////////////////////////
//DEFAULT TASKS
//////////////////////////

//gulp.task('default', ['scripts', 'compass', 'html', 'browser-sync', 'watch']);
gulp.task('default', ['scripts', 'html', 'browser-sync']);