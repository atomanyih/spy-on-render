require('phantomjs-polyfill');
require('phantomjs-polyfill-find');
require('babel-polyfill');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var webpack = require('webpack-stream');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('default', ['ci']);

function testAssetsStream(watch) {
  return gulp.src(['spec/**/*_spec.js'])
    .pipe(plugins.plumber())
    .pipe(webpack({
      nodeEnv: 'test',
      devtool: 'eval',
      module: {
        loaders: [
          {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
      },
      watch: watch,
      output: {filename: 'spec.js'}
    }));
}

gulp.task('spec', function() {
  //var plugin = new (require('gulp-jasmine-browser/webpack/jasmine-plugin'))();

  return testAssetsStream(true)
    .pipe(plugins.jasmineBrowser.specRunner())
    .pipe(plugins.jasmineBrowser.server({whenReady: plugins.whenReady}));
});


gulp.task('ci', function() {
  return testAssetsStream(false)
    .pipe(plugins.jasmineBrowser.specRunner({console: true}))
    .pipe(plugins.jasmineBrowser.phantomjs());
});

gulp.task('clean-dist', function(done) {
  del(['dist/'])
    .then(function() { done() }, done);
});

gulp.task('build-js', function() {
  return gulp.src(['index.js'])
    .pipe(plugins.plumber())
    .pipe(webpack({
      module: {
        loaders: [
          {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
      },
      output: {filename: 'index.js'}
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy-files', function() {
  return gulp.src(['package.json', 'README.md'], {base: '.'})
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['clean-dist'], function(done) {
  runSequence(['build-js', 'copy-files'], done);
});
