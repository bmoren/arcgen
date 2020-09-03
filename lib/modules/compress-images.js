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
  const files = glob.sync('**/*.@(jpg|jpeg|png|webp|tiff|gif)', { cwd: `${srcPath}/pages` }); //all media files

  // console.log(files)

  files.forEach(function(file){

    if( file.includes(flags.directory) ) return;


    //test filepaths
    // let file = `${srcPath}/pages/01_environments/01_reformed-topographies/153_P1030459.jpg`
    // let file = `${srcPath}/pages/04_websites/drawing-garden/1-dg.png`


    //make sure there is a place for us to create these files into!
    // let pathCheck = 
    _existsPath(srcPath, file, flags);

    // console.log(pathCheck)

    // if(pathCheck === false){
      // generate the srcset
   
    _generateSrcset(srcPath, file, flags)

    // }


  }) //for each file


  // display build time
  const timeDiff = process.hrtime(startTime);
  const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6;
  log.success(`Images compressed succesfully in ${duration}ms`);
}


const _existsPath = (srcPath, file, flags) =>{

  //get json fragments of the path
  let pathDetails = pathInfo(file, flags)
  
  //check for subdir, create it if it does not exist.
  let pathCheck = `${srcPath}/pages/${pathDetails.path}${flags.directory}` 
  if (!fse.existsSync(pathCheck)) {
      // Do something
      log.info(`creating ${srcPath}/pages/${pathDetails.path}${flags.directory}`);
      fse.mkdirSync(`${srcPath}/pages/${pathDetails.path}${flags.directory}`)
    // return false;
  }else{
    // log.info(`srcset at ${srcPath}/pages/${pathDetails.path}${flags.directory} already exists!`);
    // return true;
    // // return false;
  }

} // close _existsPath


//generate a scrset of jpg images at 3 different sizes
const _generateSrcset = (srcPath, file, flags) => {

  //get json fragments of the path
let pathDetails = pathInfo(file)

//if the srcset folder is not empty then skip it!
let emptyCheck = fse.readdirSync(`${srcPath}/pages/${pathDetails.path}${flags.directory}`)
if (emptyCheck.length > 0) return; 


let sizeCalc = flags.maxsize

//loop 3 times for 3 sizes
for(let i = 1 ; i <= 3; i++){

  if( i>1 ){ sizeCalc = Math.floor(sizeCalc/2) }

  //store the output path with the sub directory and specified type as a file extension
  let output;

  //start up sharp looking at the input file
  let s = sharp(`${srcPath}/pages/${file}`)

  //resize to the calculates size above (halving each time through the loop)
  s.resize(Number(sizeCalc))

  //check to figure out how we are going to do the conversion, if we havnt forced an extension, then use the default filetype, else change to the forced type.
  let outputExtension;

  if (flags.type === 'none'){
    outputExtension = `.${pathDetails.extension}` //add the dot ater the split
  }else{
    outputExtension = flags.type
  }

  if(outputExtension === '.jpg'){
    s.jpeg({quality: Number(flags.quality)})
    output = `${srcPath}/pages/${pathDetails.path}${flags.directory}/${pathDetails.filename}-w${sizeCalc}.jpg`
  }else if(outputExtension === '.png' ){
    s.png({quality: Number(flags.quality)})
    output = `${srcPath}/pages/${pathDetails.path}${flags.directory}/${pathDetails.filename}-w${sizeCalc}.png`
  }else if(outputExtension === '.webp'){
    s.webp({quality: Number(flags.quality)})
    output = `${srcPath}/pages/${pathDetails.path}${flags.directory}/${pathDetails.filename}-w${sizeCalc}.webp`
  }else{
    log.error(`${pathDetails.extension} file type is not supported, make sure source image files are jpg, png, webp. Or, try forcing a conversion using -t in the CLI`)
  }

  s.toFile(output, (err, info) => {
      if (err) log.error(err)
        // if (info) console.log(info)
        // log.info(`succesfully converted: ${file} > ${output} `)
        log.info(`succesfully converted: ${pathDetails.filename}.${pathDetails.extension} > ${output.split('/').pop()} `)

      });
    }

} // close generateJPGsrcset



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
