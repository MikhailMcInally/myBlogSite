'use strict';

// Load plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const uglifycss = require('gulp-uglifycss');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const browsersync = require('browser-sync').create();
const merge = require('merge-stream');
const rename =require('gulp-rename');
const header = require('gulp-header');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');

// Load package.json for banner
const pkg = require('./package.json');

//Set the banner content
const banner = ['/*!\n',
    ' * myBlogSite - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Copyright 2013-' + (new Date()).getFullYear(), 
    '<%= pkg.author %>',
    ' * Licensed under <%= pkg.license %> (https://github.com/MikhailMcInally/<%= pkg.name %>/blob/master/LICENSE)',
    ' */',
    '\n'
].join('\n');

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: './'
        },
        port: 3000
    });
    done();
}

// BrowserSyncReload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean Vendor
function clean() {
    return del(['./vendor/']);
}

// Move dependencies from node_modules into vendor directory
function modules() {
    //Bootstrap
    let bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('./vendor/bootstrap'));
    // Font Awesome CSS
    let fontAwesomeCSS = gulp.src('./node_modules/@fortawesome/fontawesome-free/css/*')
    .pipe(gulp.dest('./vendor/fontawesome/css'))
    // Font Awesome Webfonts
    let fontAwesomeWebfonts = gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest('./vendor/fontawesome/webfonts'))
    // jQuery
    let jquery = gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'));
    return merge(bootstrap, jquery, fontAwesomeCSS, fontAwesomeWebfonts);
}

//CSS

function css() {
    return gulp
    .src('./scss/*')
    // use global error handler
    .pipe(plumber())
    .pipe(sass({
        outputStyle: 'expanded',
        includePaths: './node_modules'
    }))
    .on('error', sass.logError)
    // add browser prefixes
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    // add banner
    .pipe(header(banner, {
        pkg: pkg
    }))
    .pipe(gulp.dest('./css'))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./css'))
//    .pipe(browsersync.stream());
}


//Watch files
function watchFiles() {
    gulp.watch('./scss/**/*', css);
    gulp.watch('./css/*', browserSyncReload);
    gulp.watch('./**/*.html', browserSyncReload);
}

//Define Complex Tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, css);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));


// Export Tasks
exports.clean = clean;
exports.vendor = vendor;
exports.watch = watch;
