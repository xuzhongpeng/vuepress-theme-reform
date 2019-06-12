<template>
  <div>
    <div class="content default"></div>
    <div class="tag">
      <div class="items">
        <span
          v-for="taginfo in tags"
          :style="{backgroundColor:color()}"
          @click="change(taginfo.tag)"
          :class="taginfo.tag===tg?'active':''"
        >{{taginfo.tag}}({{taginfo.number}})</span>
      </div>
      <div class="article-list">
        <Article v-for="tag in info" :tag="tag" :tg="tg" @turnTo="change"/>
      </div>
    </div>
  </div>
</template>

<script>
import Article from "@theme/components/Article.vue";
export default {
  components: {
    Article
  },
  data() {
    return {
      info: [],
      tg: ""
    };
  },
  computed: {
    tags() {
      //核心代码，整合markdown中tags的数目
      let allTags = [];
      this.$site.pages.forEach(v => {
        if (v.frontmatter.tags) {
          allTags.push(v.frontmatter.tags);
        } else if (v.frontmatter.tag) {
          allTags.push(v.frontmatter.tag);
        }
      });
      allTags = allTags.join(",").split(",");
      let flatTags = Array.from(new Set(allTags));
      let all = [
        {
          tag: "全部",
          number: this.$site.pages.filter(v => v.title).length
        }
      ];
      return flatTags.reduce((res, v) => {
        let o = {};
        o.tag = v;
        o.number = allTags.filter(value => value === v).length;
        res.push(o);
        return res;
      }, all);
    }
  },
  methods: {
    change(tag) {
      //点击标签下面文章显示对应的内容
      this.tg = tag;
      if (tag === "全部") {
        this.info = this.$site.pages.filter(v => v.title);
      } else {
        this.info = this.$site.pages.filter(v => {
          let tags = v.frontmatter.tags;
          if (tags) {
            return tags.some(v => v === tag);
          }
        });
      }
      this.info = this.info.sort((pre, next) => {
        if (pre.lastUpdated === undefined) return 1;
        if (next.lastUpdated === undefined) return -1;
        return (
          new Date(next.lastUpdated).getTime() -
          new Date(pre.lastUpdated).getTime()
        );
      });
    },
    color() {
      // 标签button颜色
      let colors = [
        "#3498DB",
        "#3EAF7C",
        "#5CBBF6",
        "#f5A28E",
        "#f2AC3B",
        "#FA6551",
        "#C68CE0"
      ];
      return colors[parseInt(Math.random() * colors.length)];
    }
  },
  mounted() {
    //当路由?tag='xxx'时能自动跳转到对应内容
    let tag = this.$route.query.tag;
    if (tag) {
      this.change(tag);
    } else {
      this.change("全部");
    }
  }
};
</script>

<style lang='stylus' scoped>
.tag {
  max-width: 60rem;
  margin: 0 auto;
  padding: 1rem 0.5rem;

  .items {
    margin-bottom: 2rem;

    span {
      vertical-align: middle;
      cursor: pointer;
      margin: 0.5rem 0.5rem 0.2rem;
      padding: 0.4rem 0.7rem;
      display: -webkit-inline-box;
      display: -ms-inline-flexbox;
      display: inline-flex;
      border-radius: 0.2rem;
      background: #fff;
      color: #fff;
      font-size: 1rem;
      box-shadow: 0 1px 0.25rem 0 hsla(0, 0%, 57%, 0.21);
      transition: all 0.3s;
      background-color: red;

      &.active {
        transform: scale(1.2);
      }

      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>
