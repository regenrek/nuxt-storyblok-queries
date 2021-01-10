module.exports = {
  plugins: [['babel-plugin-lodash-template-compile']],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true
        }
      }
    ]
  ]
}
