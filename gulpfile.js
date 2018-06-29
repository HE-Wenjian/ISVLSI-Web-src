var DEBUG_MODE = false;

var fs = require('fs');
var path = require('path');
var del = require('del');
const gulp = require('gulp');
var gutil = require("gulp-util");
const gDebug = require('gulp-debug');
var gInclude = require('gulp-file-include');
var gCount = require('gulp-count');
var gChanged = require('gulp-changed');
var gHtmlMin = require('gulp-htmlmin');
var gHtmlLint = require('gulp-htmllint');
var gCleanCSS = require('gulp-clean-css');
const gIf = require('gulp-if');
var gData = require('gulp-data');
var swig = require('swig');
var gSwig = require('gulp-swig');
var dayjs = require('dayjs');
function dayjsformat_wrapper(input,fmt){
    fmt= fmt || "YYYY-MM-DD";
    var t=dayjs(input);
    return (t.isValid())? t.format(fmt) : input;
}
//var MergeStream = require('merge-stream');
var pkg = require('./package.json');
var runSequence = require('run-sequence');
runSequence.options.showErrorStackTrace = true;
var browserSync = require('browser-sync').create();


const appRoot = path.resolve(__dirname)
const SrcDir = "./dev"
const DestDir = "./publish";

const devRoot = path.join(appRoot,SrcDir)

gulp.task('just_for_test', function() {
    gulp.src(['dev/src_css/**/*.min.css'])
        .pipe(gDebug({ showFiles: true, title: 'test1:' }))

})

gulp.task('clean-html', function(done) {
    del('./publish/**/*.html').then( function(deled_paths){
        gutil.log("[Clean] ", deled_paths.length , " HTML Files:", deled_paths.join(';'));
        done();
    });
})

gulp.task('clean-debug', function(done) {
    del('./debug/**/*').then( function(deled_paths){
        gutil.log("[Clean]", deled_paths.length, " Debug Files.");
        done();
    });
})

gulp.task('compile_html', ['clean-debug'], function() {
    gulp.src(['dev/**/*.html',
            '!dev/__*/*',
            '!dev/**/__*',
            '!dev/**/*.p.html'
        ], { base: './dev' })
        .pipe(gChanged(DestDir))
        .pipe(gDebug({ showFiles: DEBUG_MODE, title: '[HTML] Start to compile:' }))
        .pipe(gData(
            function(file) {
                var ItsJSONFile = gutil.replaceExtension(file.path, '.json');
                var FileJsonData= fs.existsSync(ItsJSONFile) ? JSON.parse(fs.readFileSync(ItsJSONFile)) : {};
                FileJsonData.file={};
                FileJsonData.file.relative=file.relative;
                FileJsonData.file.WebRoot=path.normalize(path.relative(path.dirname(file.path),devRoot));
                FileJsonData.testloadmacro="./component/page.macro";
                return FileJsonData ;
            }
        ))
        .pipe(gIf(DEBUG_MODE, gDebug({ showFiles: true, title: '[HTML] JSON Loaded:' })))
        .pipe(gSwig({
            setup: function(swig){
                swig.setFilter('dayjsformat', dayjsformat_wrapper);
            },
            load_json: false,
            defaults: { 
                cache: false,
                loader: swig.loaders.fs(devRoot)
            }
        }))
        .pipe(gIf(DEBUG_MODE, gDebug({ showFiles: true, title: '[HTML] Swig Done:' })))
        .pipe(gIf(DEBUG_MODE, gulp.dest('./debug/post-swig/')))
        .pipe(gInclude({
            prefix: '@@',
            basepath: './dev'
        }))
        //.pipe(gHtmlHint()).pipe(gHtmlHint.failOnError())
        .pipe(gIf(!DEBUG_MODE,
            gHtmlMin({
                collapseWhitespace: true,
                conservativeCollapse: true,
                removeComments: true,
                minifyJS: true
            })))
        .pipe(gDebug({ showFiles: true, title: '[HTML] Proccessed:' }))
        .pipe(gulp.dest(DestDir))
})

