const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');
const log = require('../utils/logger');
const { parseOptions } = require('../utils/parser');


let pageDefs = [];
/**
 * Build the site
 */
const build = (options = {}) => {
  // console.log(options)
  const startTime = process.hrtime();
  const { srcPath, outputPath, site } = parseOptions(options);
  log.info(`Building site to ${outputPath}` );

  // _removeSpaces({srcPath},'-') // remove spaces from all files for stability (location/seperator)

  // clear destination folder
  fse.emptyDirSync(outputPath);
  // fse.emptyDirSync(rootPath);

  // copy assets folder
  if (fse.existsSync(`${srcPath}/assets`)) {
    fse.copySync(`${srcPath}/assets`, outputPath);
  }

  //copy local media to the outputPath
  // ///////////////////////////////////////////HERE NEED TO CLEAN THESE PATHS ON TRANSFER TOO, Might require rewirite of this function.
  // _copyMedia({srcPath, outputPath});
  _copyMediaClean({srcPath, outputPath});


  // read page files that have md or ejs or html extensions
  const files = glob.sync('**/*.@(md|ejs|html)', { cwd: `${srcPath}/pages` });

  // reset the pageDefs on each build
  pageDefs = []


  files.forEach(file => _buildPageDefs(file, { srcPath, outputPath, site }));
  files.forEach(file => _buildPage(file, { srcPath, outputPath, site }));


  // display build time
  const timeDiff = process.hrtime(startTime);
  const duration = timeDiff[0] * 1000 + timeDiff[1] / 1e6;
  log.success(`Site built succesfully in ${duration}ms`);
};


/**
 * Loads a layout file
 */
const _loadLayout = (layout, { srcPath }) => {
  const file = `${srcPath}/layouts/${layout}.ejs`;
  const data = fse.readFileSync(file, 'utf-8');

  return { file, data };
};

/*
//removes digits at the front of a string upto and including an underscore
*/
const _arrayPathCleaner = (files) =>{

  let cleanFiles = []

  // an idea on re-orginizing the folders based on numeric value (but likely easier to do this in frontmatter afterall)
  const regex = /\/\d*_\B/gm; // get digits at the front of  a / within  a string upto and including an underscore

  files.forEach(function(file, i){
    let cleanedPath = file.replace(regex, '/') //clean out the path
    cleanFiles[i] = cleanedPath //keeps things in order vs. push()
  })

  return cleanFiles;
}

/*
//removes digits at the front of a string upto and including an underscore
*/
const _stringPathCleaner = (path) => {
  const regex = /\/\d*_\B/gm; // get digits at the front of a / within a string upto and including an underscore
  return path.replace(regex, '/') //clean out the path
}


/*
//not implemented, maybe should wrap this into the path cleaner above?
//come back to this later :) ... something is off with the paths
*/
// const _removeSpaces = ({ srcPath }, replacementSeperator) =>{
// log.info('removing spaces from filenames...')
//   const files = glob.sync('**', { cwd: `${srcPath}/pages` });
//   // console.log(files);
//   files.forEach(function(file){
//     const regex = /[^A-Za-z0-9./_-]/gm; //only allow a-z A-Z 0-9 . / _ -
//     let spaceless = file.replace(regex, replacementSeperator) //find spaces and replace
//     // console.log(spaceless);
//     // console.log(file,spaceless)
//     fse.rename(file,spaceless) //rename the file
//   })
// }

/**
 * copies all media recurcively to appropriate directory, skipping markdown and system files.
 ARCHIVED FUNCTION
 */
// const _copyMedia = ({srcPath, outputPath}) => {
//
//   let filterFunc = (src,dest) =>{
//     // console.log(src,dest)
//
//     // //grab everything EXCEPT content files (this could be cleaned up to also not grab system files)
//     let fileExtensionChecker = new RegExp('.md|.ejs|.html|.DS_Store$' )
//
//     if( fileExtensionChecker.test( src ) ){
//       return false;
//     }
//
//     return true;
//   }
//
//   fse.copySync(`${srcPath}/pages`, `${outputPath}` , {filter:filterFunc});
//
// }

const _copyMediaClean = ({srcPath, outputPath}) => {

  const files = glob.sync('**/*.!(md|ejs|html)', { cwd: `${srcPath}/pages` }); //anything not a md ejs or html
  // console.log(files)

  files.forEach(function(file,i){

    //this is a hack to add a / to the front of the filepath to make it compatible with the path cleaner, prob a better way to do this, but it's maybe not worth the work?
    // files[i] = `/${file}`
    let to = _stringPathCleaner(`/${file}`)

    // console.log(file, " > ", to);
    fse.copySync(`${srcPath}/pages/${file}`, `${outputPath}/${to}`);
  })

}


