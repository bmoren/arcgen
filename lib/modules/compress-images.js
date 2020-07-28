const log = require('../utils/logger');
const { parseOptions } = require('../utils/parser');
const glob = require('glob');
const sharp = require('sharp');
const fse = require('fs-extra');
// const build = require('./build');
let flags


// compress images using sharp and save 4 stages of resolution to a user specified sub directory.
const compress = (options, flags) => {
  // console.log(flags)

  const startTime = process.hrtime();
  const { srcPath, outputPath, site } = parseOptions(options);
  log.info(`Compressing all images to '${flags.directory}' subdirectory as ${flags.type} at ${flags.quality} quality...` );

  // console.log(srcPath);
  const files = glob.sync('**/*.@(jpg|jpeg|png|webp|tiff)', { cwd: `${srcPath}/pages` }); //all media files

  // console.log(files)

  files.forEach(function(file){

  })


  let file = `${srcPath}/pages/01_environments/01_reformed-topographies/153_P1030459.jpg`
  // let file = `${srcPath}/pages/04_websites/drawing-garden/1-dg.png`


  //make sure there is a place for us to create these files into!
  _existsPath(file, flags);


  // generate the srcset
  if(flags.type === '.jpg'){
    generateJPGsrcset(file, flags)
  } else if(flags.type === '.png'){
    generatePNGsrcset(file, flags)
  } else if(flags.type === '.webp'){
    generateWEBPsrcset(file, flags)
  }else if(flags.type === 'none'){
    generateSourceTypeSrcset(file, flags)
  }


  // display build time
  const timeDiff = process.hrtime(startTime);
  const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6;
  log.success(`Images compressed succesfully in ${duration}ms`);
}



const _existsPath = (file, flags) =>{

  //get json fragments of the path
  let pathDetails = pathInfo(file, flags)

  //check for subdir, create it if it does not exist.
  let pathCheck = `${pathDetails.path}${flags.directory}`
  if (!fse.existsSync(pathCheck)) {
      // Do something
        log.info(`creating ${pathDetails.path}${flags.directory} subdirectory`);
        fse.mkdirSync(`${pathDetails.path}${flags.directory}`)
  }

} // close _existsPath


//generate a scrset of jpg images at 3 different sizes
const generateJPGsrcset = (file, flags) => {

  //get json fragments of the path
let pathDetails = pathInfo(file)

//loop 3 times for 3 sizes
for(let i = 1 ; i <= 3; i++){

  let sizeCalc = Math.floor(flags.maxsize/i)

  //build the output path with the sub directory and specified type as a file extension
  let output = `${pathDetails.path}${flags.directory}/${pathDetails.filename}-w${sizeCalc}.jpg`

  sharp(file)
  .resize(Number(sizeCalc))
  .jpeg({quality: Number(flags.quality)})
  .toFile(output, (err, info) => {
    if (err) log.error(err)
      // if (info) console.log(info)
      log.info(`succesfully converted: ${file} > ${output} `)
    });
  }

} // close generateJPGsrcset


//generate a scrset of jpg images at 3 different sizes
const generatePNGsrcset = (file, flags) => {

  //get json fragments of the path
let pathDetails = pathInfo(file)

//loop 3 times for 3 sizes
for(let i = 1 ; i <= 3; i++){

  let sizeCalc = Math.floor(flags.maxsize/i)

  //build the output path with the sub directory and specified type as a file extension
  let output = `${pathDetails.path}${flags.directory}/${pathDetails.filename}-w${sizeCalc}.png`

  sharp(file)
  .resize(Number(sizeCalc))
  .png({quality: Number(flags.quality)})
  .toFile(output, (err, info) => {
    if (err) log.error(err)
      // if (info) console.log(info)
      log.info(`succesfully converted: ${file} > ${output} `)
    });
  }

} // close generatePNGsrcset


//generate a scrset of webP images at 3 different sizes
const generateWEBPsrcset = (file, flags) => {

  //get json fragments of the path
let pathDetails = pathInfo(file)

//loop 3 times for 3 sizes
for(let i = 1 ; i <= 3; i++){

  let sizeCalc = Math.floor(flags.maxsize/i)

  //build the output path with the sub directory and specified type as a file extension
  let output = `${pathDetails.path}${flags.directory}/${pathDetails.filename}-w${sizeCalc}.webp`

  sharp(file)
  .resize(Number(sizeCalc))
  .webp({quality: Number(flags.quality)})
  .toFile(output, (err, info) => {
    if (err) log.error(err)
      // if (info) console.log(info)
      log.info(`succesfully converted: ${file} > ${output} `)
    });
  }

} // close generatePNGsrcset

//generate a scrset of jpg images at 3 different sizes
const generateSourceTypeSrcset = (file, flags) => {

  //get json fragments of the path
let pathDetails = pathInfo(file)

console.log(pathDetails);

if(pathDetails.extension === 'jpg'){
  generateJPGsrcset(file, flags)
}else if(pathDetails.extension === 'png' ){
  generatePNGsrcset(file, flags)
}else if(pathDetails.extension === 'webp'){
  generateWEBPsrcset(file, flags)
}else{
  log.error(`${pathDetails.extension} file type is not supported, make sure source image files are jpg, png, webp. Or, try forcing a conversion using -t in the CLI`)
}

} // close generatePNGsrcset



/*
//Generate a json object containg information about a file's path including it's path, filename and extension
*/
const pathInfo = (path) => {

  let info = {
    path: 'path',
    filename: ' filename',
    extension: 'extension'
  }

  let endOfPath = path.lastIndexOf('/') //where the last / is at
  let pathOnly = path.substring(0,endOfPath) // grab from the start to the last /, but not including it.

  info.path = pathOnly

  let file = path.split('/').pop().split('.') //get the last ting in the filepath / the enxtension

  info.filename = file[0]
  info.extension = file[1]

  // console.log(info);
  return info;

} //close pathInfo


module.exports = compress;
