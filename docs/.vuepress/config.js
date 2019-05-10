module.exports = {
  title: "永无岛", 
  themeConfig: {
    repo: "https://github.com/xuzhongpeng1",
    editLinkText: "有问题，联系我",
    tags:true,
    markdown: {
      anchor: { permalink: true },
    },
    nav: [
      { text: "主页", link: "/" },
      {
        text: "博文",
        items: [
          { text: "前端", link: "/blog/frontend/" },
          { text: "计算机基础", link: "/blog/computer/" }
        ]
      },
      {
        text: "文档",
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
      "/blog/frontend/": ["", "手写一个promise"],
      "/blog/computer/": [""],
      "/barrage/": ["aaa"]
    },
    sidebarDepth: 5,
    lastUpdated: "Last Updated"
  }
};
