// import http from 'http'
module.exports = (site, Vue) => {
  return {
    extend: "@vuepress/theme-default",
    plugins: [
      ['gitalk'],
      [
        (options,context)=>({
          name:'my-google-analytics',
          define() {
            const { siteConfig = {} } = context
            const ga = options.ga || siteConfig.ga
            const GA_ID = ga || false
            return { GA_ID }
          },
        })
      ]
    ]
  };
};
