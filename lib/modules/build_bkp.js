const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');
const log = require('../utils/logger');
const { parseOptions } = require('../utils/parser');
const recursiveFiles = require('recursive-files');


let pageDefs = [];
/**
 * Build the site
 */
const build = (options = {}) => {
  // console.log(options)
  const startTime = process.hrtime();
  const { srcPath, outputPath, site } = parseOptions(options);
  log.info(`Building site to ${outputPath}` );


  // clear destination folder
  fse.emptyDirSync(outputPath);
  // fse.emptyDirSync(rootPath);

  // copy assets folder
  if (fse.existsSync(`${srcPath}/assets`)) {
    fse.copySync(`${srcPath}/assets`, outputPath);
  }

  //copy local media to the outputPath
  _copyMedia({srcPath, outputPath});

  // read pages
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

/**
 * copies all media recurcively to appropriate directory, skipping markdown and system files.
 */
const _copyMedia = ({srcPath, outputPath}) => {
  let filterFunc = (src,dest) =>{
    // console.log(src,dest)
    // //grab everything but content files (this could be cleaned up to also not grab system files)
    let fileExtensionChecker = new RegExp('.md|.ejs|.html|.DS_Store$' )

    if( fileExtensionChecker.test( src ) ){
      return false;
    }

    return true;
  }

  fse.copySync(`${srcPath}/pages`, `${outputPath}` , {filter:filterFunc});

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

  return url;
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

  return media;
}


const _buildDepthDef = (url) => {
  // let depth = 0;
  // console.log(url);``
  depth = url.split("/").length -2
  return depth;
}

/**
 * build the 'pages' object definitions, available to each page as a hierarchy of the site.
 // do this first, so that the entire pages scope is available to each page. (if we did it in the page build loop we'd get incomplete results, or would have to go in afterwards and attach it to each page anyway...)
 */
const _buildPageDefs = (file, { srcPath }) => {
  // console.log(file);

    let url = _buildURLdef( file, { srcPath });
    let depth = _buildDepthDef( url );
    let media = _buildMediaDef( file, { srcPath });

    //build the individual page's frontmatter definition
    const data = fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8');
    const pageData = frontMatter(data);


    pageDefs.push({...pageData.attributes, url, media, depth})
    // maybe use this function recursively to generate subpages.
}



/**
 * Build a single page
 */
const _buildPage = (file, { srcPath, outputPath, site }) => {

  const fileData = path.parse(file);

  let destPath = path.join(outputPath, fileData.dir);
  // console.log(destPath)

  // create extra dir if filename is not index
  if (fileData.name !== 'index') {
    destPath = path.join(destPath, fileData.name);
  }

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
