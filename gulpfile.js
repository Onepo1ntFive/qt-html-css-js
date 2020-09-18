'use strict';

const
    { src, dest, parallel, series, watch } = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    imagemin = require("gulp-imagemin"),
    webp = require("gulp-webp"),
    newer = require("gulp-newer"),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync").create(),
    reload = browserSync.reload;

// use later
// uglify = require('gulp-uglify-es').default;

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

function browserSyncStart() {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: "frontend"
    })
}


function html() {
    return src(path.src.pug)
        .pipe(pug({ pretty: true }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

function scripts() {
    return src(path.src.js)
        .pipe(concat('app.min.js'))
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream())
}

function styles() {
    return src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(dest(path.build.style))
        .pipe(browserSync.stream())
}

function imagesBuild() {
    return src(path.src.images)
        .pipe(newer(path.build.images))
        .pipe(imagemin())
        .pipe(dest(path.build.images))
}

function webpBuild() {
    return src(path.src.images)
        .pipe(newer(path.build.images))
        .pipe(webp())
        .pipe(dest(path.build.images))
}

function images() {
    return parallel(imagesBuild, webpBuild)
}

function clean(cb) {
    return rimraf(path.clean, cb);
}

function startWatch() {
    watch(path.watch.js, { usePolling: true }, scripts)
    watch(path.watch.style, { usePolling: true }, styles)
    watch(path.watch.pug, { usePolling: true }, html)
    watch(path.watch.images, { usePolling: true }, images)
}

exports.clean = clean;

exports.browserSyncStart = browserSyncStart;
exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;

exports.default = parallel(styles, html, scripts, images, browserSyncStart, startWatch);