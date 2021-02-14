const build = require('./modules/build');
const serve = require('./modules/serve');
const init = require('./modules/init');
const compress = require('./modules/compress-images');
const clean = require('./modules/clean');



module.exports = {
  build,
  serve,
  compress,
  clean,
  init
};
