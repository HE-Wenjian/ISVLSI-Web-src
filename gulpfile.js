var path = require('path');
var del = require('del');
const gulp = require('gulp');
var gutil = require("gulp-util");
const gDebug = require('gulp-debug');
var gInclude = require('gulp-file-include');
var gCount = require('gulp-count');
var gChanged = require('gulp-changed');
var gHtmlMin = require('gulp-htmlmin');
var gCleanCSS = require('gulp-clean-css');
var gSwig = require('gulp-swig');
var gFrontMatter = require('gulp-front-matter');
//var MergeStream = require('merge-stream');
var pkg = require('./package.json');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();

//const SrcDir = "./dev"
const DestDir = "./publish";

gulp.task('just_for_test', function() {
    gulp.src(['dev/src_css/**/*.min.css'])
        .pipe(gDebug({showFiles: true, title: 'test1:'}))

})


gulp.task('clean-html', function(done) {
    gutil.log("[clean]", del.sync([
        './publish/**/*.html'
    ]).length, " HTML Files.");
    done();
})

gulp.task('clean-debug', function(done) {
    gutil.log("[clean]", del.sync([
        './debug/**/*'
    ]).length, " Debug Files.");
    done();
})

gulp.task('compile_html', ['clean-debug'] ,function() {
    gulp.src(['dev/**/*.html',
            '!dev/__*/*',
            '!dev/**/__*',
            '!dev/**/*.p.html'
        ], { base: './dev' })
        .pipe(gChanged(DestDir))
        .pipe(gDebug({showFiles: true}))
        .pipe(gInclude({
            prefix: '#@@@@pre-',
            basepath: './dev'
            })
        )
        //.pipe(gulp.dest('./debug/post-preinclude/'))
        .pipe(gFrontMatter({ 
            property: 'data',
            remove: true }).on('error', gutil.log)
        )
        //.pipe(gulp.dest('./debug/post-FrontMatter/'))
        .pipe(gSwig({
            load_json: false,
            defaults: { cache: false }})
        )
        //.pipe(gulp.dest('./debug/post-swig/'))
        .pipe(gInclude({
            prefix: '@@',
            basepath: './dev'
        }).on('error', gutil.log))
        .pipe(gHtmlMin({collapseWhitespace: true,
        		 conservativeCollapse: true, 
        		 removeComments: true}))
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
    gulp.src(['dev/img/**/*.{jpeg,jpg,png,bmp,ico,gif,tiff}',
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
        .pipe(gCleanCSS({debug: true, compatibility: 'ie8'}, function(details) {
              gutil.log(details.name + ': ' + details.stats.originalSize + 'B -> ' + details.stats.minifiedSize + 'B');
            }))
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

gulp.task('force-html', function(cb) {
	runSequence('clean-html',
	             ['compile_html','process_css', 'copy_js', 'copy_image'],
	             cb);
});

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
    gulp.watch('./dev/**/*.p.html', { ignoreInitial: false, event: ['change','add'], read: false ,readDelay: 100})
        .on('change', function() {
            runSequence('clean-html', 'compile_html');
        });
    gulp.watch([
    		'./dev/src_css/**/*.{jpeg,jpg,png,bmp,ico,gif,tiff}',
            './dev/src_css/**/*.css}',
            './dev/**/*.html',
            '!./dev/**/*.p.html',
            './dev/src_js/**/*.js'
        ], { ignoreInitial: false, read: false ,readDelay: 100}, ['default'])
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