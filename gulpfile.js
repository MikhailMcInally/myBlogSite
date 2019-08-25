const gulp = require('gulp');
const sass = require('gulp-sass');
const uglifycss = require('gulp-uglifycss');
const browsersync = require('browser-sync').create();

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

//Watch files
function watchFiles() {
    gulp.watch('./css/blog.css', browserSyncReload);
}

//Define Complex Tasks
const watch = gulp.parallel(watchFiles, browserSync);


//gulp.task('watch', function(){
//    gulp.watch('./scss/*.scss', ['sass']);
//    gulp.watch('./css/*.css', ['css']);
//});


exports.watch = watch;
