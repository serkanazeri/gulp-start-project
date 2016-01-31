var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    inject = require('gulp-inject'),
    htmlmin = require('gulp-htmlmin'),
    browserSync = require('browser-sync');

var src = {
    sassSrc : 'source/sass/*.sass',
    scriptsSrc : 'source/scripts/*.js',
    htmlSrc : 'source/*.html'
}


gulp.task('styles',function(){

    gulp.src(src.sassSrc)
        .pipe(concat('styles.sass'))
        .pipe(gulp.dest('app/sass/'))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());

});


gulp.task('scripts',function(){

    gulp.src(src.scriptsSrc)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('app/js/'))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js/'))
        .pipe(browserSync.stream());

});


gulp.task('html',function(){

    gulp.src(src.htmlSrc)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('app/'))

});


gulp.task('clean',function(){

    gulp.src('app/sass')
        .pipe(clean())

});


gulp.task('inject',function(){

    gulp.src('app/*.html')
        .pipe(inject(gulp.src(['./app/js/*.js','./app/css/*.css']), {ignorePath: 'app/', addRootSlash: false, relative: false}))
        .pipe(gulp.dest('app/'))

});


gulp.task('default',function(){
    runSequence(['styles','scripts','html']);
});

gulp.task('serve',function(){

    runSequence(['clean','inject']);

    browserSync.init({
        server: "./app/"
    });

    gulp.watch('source/sass/*.sass', ['styles']),
    gulp.watch('source/scripts/*.js', ['scripts']);

});