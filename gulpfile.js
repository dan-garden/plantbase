require('dotenv').config();
const gulp = require("gulp");
const concat = require("gulp-concat");
const fs = require("fs");
const browserify = require("browserify");
const uglify = require("gulp-uglify");
const browserSync = require('browser-sync').create();
const rename = require("gulp-rename");
const clean = require('gulp-clean');

const paths = {
  src: './src/**/*.js',
  watch: './public/*.html',
  dist: './public/assets/dist/',
  srcfile: 'main.js',
  minfile: 'main.min.js'
};


gulp.task('concat', function () {
  return gulp.src(paths.src)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('babel', function () {
  return browserify(paths.dist + paths.srcfile)
    .transform("babelify", {
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ['@babel/plugin-transform-runtime']
    })
    .bundle()
    .pipe(fs.createWriteStream(paths.dist + paths.minfile))
});

gulp.task('compress', function () {
  return gulp.src(paths.dist + paths.minfile)
  .pipe(uglify())
  .pipe(concat(paths.minfile))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('clean-src', function() {
  return gulp.src(paths.dist + paths.srcfile)
  .pipe(clean());
});

gulp.task('rename', function() {
  return gulp.src(paths.dist + paths.minfile)
  .pipe(rename(paths.srcfile))
  .pipe(gulp.dest(paths.dist));
});

gulp.task('clean-min', function() {
  return gulp.src(paths.dist + paths.minfile)
  .pipe(clean());
});

gulp.task('reload-browser', function(done) {
  browserSync.reload();
  done();
})

gulp.task('watch', function() {
  browserSync.init({
      proxy: "localhost:" + process.env.PORT,
      notify: false
});

  gulp.watch(paths.watch).on('change', browserSync.reload);
  gulp.watch([paths.src], gulp.series(['concat', 'babel', 'reload-browser']));
})


gulp.task('default', gulp.series(['concat', 'babel', 'compress', 'clean-src', 'rename', 'clean-min']));