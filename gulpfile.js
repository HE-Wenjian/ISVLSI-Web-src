var path = require('path');
var del = require('del');
const gulp = require('gulp');
var gutil = require("gulp-util");
const gDebug = require('gulp-debug');
var gInclude = require('gulp-file-include');
var gCount = require('gulp-count');
var gChanged = require('gulp-changed');
var gHtmlMin = require('gulp-htmlmin');
//var MergeStream = require('merge-stream');
var pkg = require('./package.json');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

const SrcDir = "./dev"
const DestDir = "./publish";

gulp.task('clean-html', function(done) {
    gutil.log("[clean]", del.sync([
        './publish/**/*.html'
    ]).length);
    done();
})

gulp.task('compile_html', function() {
    gulp.src(['dev/**/*.html',
            '!dev/__*/*',
            '!dev/**/__*',
            '!dev/**/*.p.html'
        ], { base: './dev' })
        .pipe(gChanged(DestDir))
        .pipe(gDebug({showFiles: true}))
        .pipe(gInclude({
            prefix: '@@',
            basepath: './dev'
        }).on('error', gutil.log))
        .pipe(gHtmlMin({collapseWhitespace: true, conservativeCollapse: true}))
        .pipe(gulp.dest(DestDir))
})

// NOTE: requires `npm install` before running!
gulp.task('copy_js', function() {
    gulp.src(['dev/src_js/**/*.min.js'])
        .pipe(gChanged(path.join(DestDir, 'js')))
        .pipe(gCount('[js] Num Src= ##'))
        .pipe(gulp.dest(path.join(DestDir, 'js')))
        .pipe(gCount('[js] Num Des= ##'))
})

gulp.task('copy_image', function() {
    gulp.src(['dev/img/**/*.{jpeg,jpg,png,ico,gif}',
            '!dev/img/**/*.src.*'
        ])
        .pipe(gChanged(path.join(DestDir, 'img')))
        .pipe(gCount('[img] Num Src= ##'))
        .pipe(gulp.dest(path.join(DestDir, 'img')))
        .pipe(gCount('[img] Num Des= ##'))
})

gulp.task('process_css', function() {
    gulp.src(['dev/src_css/**/*.min.css'])
        .pipe(gChanged(path.join(DestDir, 'css')))
        .pipe(gCount('[css:vender] Num Src= ##'))
        .pipe(gulp.dest(path.join(DestDir, 'css')))
        .pipe(gCount('[css:vender] Num Des= ##'))

    gulp.src(['dev/src_css/**/*.css',
            '!dev/src_css/{bootstrap,bootstrap/**}',
            '!dev/src_css/**/*.min.css'
        ])
        .pipe(gChanged(path.join(DestDir, 'css')))
        .pipe(gCount('[css:This] Num Src= ##'))
        .pipe(gulp.dest(path.join(DestDir, 'css')))
        .pipe(gCount('[css:This] Num Des= ##'))
})

// Default task
gulp.task('default', [
    'process_css',
    'copy_js',
    'compile_html',
    'copy_image'
]);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: DestDir
        },
        port: 8082,
        ghostMode: false
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync'], function() {
    // Reloads the browser whenever HTML or CSS files change
    gulp.watch('./dev/**/*.p.html', { ignoreInitial: true, event: ['change','add'], read: false ,readDelay: 100})
        .on('change', function() {
            runSequence('clean-html', 'compile_html');
        });
    gulp.watch([
            './dev/src_css/{*,css,**/*.css}',
            './dev/**/*.html',
            '!./dev/**/*.p.html',
            './dev/src_js/**/*.js'
        ], { ignoreInitial: true, read: false ,readDelay: 100}, ['default'])
        .on('change', function(event) {
            gutil.log('Changed File :' + event.path);
        }).on('add', function(event) {
            gutil.log('Added File :' + event.path);
        });

    gulp.watch([
            './publish/css/*.css',
            './publish/**/*.html',
            './publish/**/*.js'
        ], { ignoreInitial: true, read: false },
        browserSync.reload);
});

gulp.task('pub', ['browserSync'], function() {
    // Reloads the browser whenever HTML or CSS files change
    gulp.watch(['./publish/css/*.css',
        './publish/js/*.js',
        './publish/{*.html,**/*.html}',
        ], browserSync.reload);
});