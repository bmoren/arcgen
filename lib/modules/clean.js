const log = require('../utils/logger');
const { parseOptions } = require('../utils/parser');
const fse = require('fs-extra');
const walker = require('walker')

let foundDirectories = []

const clean = (options, flags) => {
  // console.log(flags)

  const { srcPath, outputPath, site } = parseOptions(options);

  const startTime = process.hrtime();
  log.info(`searching for ${flags.directory} directories...`)

  //compile all directories into an array.
  walker(`${srcPath}`)
  .on('dir', function(dir, stat) {
    // console.log('Got directory: ' + dir)

    //check that the directory is the srcset
    if(dir.includes(flags.directory)){
      //have to store it so that it doesn't glitch out walker while simultaneously looking for and deleting files...
      foundDirectories.push(dir)
    }
  })
  .on('end', function() {

    log.info(`${foundDirectories.length} ${flags.directory} directories found`)
    // console.log(foundDirectories);

    // loop through all the dirs and delete them.
    foundDirectories.forEach( dir => {

      try {    
        fse.rmdirSync(dir, { recursive: true });
        log.info(`successfully deleted: ${dir}`)

      } catch (err) {
        console.error(`Error while deleting: ${dir}`);
      }

    })

    const timeDiff = process.hrtime(startTime);
    const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6;
    log.success(`Deleted srcset folders successfully in ${duration}ms`);

  })




} // end delete function

module.exports = clean;
