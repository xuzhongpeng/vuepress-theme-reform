// import http from 'http'
module.exports = (site, Vue) => {
  return {
    extend: "@vuepress/theme-default",
    plugins: [
      [
        require('../../../src/index.js')
      ]
    ]
  };
};
