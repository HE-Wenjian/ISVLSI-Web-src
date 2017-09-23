var gulp        = require('gulp');
var path        = require('path');
var gutil       = require("gulp-util");
var browserSync = require('browser-sync').create();
var GulpInclude = require('gulp-file-include');
//var MergeStream = require('merge-stream');
var pkg         = require('./package.json');

var DestDir     = "./publish";




gulp.task('compile', function() {
  var files=['./*.html']
  gulp.src(files,{base: '.'})
  .pipe(gulp.dest(DestDir))
})

gulp.task('test_copy_html', function() {
    gulp.src(['dev/index.html']
        ,{base:'./dev/'})
    .pipe(gulp.dest(DestDir))
})

// NOTE: requires `npm install` before running!
gulp.task('process_js', function() {
    var nSrc=0, nDes=0;
  gulp.src(['dev/src_js/**/*.min.js'])
    .on("data",function(){nSrc+=1;})
    .pipe( gulp.dest(path.join(DestDir, 'js')))
    .on("data",function(){nDes+=1;})

    gutil.log("[js] nSrc=", nSrc, ", nDes=", nDes);
})

gulp.task('process_css', function() {
    var nSrc=0, nDes=0;
    gulp.src(['dev/src_css/**/*.min.css'])
        .on("data",function(){nSrc+=1;})
        .pipe( gulp.dest(path.join(DestDir, 'css')))
        .on("data",function(){nDes+=1;})

    gulp.src(['dev/src_css/**/*.css',
            '!dev/src_css/{bootstrap,bootstrap/**}',
            '!dev/src_css/**/*.min.css'])
        .on("data",function(){nSrc+=1;})
        .pipe(gulp.dest(path.join(DestDir, 'css')))
        .on("data",function(){nDes+=1;})

    gutil.log("[css] nSrc=", nSrc, ", nDes=", nDes);
})

// Default task
gulp.task('default', ['process_js','process_css','test_copy_html']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync'], function() {
  // Reloads the browser whenever HTML or CSS files change
  gulp.watch('css/*.css', browserSync.reload);
  gulp.watch('*.html', browserSync.reload);
});
