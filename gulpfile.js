/*******************************
 *           Set-up
 *******************************/

var
  gulp   = require('gulp'),

  // read user config to know what task to load
  config = require('./src/semantic/tasks/config/user')
;


/*******************************
 *            Tasks
 *******************************/

require('./src/semantic/tasks/collections/build')(gulp);
require('./src/semantic/tasks/collections/install')(gulp);

gulp.task('default', gulp.series('watch'));

/*--------------
      Docs
---------------*/

require('./src/semantic/tasks/collections/docs')(gulp);

/*--------------
      RTL
---------------*/

if (config.rtl) {
  require('./src/semantic/tasks/collections/rtl')(gulp);
}