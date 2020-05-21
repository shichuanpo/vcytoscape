// vue.config.js
const path = require('path')
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
      // libraryExport: 'default',
      libraryTarget: 'umd'
    }
  },
  chainWebpack: config => {
    const svgSpriteModule = path.resolve(__dirname, './src/vcytoscape/assets/svgs')

    const svgRule = config.module.rule('svg')
    svgRule
      .exclude.add(svgSpriteModule)
      .end()

    const svgSpriteRule = config.module.rule('svg-sprite')
    svgSpriteRule.uses.clear()
    svgSpriteRule
      .test(/\.svg$/)
      .include.add(svgSpriteModule)
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vcytoscape/demo/' // GitHub Pages
    : '/',
  indexPath: 'index.html'
}
