

## 介绍

项目地址：[vuepress-theme-reform](https://github.com/xuzhongpeng/vuepress-theme-reform)

效果展示： [我的博客](http://JSShou.cn)

此主题继承至vuepress的默认主题，添加功能有标签页改造，主页改造，博客分类及展示，gitalk集成及gitalk自动化配置
## 使用

```
npm install vuepress-theme-reform -D # or yarn add vuepress-theme-reform
```
然后在docs/.vuepress/config.js文件中添加
```
{
  ...
  theme:'reform'
  ...
}
```
即可使用本主题

## 功能介绍
### 主页展示
如需使用主页展示
在docs下的README.md中修改defaultHome:true
```
---
defaultHome: true
___
```
![主页展示](	https://blog-1253495453.cos.ap-chongqing.myqcloud.com/%E4%B8%BB%E9%A1%B5.gif)
### 目录分类及展示

在config.js中配置
```
...
nav: [
      ...
      {
        text: "博文",
        icon: 'zhi',
        items: [
          { text: "前端", link: "/blog/frontend/" }
        ]
      }
      ...
]
```
在docs/blog/frontend下新建README.md，在头部编写
```
---
type: 'classify'
---
```
那此文件夹下的其它文件都会被编译成展示的博文,此中的/blog/frontend自行定义
![分类](https://blog-1253495453.cos.ap-chongqing.myqcloud.com/%E5%88%86%E7%B1%BB.gif)

## 标签云集成

在docs下新建tags,在tags下新建空的README.md

在config.js中的themeConfig下配置
```
...
themeConfig:{
  ...
  tags:"tags"
  ...
  nav:[
    ...
    {
        text: "标签云",
        link: '/tags/',
        tags: true
      },
      ...
  ]
}
...
```
其中后面的tags表示你标签云的文件夹名

在我们写的文章中写
```
---
tags:
  - vuepress
---
```
就能在页面中看到效果
![标签云](https://blog-1253495453.cos.ap-chongqing.myqcloud.com/%E6%A0%87%E7%AD%BE%E4%BA%91.gif)

## gitalk

在config.js中配置
```
{
  themConfig:{
    ...
    gitalk: {
      // gitalk的主要参数
      clientID: `your clientID`,
      clientSecret: `your clientSecret`,
      repo: `your repo`,
      owner: "yourname",
      admin: ["yourname"],
      accessToken: 'your accessToken ',
      labelRule: `(title,path)=> {
        let paths=path.split('/')
        if(paths.length>0){
          let res = paths.pop()
          if(res===''){
            res=paths.pop()
          }
          res = res.slice(-50)
          return res
        }else{
          return title
        }
      }`
    },
    ...
  }
}
```
- clientID： 你的clientID，在github的Settings/Developer settings/OAuth Apps下创建获取
- clientSecret：  你的clientSecret，在github的Settings/Developer settings/OAuth Apps下创建获取
- repo: 你的评论存放的仓库名，如我的为xuzhongpeng.github.io
- owner: 你的github账户名
- admin: 评论下展示的名字
- accessToken: 可选，用于自动化创建gitalk时发送请求的taken，在github的Settings/Developer settings/Personal access tokens下创建获取
- labelRule: 评论请求及自动化创建评论时的回调函数，有回调函数的原因在于gitalk标签只能有50个字符的限制，回调函数的第一个参数为当前页面的标题，第二个参数当前页面的路径，返回创建的标签名

## gitalk自动化创建

下载安装插件
```
yarn add vuepress-plugin-gitalk # npm i vuepress-plugin-gitalk -D
```
在package.json中的scripts中加入
```
{
  "scripts":{
    ...
    "gitalk": "vuepress gitalk ./docs",
    ...
  }
}
```
执行
```
npm run gitalk
```
即可输出自动化初始化评论的结果

## 最新Google Analytics插件集成

vuepress提供了@vuepress/plugin-google-analytics,我使用过后没有效果，去google-analytics网站上发现当前的插入代码已有变化，所以自己内置了插件，只需在config.js中配置即可。

```
{
  ga:'XXXX'
}
```

## 错误处理
如果自动化创建评论时输出
```
接口返回数据{"message":"Bad credentials","documentation_url":"https://developer.github.com/v3"}
xxx 创建失败
```
报这个错误大概率是accessToken失效了，这时需要重新到github的Settings/Developer settings/Personal access tokens下创建获取并替换

项目地址：[vuepress-theme-reform](https://github.com/xuzhongpeng/vuepress-theme-reform)

效果展示： [我的博客](http://JSShou.cn)