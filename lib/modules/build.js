const fse = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const marked = require('marked');
const frontMatter = require('front-matter');
const glob = require('glob');
const log = require('../utils/logger');
const { parseOptions } = require('../utils/parser');
let pageDefs = []

/**
 * Build the site
 */
const build = (options = {}) => {
  log.info('Building site...');
  const startTime = process.hrtime();

  const { srcPath, outputPath, site } = parseOptions(options);

  // clear destination folder
  fse.emptyDirSync(outputPath);

  // copy assets folder
  if (fse.existsSync(`${srcPath}/assets`)) {
    fse.copySync(`${srcPath}/assets`, outputPath);
  }

  //copy local media
  _copyMedia({srcPath, outputPath});

  // read pages
  const files = glob.sync('**/*.@(md|ejs|html)', { cwd: `${srcPath}/pages` });

  // reset it !!!!!!!
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


const _copyMedia = ({srcPath, outputPath}) => {
  // let skip = new RegExp('.md|.ejs|.html$' )

  let filterFunc = (src,dest) =>{
    // console.log(src,dest)

    const filetype = src.split('/').pop()
    // console.log(filetype)
    if (filetype != '.md' && filetype != '.ejs' && filetype != '.html' ) {
      return true;
    } else {
      return false;
    }


  }

  fse.copySync(`${srcPath}/pages`, `${outputPath}` , {filter:filterFunc});

}

const _buildPageDefs = (file, { srcPath }) => {
  const fileData = path.parse(file);
  const media = []
  if (fileData.ext === '.md') {
    // read page file
    let url = '/'
    const filename = file.split('/').pop()
    if (filename === 'index.md') {
      url += file.replace('/index.md', '')
    } else {
      url += file.replace('.md', '')
    }
    const data = fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8');
    const pageData = frontMatter(data);
    pageDefs.push({...pageData.attributes, _filename: fileData.name, url, media})
  }
}

/**
 * Build a single page
 */
const _buildPage = (file, { srcPath, outputPath, site }) => {
  const fileData = path.parse(file);
  let destPath = path.join(outputPath, fileData.dir);

  // create extra dir if filename is not index
  if (fileData.name !== 'index') {
    destPath = path.join(destPath, fileData.name);
  }

  // create destination directory
  fse.mkdirsSync(destPath);

  const mediaSrc = path.resolve(path.dirname('src/pages/'+file))

  // read page file
  const data = fse.readFileSync(`${srcPath}/pages/${file}`, 'utf-8');
  let media = glob.sync('*.!(md|ejs|html)', { cwd: mediaSrc });

  // console.log( media)

  // make media urls absolute
  media = media.map(item => {
    const root = fileData.dir == '' ? '' : `/${fileData.dir}`
    return `${root}/${item}`
  })

  // render page
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