/**
 * build a url based off the file & it's location.
 */
const _buildURLdef = (file, { srcPath }) => {
  // let url = '/'
  let url = '/'
    const fileData = path.parse(file);
    if (fileData.ext === '.md') {
      // read page file
      const filename = file.split('/').pop()
      //this is maybe a little wierd since, i took off the / to fix the index it leaves a trailing / in the filepath, we might need more specific conditions for the main home page. I'll resolve this if it's a conflict with my class.
      if (filename === 'index.md') {
        url += file.replace('index.md', '')
      } else {
        url += file.replace('.md', '')
      }
    }

    url = _stringPathCleaner(url)

  return url;
}


/**
 * figure out the parent of the file based on it's path
 */
const _buildParentDef = (file, { srcPath }) => {
  // console.log(file)

  let parent;

  //split the url into an array
  const filepath = file.split('/')

  // check to see if this IS the root dir
  if (filepath.length === 1){
    parent = 'root_directory'

  //check to see if it's at the root level (inside the root dir)
  }else if(filepath.length === 2){
    parent = '/'

  //check to see if this is deeper than the root dir
  }else if(filepath.length >= 3 ){
    //grab the element of the filepath 3 slots from the end. (accounting for the index.md file )
    //example path: the parent (the target) / itself / index.md
    parent = filepath.slice(-3,1)
    parent.toString()
    parent = `/${parent}/`
  }

  parent = _stringPathCleaner(parent)

  return parent;
}


/**
 * build a url to media based off the file & it's location.
 */
const _buildMediaDef = (file, { srcPath }) => {
  // let media = [];
  const fileData = path.parse(file);
  const mediaSrc = path.resolve(path.dirname('src/pages/'+file))

  let media = glob.sync('*.!(md|ejs|html)', { cwd: mediaSrc });

  // make media urls absolute
  media = media.map(item => {
    const root = fileData.dir == '' ? '' : `/${fileData.dir}`
    return `${root}/${item}`
  })

  media = _arrayPathCleaner(media)

  return media;
}

//for simpler than parent operations...
const _buildDepthDef = (url) => {
  return url.split("/").length -2;
}

/**
 * build the 'pages' object definitions, available to each page as a hierarchy of the site.
 // do this first, so that the entire pages scope is available to each page. (if we did it in the page build loop we'd get incomplete results, or would have to go in afterwards and attach it to each page anyway...)
 */
const _buildPageDefs = (file, { srcPath }) => {

    let url = _buildURLdef( file, { srcPath });
    let media = _buildMediaDef( file, { srcPath });
    let depth = _buildDepthDef( url );
    let parent = _buildParentDef( file, { srcPath });
    // console.log(parent)

    //build the individual page's frontmatter definition
    const data = fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8');
    const pageData = frontMatter(data);


    pageDefs.push({...pageData.attributes, url, media, depth, parent})
    // maybe use this function recursively to generate subpages.
}



/**
 * Build a single page
 */
const _buildPage = (file, { srcPath, outputPath, site }) => {

  const fileData = path.parse(file);

  //orig
  let destPath = path.join(outputPath, fileData.dir);
  // console.log(destPath)

  //cleaned of _000
  destPath = _stringPathCleaner(destPath)
  // console.log(destPath)



  // // create extra dir if filename is not index (this is from nanogen, not sure why its here)
  // if (fileData.name !== 'index') {
  //   destPath = path.join(destPath, fileData.name);
  // }

  // create destination directory
  fse.mkdirsSync(destPath);

  // read page file
  const data = fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8');


  let media = _buildMediaDef( file, { srcPath } );


  // render page (including media references)
  const pageData = frontMatter(data);
  const templateConfig = {
    pages: pageDefs,
    site,
    page: {...pageData.attributes, media }
  };

  let pageContent;
  const pageSlug = file.split(path.sep).join('-');

  // generate page content according to file type
  switch (fileData.ext) {
    case '.md':
      pageContent = marked(pageData.body);
      break;
    case '.ejs':
      pageContent = ejs.render(pageData.body, templateConfig, {
        filename: `${srcPath}/page-${pageSlug}`
      });
      break;
    default:
      pageContent = pageData.body;
  }

  // render layout with page contents
  const layoutName = pageData.attributes.layout || 'default';
  const layout = _loadLayout(layoutName, {
    srcPath
  });

  const completePage = ejs.render(
    layout.data,
    Object.assign({}, templateConfig, {
      body: pageContent,
      filename: `${srcPath}/layout-${layoutName}`
    })
  );

  // save the html file
  fse.writeFileSync(`${destPath}/index.html`, completePage);


};

module.exports = build;
