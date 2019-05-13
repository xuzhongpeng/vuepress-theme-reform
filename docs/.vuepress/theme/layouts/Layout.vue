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
    <Home v-if="$page.frontmatter.home"/>
    <MyHome v-if="$page.frontmatter.defaultHome"></MyHome>
  <!-- 如果md文件中有 home:true 就使用该组件 -->
    <Tags v-else-if="tags"/>
    <Page
      v-else
      :sidebar-items="sidebarItems"
    >
      <slot
        name="page-top"
        slot="top"
      />
      <slot
        name="page-bottom"
        slot="bottom"
      />
    </Page>
    <!-- 一般的md文件使用的组件 -->
  </div>
</template>

<script>
import Home from '@parent-theme/components/Home.vue'
import Navbar from '@theme/components/Navbar.vue'
import Page from '@theme/components/Page.vue'
import Sidebar from '@parent-theme/components/Sidebar.vue'
import Tags from '@theme/components/Tags.vue'
import MyHome from '@theme/components/MyHome.vue'
import { resolveSidebarItems } from '@theme/util'

export default {
  components: { Home, Page, Sidebar, Navbar ,Tags,MyHome},

  data () {
    return {
      isSidebarOpen: false,
      tags:false
    }
  },

  computed: {
    shouldShowNavbar () {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (
        frontmatter.navbar === false
        || themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title
        || themeConfig.logo
        || themeConfig.repo
        || themeConfig.nav
        || this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar () {
      const { frontmatter } = this.$page
      return (
        !frontmatter.home
        && frontmatter.sidebar !== false
        && this.sidebarItems.length
      )
    },

    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
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
    this.$router.afterEach(() => {
      this.isSidebarOpen = false
    })
    this.checkTags(this.$route.path)
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
    checkTags(path){
      let tags=this.$site.themeConfig.nav.filter(v=>v.tags)
      if(tags[0].link===path){
        this.tags=true
      }else{
        this.tags=false
      }
    }
  },
  watch:{
    '$route':function(params){
      this.checkTags(params.path)
    }
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
