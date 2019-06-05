module.exports = (options, context) => {
    return {
        extendCli(cli) {
            cli
                .command('gitalk [targetDir]', '')
                .option('--debug', 'display info in debug mode')
                .action(() => {
                    var site = require(context.sourceDir + '/.vuepress/config.js')
                    var talkConfig = site().themeConfig.gitTalk
                    var createGitalk=require('./gitalk.js')
                    var pages=context.pages.filter(v=>v.title)
                    if(talkConfig.labelRule){
                        pages=pages.map(v=>{
                            v.path=eval(talkConfig.labelRule)(v.title,v.path)
                            return v
                        })
                    }
                    createGitalk(pages,talkConfig)
                })
        }
    }
}