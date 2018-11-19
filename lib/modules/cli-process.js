const path = require('path');
const mcadgen = require('../index');
const log = require('../utils/logger');

const cliProcess = (input = [], flags = {}) => {
  // command
  const command = input.length > 0 ? input[0] : null;

  if (command === 'init') {
    mcadgen.init();
  } else {
    // config
    const config = flags.config ? require(path.resolve(flags.config)) : {};

    if (command === 'start') {
      mcadgen.serve(config, flags);
    } else if (command === 'build') {
      mcadgen.build(config);
    } else {
      log.error('Invalid command');
    }
  }
};
module.exports = cliProcess;
