const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const server = require('../utils/server');
const log = require('../utils/logger');
const build = require('./build');
const { parseOptions } = require('../utils/parser');

//added when ingesting the server.js util
const liveServer = require('live-server');

let flagsPass

/**
 * Serve the site in watch mode
 */
const serve = (options, flags) => {
  log.info(`Starting local server at http://localhost:${flags.port}`);

  const { srcPath, outputPath } = parseOptions(options);

  build(options,flags);

  // server.serve({ path: outputPath, port: flags.port});

  //added when ingesting the server.js util
      liveServer.start({
        port: flags.port,
        root: outputPath,
        logLevel: 0
      });


  chokidar.watch(srcPath, { ignoreInitial: true }).on(
    'all',
    debounce(() => {
      build(options, flags);
      log.info('Waiting for changes...');
    }, 500)
  );
};

module.exports = serve;
