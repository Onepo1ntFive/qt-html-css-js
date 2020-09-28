'use strict';

const
    { src, dest, parallel, series, watch } = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require("gulp-imagemin"),
    imagewebp = require("gulp-webp"),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync").create();

const path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        style: 'build/css/',
        images: 'build/images/',
        fonts: 'build/fonts/',
        fonts: 'build/fonts/'
    },
    dev: {
        html: 'dev/',
        js: 'dev/',
        style: 'dev/css/',
        images: 'dev/images/',
        fonts: 'dev/fonts/',
        fonts: 'dev/fonts/'
    },
    src: {
        pug: 'src/**/*.pug',
        js: 'src/**/*.js',
        style: 'src/style/*.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        fonts: 'src/fonts/**/*.*'

    },
    watch: {
        pug: 'src/**/*.pug',
        js: 'src/**/*.js',
        style: 'src/style/**/*.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
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

// todo шрифты
function webfonts() {
    return src(path.src.fonts)
        .pipe(dest(path.dev.fonts))
}
function webfontsBuild() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
}

function html() {
    return src(path.src.pug)
        .pipe(pug({ pretty: true }))
        .pipe(dest(path.dev.html))
        .pipe(browserSync.stream())
}
function htmlBuild() {
    return src(path.src.pug)
        .pipe(pug())
        .pipe(dest(path.build.html))
}

function scripts() {
    return src(path.src.js)
        .pipe(uglify())
        .pipe(dest(path.dev.js))
        .pipe(browserSync.stream())
}
function scriptsBuild() {
    return src(path.src.js)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest(path.build.js))
}

function styles() {
    return src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            "overrideBrowserslist": ["last 10 version"]
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(path.dev.style))
        .pipe(browserSync.stream())
}
function stylesBuild() {
    return src(path.src.style)
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({
            "overrideBrowserslist": ["last 10 version"]
        }))
        .pipe(dest(path.build.style))
}

function images() {
    return src(path.src.images)
        .pipe(imagemin())
        .pipe(dest(path.dev.images))
        .pipe(browserSync.stream())
}
function imagesBuild() {
    return src(path.src.images)
        .pipe(imagemin())
        .pipe(dest(path.build.images))
}
function webp() {
    return src(path.src.images)
        .pipe(imagewebp())
        .pipe(dest(path.dev.images))
        .pipe(browserSync.stream())
}
function webpBuild() {
    return src(path.src.images)
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

exports.browserSyncStart = browserSyncStart;

exports.html = html;
exports.htmlBuild = htmlBuild;

exports.scripts = scripts;
exports.scriptsBuild = scriptsBuild;

exports.styles = styles;
exports.stylesBuild = stylesBuild;

exports.imagesBuild = imagesBuild;
exports.images = images;

exports.webpBuild = webpBuild;
exports.webp = webp;

exports.webfonts = webfonts;
exports.webfontsBuild = webfontsBuild;

exports.clean = series(clean, cleanDev);

exports.dev = parallel(browserSyncStart, styles, html, scripts, images, webp, webfonts, startWatch);
exports.build = series(clean, htmlBuild, stylesBuild, scriptsBuild, webfontsBuild, imagesBuild, webpBuild);