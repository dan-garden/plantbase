var gulp = require("gulp");
var concat = require("gulp-concat");
var fs = require("fs");
var browserify = require("browserify");
var uglify = require("gulp-uglify");


gulp.task('concat', function () {
  return gulp.src('./src/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./public/assets/dist/'));
});

gulp.task('babel', function () {
  return browserify("./public/assets/dist/main.js")
    .transform("babelify", {
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ['@babel/plugin-transform-runtime']
    })
    .bundle()
    .pipe(fs.createWriteStream("./public/assets/dist/main.min.js"))
});

gulp.task('compress', function () {
  return gulp.src('./public/assets/dist/main.min.js')
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(gulp.dest('./public/assets/dist/'));
})

// Default Task
gulp.task('default', gulp.series(['concat', 'babel', 'compress']));