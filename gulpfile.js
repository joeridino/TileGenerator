var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var buildDir = 'build';
var srcDir = 'src';
var outputFile = 'tile_generator.js';
var outputFileMin = 'tile_generator.min.js';
var jsFiles = [
    'tile_generator.js',
    'util.js',
    'hex.js',
    'dec.js',
    'settings.js',
    'ui.js',
    'main.js',
    'algo.js',
    'algo_random.js',
    'algo_smearing.js',
    'algo_squares.js',
    'algo_neighbor.js',
    'algo_neighbor4.js',
    'algo_neighbor8.js',
    'algo_factory.js',
];
var i;
for (i = 0; i < jsFiles.length; i += 1) {
    jsFiles[i] = srcDir + '/' + jsFiles[i];
}

// concat task
gulp.task('jsConcat', function () {
    'use strict';

    gulp.src(jsFiles)
        .pipe(concat(outputFile))
        .pipe(gulp.dest(buildDir));
});

// uglify task
gulp.task('jsUglify', function () {
    'use strict';

    gulp.src(jsFiles)
        .pipe(concat(outputFileMin))
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(gulp.dest(buildDir));
});

// watch task
gulp.task('watch', function () {
    'use strict';

    gulp.watch([srcDir + '/**/*.js', '!' + buildDir + '/**'], ['jsConcat', 'jsUglify']);
});

gulp.task('scripts', ['clean'], function () {
      return gulp.src('js/*.js')
        .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
        .pipe(gulp.dest('minjs'));
  });