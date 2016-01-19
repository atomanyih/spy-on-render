var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('default', ['spec']);

gulp.task('spec', function() {
  return gulp.src(['index.js','spec/**/*_spec.js'])
    .pipe(plugins.jasmineBrowser.specRunner())
    .pipe(plugins.jasmineBrowser.server({whenReady: plugins.whenReady}));
});
