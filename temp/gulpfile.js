'use strict';

const gulp = require('gulp'),
    { watch, parallel, series } = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require("gulp-imagemin"),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

const path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        style: 'build/css/',
        images: 'build/images/',
        fonts: 'build/fonts/'
    },
    src: {
        pug: 'src/**/*.pug',
        js: 'src/**/*.js',
        style: 'src/style/*.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
        
    },
    watch: {
        pug: 'src/**/*.pug',
        js: 'src/**/*.js',
        style: 'src/style/**/*.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
}

// server
const config = {
    server: {
        baseDir: "./build",
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "frontend"
};

gulp.task('webserver', function () {
    return browserSync(config);
});

// clean build
gulp.task('clean', function (callback) {
    return rimraf(path.clean, callback);
});

// build tasks

function pug() {
    return gulp.src(path.src.pug)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({ stream: true }));
}

gulp.task('css:build', function () {
    return gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        .pipe(reload({ stream: true }));
});

gulp.task('image:build', function () {
    return gulp.src(path.src.images)
        // .pipe(imagemin())
        .pipe(gulp.dest(path.build.images))
        .pipe(reload({ stream: true }));
});

// build all
gulp.task('build', series(pug, 'css:build', 'image:build'));

// watch
gulp.task('watch', (done) => {
    watch(path.watch.pug, gulp.series(pug));
    // watch(path.watch.css, gulp.series('css:build'));
    // watch(path.watch.images, gulp.series('images:build'));

    done();
});

gulp.task('default', series('build', 'watch', 'webserver'));