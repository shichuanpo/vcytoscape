// vue.config.js
module.exports = {
  pages: {
    index: 'src/demos/default/main.js',
    toolbar: 'src/demos/toolbar/main.js',
    category: 'src/demos/category/main.js',
    legend: 'src/demos/legend/main.js'
  },
  css: {
    extract: false
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vcytoscape/demo/'
    : '/', // GitHub Pages
  indexPath: 'index.html'
}
