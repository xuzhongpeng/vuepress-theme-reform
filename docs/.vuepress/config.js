module.exports = {
  title: "JsShou", 
  themeConfig: {
    repo: "https://github.com/xuzhongpeng1",
    editLinkText: "有问题，联系我",
    tags:"tags",
    markdown: {
      anchor: { permalink: true },
    },
    nav: [
      { text: "主页", link: "/" ,icon:'jia'},
      {
        text: "博文",
        icon:'zhi',
        items: [
          { text: "前端", link: "/blog/frontend/" },
          { text: "计算机基础", link: "/blog/computer/" }
        ]
      },
      {
        text: "文档",
        icon:'shuben',
        items: [
          {
            text: "弹幕插件文档",
            link: "/document/barrage/"
          }
        ]
      },
      {
        text:"标签云",
        link:'/tags/',
        tags:true
      },
      { text: "关于我", link: "/about/" }
    ],
    sidebar: {
      "/android/": ["哟西", "android1"],
      "/blog/frontend/": true,
      "/blog/computer/": true,
      "/barrage/": ["aaa"]
    },
    sidebarDepth: 5,
    lastUpdated: "Last Updated"
  }
};
