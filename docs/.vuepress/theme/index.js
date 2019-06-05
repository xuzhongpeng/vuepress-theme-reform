// import http from 'http'
module.exports = (site, Vue) => {
  return {
    extend: "@vuepress/theme-default",
    plugins: [
      [
        (pluginOptions, context) => ({
          name: 'my-gitalk-plugin',
          // ... the rest of options
          async generated(pagePaths) {
            console.log(site.gitTalk)
            // context.pages.forEach((v,k)=>{
            //   if(v.title){
            //     console.log(v.title,v.path)
            //   }
            // })

          }
          ,
          extendCli(cli) {
          cli
            .command('gittalk [targetDir]', 'ggg')
            .option('--debug', 'display info in debug mode')
            .action((dir = '.') => {
              console.log(dir)
              console.log('Display info of your website')
            })
        }
        })
      ]
    ]
  };
};
