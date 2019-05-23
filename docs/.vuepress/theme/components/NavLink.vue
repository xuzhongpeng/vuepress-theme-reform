<template>
  <router-link
    class="nav-link"
    :to="link"
    v-if="!isExternal(link)"
    :exact="exact"
  ><span :class="'reform-'+item.icon"></span>{{ item.text }}</router-link>
  
  <a
    v-else
    :href="link"
    class="nav-link external"
    :target="isMailto(link) || isTel(link) ? null : '_blank'"
    :rel="isMailto(link) || isTel(link) ? null : 'noopener noreferrer'"
  ><span :class="'reform-'+item.icon"></span>
    {{ item.text }}
    <OutboundLink/>
  </a>
</template>

<script>
import { isExternal, isMailto, isTel, ensureExt } from '../util'

export default {
  props: {
    item: {
      required: true
    }
  },

  computed: {
    link () {
      return ensureExt(this.item.link)
    },

    exact () {
      if (this.$site.locales) {
        return Object.keys(this.$site.locales).some(rootLink => rootLink === this.link)
      }
      return this.link === '/'
    }
  },

  methods: {
    isExternal,
    isMailto,
    isTel
  },
  mounted(){
    //console.log(this.item)
  }
}
</script>
