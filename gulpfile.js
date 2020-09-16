'use strict';

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

const path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        style: 'build/css/',
        img: 'build/images/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/**/*.html',
        pug: 'src/**/*.pug',
        js: 'src/**/*.js',
        style: 'src/style/*.scss',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        pug: 'src/**/*.pug',
        js: 'src/**/*.js',
        style: 'src/style/*.scss',
        img: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
}

const config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "frontend"
};


gulp.task('sass', function () {
    return gulp.src(path.watch.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.build.style));
});

gulp.task('sass:watch', function () {
    gulp.watch(path.src.style, ['sass']);
});