// NOTE: requires `npm install` before running!
gulp.task('copy_minjs', function() {
    gulp.src(['dev/src_js/**/*.min.js'])
        .pipe(gChanged(path.join(DestDir, 'js')))
        .pipe(gCount('[minjs] Num = ##'))
        .pipe(gulp.dest(path.join(DestDir, 'js')))
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

gulp.task('copy_assets', function() {
    gulp.src(['dev/download/*.*',
            'dev/download/**/*.pdf',
            '!dev/download/**/*.src.*',
            '!dev/download/src/**/*.*'
        ])
        .pipe(gChanged(path.join(DestDir, 'download')))
        .pipe(gCount({ showFiles: true, title: '[download] Num Copied= ##'}))
        .pipe(gulp.dest(path.join(DestDir, 'download')))
})

gulp.task('process_css', function() {
    /* Copy */
    gulp.src(['dev/src_css/**/*.min.css'])
        .pipe(gChanged(path.join(DestDir, 'css')))
        .pipe(gCount('[css:vender] Num Src= ##'))
        .pipe(gulp.dest(path.join(DestDir, 'css')))
        .pipe(gCount('[css:vender] Num Des= ##'))

    /* process */
    gulp.src(['dev/src_css/**/*.css',
            '!dev/src_css/{bootstrap,bootstrap/**}',
            '!dev/src_css/**/*.min.css'
        ])
        .pipe(gChanged(path.join(DestDir, 'css')))
        .pipe(gCount('[css:This] Num Src= ##'))
        .pipe(gCleanCSS({ debug: true, compatibility: 'ie8' }, function(details) {
            gutil.log(details.name + ': ' + details.stats.originalSize + 'B -> ' + details.stats.minifiedSize + 'B');
        }))
        .pipe(gulp.dest(path.join(DestDir, 'css')))
        .pipe(gCount('[css:This] Num Des= ##'))
})

// Default task
gulp.task('default', [
    'compile_html',
    'process_css',
    'copy_minjs',
    'copy_image',
    'copy_assets',
]);

gulp.task('force-html', function(cb) {
    runSequence('clean-html', 'default',
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
    gulp.watch(['./dev/**/*.p.html',
        ], { ignoreInitial: false, event: ['change', 'add'], read: false, readDelay: 100 })
        .on('change', function() {
            runSequence('clean-html', 'compile_html');
        });

    gulp.watch(['./dev/**/*.json'
        ], { ignoreInitial: false, event: ['change', 'add'], read: false, readDelay: 100 })
        .on('change', function(event) {
            var rel_path=path.relative(path.join(appRoot,SrcDir), event.path);
            var html_path=path.join(DestDir, rel_path.substr(0, rel_path.lastIndexOf(".")) + ".html");
            gutil.log('Changed File : ' + rel_path +
                ';\tTo Delete : ' + html_path);
            DeleteFilesThen(html_path,function(){runSequence('compile_html');});
        }).on('add', function(event) {
            gutil.log('Added File :' + event.path);
        });

    gulp.watch([
            './dev/src_css/**/*.{jpeg,jpg,png,bmp,ico,gif,tiff}',
            './dev/src_css/**/*.css}',
            './dev/**/*.html',
            '!./dev/**/*.p.html',
            './dev/src_js/**/*.js'
        ], { ignoreInitial: false, read: false, readDelay: 100 }, ['default'])
        .on('change', function(event) {
            gutil.log('Changed File :' + path.relative(appRoot,event.path));
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

/***********************************************************/
function htmllintReporter(filepath, issues) {
    if (issues.length > 0) {
        issues.forEach(function(issue) {
            gutil.log(gutil.colors.cyan('[gulp-htmllint] ') +
                gutil.colors.white(filepath + ' [' + issue.line + ',' + issue.column + ']: ') +
                gutil.colors.red('(' + issue.code + ') ' + issue.msg));
        });
    }
}

function requireUncached($module) {
    delete require.cache[require.resolve($module)];
    return require($module);
}

function DeleteFilesThen(glob,cb) {
    del(glob).then(function(paths){
        gutil.log("[DEL]", paths.join(';'));
        cb();
    })
}

