<template>
  <div
    class="theme-container reform"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />
    <!-- 这块代码是主题的头部，shouldShowNavbar是判断是否显示头部
    toggleSidebar是当屏幕出现在手机端目录隐藏或显示的判断-->
    <div class="sidebar-mask" @click="toggleSidebar(false)"></div>
    <!-- 在移动端时点击内容部分目录会隐藏 -->
    <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
      <slot name="sidebar-top" slot="top" />
      <slot name="sidebar-bottom" slot="bottom" />
    </Sidebar>
    <!-- 侧边栏 -->
    <Home v-if="$page.frontmatter.home" />
    <MyHome v-else-if="$page.frontmatter.defaultHome"></MyHome>
    <!-- 如果md文件中有 home:true 就使用该组件 -->
    <Tags v-else-if="tags" />
    <Classify v-else-if="type==='classify'"></Classify>
    <Page v-else :sidebar-items="sidebarItems">
      <slot name="page-top" slot="top" />
      <slot name="page-bottom" slot="bottom" />
    </Page>
    <!-- 一般的md文件使用的组件 -->
  </div>
</template>

<script>
import Home from "@parent-theme/components/Home.vue";
import Navbar from "@theme/components/Navbar.vue";
import Page from "@theme/components/Page.vue";
import Sidebar from "@theme/components/Sidebar.vue";
import Tags from "@theme/components/Tags.vue";
import MyHome from "@theme/components/MyHome.vue";
import Classify from "@theme/components/classify.vue";
import { resolveSidebarItems } from "@theme/util";

import "@theme/styles/iconfont/iconfont.css";
export default {
  components: { Home, Page, Sidebar, Navbar, Tags, MyHome, Classify },

  data() {
    return {
      isSidebarOpen: false,
      tags: false,
      type: ""
    };
  },

  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false;
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      );
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page;
      return (
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      );
    },

    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      );
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          "no-navbar": !this.shouldShowNavbar,
          "sidebar-open": this.isSidebarOpen,
          "no-sidebar": !this.shouldShowSidebar
        },
        userPageClass
      ];
    }
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });
  },
  created() {
    this.checkTags(this.$route.path);
  },
  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },
    checkTags(path) {
      let tags = this.$site.themeConfig.nav.filter(v => v.tags); //判断tags
      if (tags[0].link === path) {
        this.tags = true;
        this.$page.frontmatter.sidebar = false; //tags不需要侧标栏
      } else {
        this.tags = false;
      }
      //判断是否是分类页面
      let type = this.$page.frontmatter.type;

      if (type === "classify") {
        this.type = "classify";
        this.$page.frontmatter.sidebar = false; //tags不需要侧标栏
      } else {
        this.type = "";
      }
      if (this.$page.frontmatter.defaultHome) {
        this.$page.frontmatter.sidebar = false; //主页不需要侧标栏
      }
    }
  },
  watch: {
    $route: function(params) {
      this.checkTags(params.path);
    }
  }
};
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
