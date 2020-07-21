const chalk = require('chalk');

module.exports = {
  info(message) {
    console.log(chalk`{gray [arcgen]} ${message}`);
  },

  success(message) {
    console.log(chalk`{gray [arcgen]} {green ${message}}`);
  },

  error(message) {
    console.log(chalk`{gray [arcgen]} {red ${message}}`);
  },

  warn(message) {
    console.log(chalk`{gray [arcgen]} {yellow ${message}}`);
  }
};
