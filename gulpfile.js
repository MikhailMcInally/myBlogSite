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
    let bootstrap = gulp.src('./node_modules/dist/**/*')
    .pipe(gulp.dest('./vendor/bootstrap'));
    // Font Awesome CSS
    // Font Awesome Webfonts
    // jQuery
    let jquery = gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'));
    return merge(bootstrap, jquery);
}


//Watch files
function watchFiles() {
    gulp.watch('./css/blog.css', browserSyncReload);
}

//Define Complex Tasks
const vendor = gulp.series(clean, modules);
const watch = gulp.parallel(watchFiles, browserSync);


//gulp.task('watch', function(){
//    gulp.watch('./scss/*.scss', ['sass']);
//    gulp.watch('./css/*.css', ['css']);
//});


exports.watch = watch;
exports.clean = clean;
exports.vendor = vendor;
