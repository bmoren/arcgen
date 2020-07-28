const build = require('./modules/build');
const serve = require('./modules/serve');
const init = require('./modules/init');
const compress = require('./modules/compress-images');


module.exports = {
  build,
  serve,
  compress,
  init
};
