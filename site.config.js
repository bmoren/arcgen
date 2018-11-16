module.exports = {
  build: {
    srcPath: './src',
    outputPath: './public'
  },
  site: {
    title: 'Nanogen',
    description: 'Minimalist static site generator in Node.js',
    basePath: process.env.NODE_ENV === 'production' ? '' : ''
  }
};
