export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  console.log(Vue);
  console.log(options);
  console.log(router);
  console.log(siteData);
  // router.addRoutes([{path:siteData}])
  window.router=router
  let tag = siteData.themeConfig.tag||siteData.themeConfig.tags;
  if (tag != undefined) {
    router.addRoutes([{path:'/'+tag}])
  }
};
