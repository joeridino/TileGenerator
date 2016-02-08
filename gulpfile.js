var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');

var buildDir = 'build';
var srcDir = 'src';
var outputFile = 'tile_generator.js';
var outputFileMin = 'tile_generator.min.js';
var jsFiles = [
    'tile_generator.js',
    'util/oop.js',
    'util/array.js',
    'util/dom.js',
    'util/hex.js',
    'util/dec.js',
    'app/settings.js',
    'app/main.js',
    'ui/ui.js',
    'ui/map.js',
    'ui/map_pattern.js',
    'ui/map_pattern_repeat.js',
    'ui/map_pattern_seamless.js',
    'ui/map_pattern_factory.js',
    'algo/algo.js',
    'algo/algo_random.js',
    'algo/algo_smearing.js',
    'algo/algo_brick.js',
    'algo/algo_neighbor.js',
    'algo/algo_neighbor4.js',
    'algo/algo_neighbor8.js',
    'algo/algo_pixellation.js',
    'algo/algo_factory.js',
];
var i;
for (i = 0; i < jsFiles.length; i += 1) {
    jsFiles[i] = srcDir + '/' + jsFiles[i];
}

var pkg = require('./package.json');
var banner = [
    '// <%= pkg.custom.copyright %> <%= pkg.author.name %>',
    ''
].join('\n');

// concat task
gulp.task('jsConcat', function () {
    'use strict';

    gulp.src(jsFiles)
        .pipe(concat(outputFile))
        .pipe(header(banner, {pkg: pkg}))
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
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest(buildDir));
});

// watch task
gulp.task('watch', function () {
    'use strict';

    gulp.watch([srcDir + '/**/*.js', '!' + buildDir + '/**'], ['jsConcat', 'jsUglify']);
});