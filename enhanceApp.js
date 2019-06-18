
export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  if (process.env.NODE_ENV === 'production' && GA_ID && typeof window !== 'undefined') {
    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }
      i[r].l = 1 * new Date()
      a = s.createElement(o)
      m = s.getElementsByTagName(o)[0]
      a.async = 1
      a.src = g + "?id=" + GA_ID
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga')
    // window.dataLayer = window.dataLayer || [];
    // function gtag() {
    //   if (dataLayer.indexOf(arguments) === -1) {
    //     dataLayer.push(arguments);
    //   }
    // }
    // gtag('js', new Date());
    // gtag('config', GA_ID);

    ga('create', GA_ID, 'auto');
    ga('send', 'pageview');

    router.afterEach(function (to) {
      ga('set', 'page', to.path);
      ga('send', 'pageview');
    })
  }
};
// <!--Global site tag(gtag.js) - Google Analytics-- >
//   <script async src="https://www.googletagmanager.com/gtag/js?id=UA-139922393-1"></script>
//   <script>
//     window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments); }
//     gtag('js', new Date());

//     gtag('config', 'UA-139922393-1');
// </script>
