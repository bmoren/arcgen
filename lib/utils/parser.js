const buildDefaults = { srcPath: './src', outputPath: './public' };

/**
 * Parse options, setting the defaults on missing values
 */
const parseOptions = options => {
  const { srcPath, outputPath } = Object.assign(
    {},
    buildDefaults,
    options.build
  );
  const site = options.site || {};

  //chop off all of the sub dirs for serving incase they are building to a sub directory.
  // let rootPath = outputPath.split('/')[1] ;
  // let subDir = outputPath.split('/')[2] ;

  return { srcPath, outputPath, site };
};

module.exports = {
  parseOptions
};
