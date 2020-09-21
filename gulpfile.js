'use strict';

const
    { src, dest, parallel, series, watch } = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require("gulp-imagemin"),
    imagewebp = require("gulp-webp"),
    newer = require("gulp-newer"),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync").create();

// use later

const path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        style: 'build/css/',
        images: 'build/images/',
        fonts: 'build/fonts/'
    },
    dev: {
        html: 'dev/',
        js: 'dev/js/',
        style: 'dev/css/',
        images: 'dev/images/',
        fonts: 'dev/fonts/'
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
    clean: './build',
    cleanDev: './dev',
}

function browserSyncStart() {
    browserSync.init({
        server: {
            baseDir: './dev/'
        },
    })
}


function html() {
    return src(path.src.pug)
        .pipe(pug({ pretty: true }))
        .pipe(dest(path.dev.html))
        .pipe(browserSync.stream())
}
// todo минификация
function htmlBuild() {
    return src(path.src.pug)
        .pipe(pug())
        .pipe(dest(path.build.html))
}

function scripts() {
    return src(path.src.js)
        .pipe(dest(path.dev.js))
        .pipe(browserSync.stream())
}
function scriptsBuild() {
    return src(path.src.js)
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(dest(path.build.js))
}

function styles() {
    return src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(dest(path.dev.style))
        .pipe(browserSync.stream())
}
// todo минификация
function stylesBuild() {
    return src(path.src.style)
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(dest(path.build.style))
}

// todo Разобраться с dest. Что бы и в build и dev падало
// todo newer
function images() {
    return src(path.src.images)
        // .pipe(newer(path.build.images))
        .pipe(imagemin())
        .pipe(dest(path.build.images))
        .pipe(dest(path.dev.images))
}
// todo Разобраться с dest. Что бы и в build и dev падало
// todo newer
function webp() {
    return src(path.src.images)
        // .pipe(newer(path.build.images))
        .pipe(imagewebp())
        .pipe(dest(path.build.images))
}


function clean(cb) {
    return rimraf(path.clean, cb);
}
function cleanDev(cb) {
    return rimraf(path.cleanDev, cb);
}

function startWatch() {
    watch(path.watch.js, { usePolling: true }, scripts)
    watch(path.watch.style, { usePolling: true }, styles)
    watch(path.watch.pug, { usePolling: true }, html)
    watch(path.watch.images, { usePolling: true }, images)
}

exports.clean = series(clean, cleanDev);

exports.browserSyncStart = browserSyncStart;

exports.html = html;
exports.htmlBuild = htmlBuild;

exports.scripts = scripts;
exports.scriptsBuild = scriptsBuild;

exports.styles = styles;
exports.stylesBuild = stylesBuild;

exports.images = images;
exports.webp = webp;

exports.dev = parallel(styles, html, scripts, images, webp, startWatch, browserSyncStart);
exports.build = series(clean, htmlBuild, stylesBuild, scriptsBuild, images, webp);