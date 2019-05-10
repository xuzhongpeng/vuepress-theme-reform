<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  > 
    <Navbar
      v-if="shouldShowNavbar"
      @toggle-sidebar="toggleSidebar"
    />
<!-- 这块代码是主题的头部，shouldShowNavbar是判断是否显示头部
toggleSidebar是当屏幕出现在手机端目录隐藏或显示的判断 -->
    <div
      class="sidebar-mask"
      @click="toggleSidebar(false)"
    ></div>
<!-- 在移动端时点击内容部分目录会隐藏 -->
    <Sidebar
      :items="sidebarItems"
      @toggle-sidebar="toggleSidebar"
    >
      <slot
        name="sidebar-top"
        slot="top"
      />
      <slot
        name="sidebar-bottom"
        slot="bottom"
      />
    </Sidebar>
    <!-- 侧边栏 -->
    <div
      class="custom-layout"
      v-if="$page.frontmatter.layout"
    >
      <component :is="$page.frontmatter.layout"/>
    </div>
    <!-- 内容显示部分，可通过在md文件中使用layout: xxx.vue作为布局组件 -->
    <Home v-else-if="$page.frontmatter.home"/>
    <!-- 如果md文件中有 home:true 就使用该组件 -->
    <Page
      v-else
      :sidebar-items="sidebarItems"
    >
      <slot
        name="page-top"
        slot="top"
      />
      <!-- 内容部分头部 -->
      <slot
        name="page-bottom"
        slot="bottom"
      />
      <!-- 内容部分尾部 -->
    </Page>
    <!-- 一般的md文件使用的组件 -->
    <SWUpdatePopup :updateEvent="swUpdateEvent"/>
    <!-- 页面刷新组件 详情移步 
    https://vuepress.vuejs.org/zh/default-theme-config/#%E5%88%B7%E6%96%B0%E5%86%85%E5%AE%B9%E7%9A%84%E5%BC%B9%E7%AA%97 -->
  </div>
</template>

<script>
import Vue from 'vue'
import nprogress from 'nprogress'
import Home from './Home.vue'
import Navbar from './Navbar.vue'
import Page from './Page.vue'
import Sidebar from './Sidebar.vue'
import SWUpdatePopup from './SWUpdatePopup.vue'
import { resolveSidebarItems } from './util'

export default {
  components: { Home, Page, Sidebar, Navbar, SWUpdatePopup },

  data () {
    return {
      isSidebarOpen: false,
      swUpdateEvent: null
    }
  },

  computed: {
    shouldShowNavbar () {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (
        frontmatter.navbar === false ||
        themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar () {
      const { frontmatter } = this.$page
      return (
        !frontmatter.layout &&
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      )
    },

    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$route,
        this.$site,
        this.$localePath
      )
    },

    pageClasses () {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar
        },
        userPageClass
      ]
    }
  },

  mounted () {
    window.addEventListener('scroll', this.onScroll)
    // configure progress bar
    nprogress.configure({ showSpinner: false })

    this.$router.beforeEach((to, from, next) => {
      if (to.path !== from.path && !Vue.component(to.name)) {
        nprogress.start()
      }
      next()
    })

    this.$router.afterEach(() => {
      nprogress.done()
      this.isSidebarOpen = false
    })

    this.$on('sw-updated', this.onSWUpdated)
  },

  methods: {
    toggleSidebar (to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
    },

    // side swipe
    onTouchStart (e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    },

    onTouchEnd (e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    },

    onSWUpdated (e) {
      this.swUpdateEvent = e
    }
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="./styles/theme.styl" lang="stylus"></style>
