var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var webpack = require('webpack-stream');

gulp.task('default', ['spec']);

gulp.task('spec', function() {
  //var plugin = new (require('gulp-jasmine-browser/webpack/jasmine-plugin'))();

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
      watch: true,
      output: {filename: 'spec.js' }
    }))
    .pipe(plugins.jasmineBrowser.specRunner())
    .pipe(plugins.jasmineBrowser.server({whenReady: plugins.whenReady}));
});
