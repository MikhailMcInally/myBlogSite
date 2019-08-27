const gulp = require('gulp');
const sass = require('gulp-sass');
const uglifycss = require('gulp-uglifycss');
const browsersync = require('browser-sync').create();
const merge = require('merge-stream');
const header = require('gulp-header');
const del = require('del');

// Load package.json
const pkg = require('./package.json');

const banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), 
    '<%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license %> (https://github.com/MikhailMcInally/<%= pkg.name %>/blob/master/LICENSE)\n',
    ' */\n',
    '\n'
].join('\n');

//BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: './'
        },
        port: 3000
    });
    done();
}

//BrowserSyncReload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

//Clean Vendor
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
    
}


//Watch files
function watchFiles() {
    gulp.watch('./css/blog.css', browserSyncReload);
}

//Define Complex Tasks
const vendor = gulp.series(clean, modules);
const watch = gulp.parallel(watchFiles, browserSync);



exports.watch = watch;
exports.clean = clean;
exports.vendor = vendor;
