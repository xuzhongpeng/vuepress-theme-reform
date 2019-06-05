var http = require('http');
module.exports = (site, Vue) => {
  return {
    extend: "@vuepress/theme-default",
    plugins: [
      [
        (pluginOptions, context) => ({
          name: 'my-gitalk-plugin',
          // ... the rest of options
          async generated(pagePaths) {
            // context.pages.forEach((v,k)=>{
            //   if(v.title){
            //     console.log(v.title,v.path)
            //   }
            // })
            
          }
        })
      ]
    ]
  };
};
