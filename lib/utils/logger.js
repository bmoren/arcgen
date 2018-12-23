const chalk = require('chalk');

module.exports = {
  info(message) {
    console.log(chalk`{gray [mcadgen]} ${message}`);
  },

  success(message) {
    console.log(chalk`{gray [mcadgen]} {green ${message}}`);
  },

  error(message) {
    console.log(chalk`{gray [mcadgen]} {red ${message}}`);
  },

  warn(message) {
    console.log(chalk`{gray [mcadgen]} {yellow ${message}}`);
  }
};
