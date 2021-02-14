const path = require('path');
const fse = require('fs-extra');
const cp = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const log = require('../utils/logger');

const init = () => {
  log.info('Initializing a new arcgen site ...');

  // copy template files
  fse.copySync(path.resolve(__dirname, '../../template'), '.');

  cp.execSync('npm init -y');

  // add scripts to package.json
  const packageJSON = require(path.relative(__dirname, './package.json'));
  packageJSON.scripts = {
    start: 'arcgen start',
    build: 'arcgen build'
  };
  fse.writeFileSync('./package.json', JSON.stringify(packageJSON, null, 2));

  // install arcgen
  const spinner = ora('Installing dependencies...').start();
  cp.exec('npm i -D arcgen --loglevel error', () => {
    spinner.succeed();

    log.success(`Site initialized succesfully!`);
    log.info(
      chalk`Now you can run:
  {cyan arcgen start}  to start your new site, or
  {cyan arcgen build}  to build it into the 'public' folder.`
    );
  });
};

module.exports = init;
