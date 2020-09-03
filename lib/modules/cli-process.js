const path = require('path');
const arcgen = require('../index');
const log = require('../utils/logger');

const cliProcess = (input = [], flags = {}) => {
  // command
  const command = input.length > 0 ? input[0] : null;

  if (command === 'init') {
    arcgen.init();
  } else {
    // config
    const config = flags.config ? require(path.resolve(flags.config)) : {};

    if (command === 'start') {
      arcgen.serve(config, flags);
    } else if (command === 'build') {
      arcgen.build(config, flags);
    }else if(command ==='compress'){
      arcgen.compress(config, flags)
    } else {
      log.error('Invalid command');
    }
  }
};
module.exports = cliProcess;
