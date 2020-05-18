// vue.config.js
module.exports = {
  pages: {
    index: 'src/demos/default/main.js',
    toolbar: 'src/demos/toolbar/main.js',
    category: 'src/demos/category/main.js',
    legend: 'src/demos/legend/main.js',
    editable: 'src/demos/editable/main.js',
    integrate: 'src/demos/integrate/main.js'
  },
  css: {
    extract: false
  },
  configureWebpack: {
    output: {
      libraryExport: 'default',
      libraryTarget: 'umd'
    },
    externals: process.env.NODE_ENV === 'lib' ? {
      'element-ui': {
        commonjs: 'element-ui',
        commonjs2: 'element-ui',
        amd: 'element-ui',
        root: 'ELEMENT'
      }
    } : {}
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vcytoscape/demo/'
    : '/', // GitHub Pages
  indexPath: 'index.html'
}
