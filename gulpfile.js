'use strict';

const
    { src, dest, parallel, series, watch } = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    imagemin = require("gulp-imagemin"),
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

function scripts() {
    return src(path.src.js)
        .pipe(concat('app.min.js'))
        .pipe(dest(path.build.js))
}

function style() {
    return src(path.src.style)
        // .pipe(sourcemaps.init())
        .pipe(sass())
        // .pipe(sourcemaps.write())
        .pipe(dest(path.build.style));
}

function startWatch() {
    watch(path.watch.js, scripts)
    watch(path.watch.style, style)
}

exports.browserSyncStart = browserSyncStart;
exports.scripts = scripts;
exports.style = style;

exports.default = parallel(scripts, style, startWatch)