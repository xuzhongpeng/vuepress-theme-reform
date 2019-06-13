<template>
  <main class="page">
    <slot name="top"/>

    <section class="tags" v-if="this.$site.themeConfig.tags&&tags&&tags.length>0">
      <!-- tags是this.$page.frontmatter.tags，这是通过vuepress编译markdown文件中的tags生成的标签数组。 -->
      <span class="tagPopup" v-for="tag in tags">
        <!-- $site.themeConfig.tags是config.js中配置的tags目录 -->
        <router-link :to="'/'+$site.themeConfig.tags+'/?tag='+tag" class="tag">{{tag}}</router-link>
      </span>
    </section>

    <Content class="content theme-default-content"/>

    <footer class="page-edit">
      <div class="edit-link" v-if="editLink">
        <a :href="editLink" target="_blank" rel="noopener noreferrer">{{ editLinkText }}</a>
        <OutboundLink/>
      </div>

      <div class="last-updated" v-if="lastUpdated">
        <span class="prefix">{{ lastUpdatedText }}:</span>
        <span class="time">{{ lastUpdated }}</span>
      </div>
    </footer>

    <div class="page-nav" v-if="prev || next">
      <p class="inner">
        <span v-if="prev" class="prev">
          ←
          <router-link v-if="prev" class="prev" :to="prev.path">{{ prev.title || prev.path }}</router-link>
        </span>

        <span v-if="next" class="next">
          <router-link v-if="next" :to="next.path">{{ next.title || next.path }}</router-link>→
        </span>
      </p>
    </div>
    <div id="gitalk-container"></div>
    <slot name="bottom"/>
  </main>
</template>

<script>
import { resolvePage, outboundRE, endingSlashRE } from "@parent-theme/util";
import Gitalk from "gitalk";
import imagesZoom from "@theme/util/imageScale";
import "gitalk/dist/gitalk.css";
export default {
  props: ["sidebarItems"],
  data() {
    return {
      path: ""
    };
  },
  computed: {
    lastUpdated() {
      return this.$page.lastUpdated;
    },
    tags() {
      return this.$page.frontmatter.tags;
    },
    lastUpdatedText() {
      if (typeof this.$themeLocaleConfig.lastUpdated === "string") {
        return this.$themeLocaleConfig.lastUpdated;
      }
      if (typeof this.$site.themeConfig.lastUpdated === "string") {
        return this.$site.themeConfig.lastUpdated;
      }
      return "Last Updated";
    },

    prev() {
      const prev = this.$page.frontmatter.prev;
      if (prev === false) {
        return;
      } else if (prev) {
        return resolvePage(this.$site.pages, prev, this.$route.path);
      } else {
        return resolvePrev(this.$page, this.sidebarItems);
      }
    },

    next() {
      const next = this.$page.frontmatter.next;
      if (next === false) {
        return;
      } else if (next) {
        return resolvePage(this.$site.pages, next, this.$route.path);
      } else {
        return resolveNext(this.$page, this.sidebarItems);
      }
    },

    editLink() {
      if (this.$page.frontmatter.editLink === false) {
        return;
      }
      const {
        repo,
        editLinks,
        docsDir = "",
        docsBranch = "master",
        docsRepo = repo
      } = this.$site.themeConfig;

      if (docsRepo && editLinks && this.$page.relativePath) {
        return this.createEditLink(
          repo,
          docsRepo,
          docsDir,
          docsBranch,
          this.$page.relativePath
        );
      }
    },

    editLinkText() {
      return (
        this.$themeLocaleConfig.editLinkText ||
        this.$site.themeConfig.editLinkText ||
        `Edit this page`
      );
    }
  },

  methods: {
    createEditLink(repo, docsRepo, docsDir, docsBranch, path) {
      const bitbucket = /bitbucket.org/;
      if (bitbucket.test(repo)) {
        const base = outboundRE.test(docsRepo) ? docsRepo : repo;
        return (
          base.replace(endingSlashRE, "") +
          `/src` +
          `/${docsBranch}/` +
          (docsDir ? docsDir.replace(endingSlashRE, "") + "/" : "") +
          path +
          `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
        );
      }

      const base = outboundRE.test(docsRepo)
        ? docsRepo
        : `https://github.com/${docsRepo}`;
      return (
        base.replace(endingSlashRE, "") +
        `/edit` +
        `/${docsBranch}/` +
        (docsDir ? docsDir.replace(endingSlashRE, "") + "/" : "") +
        path
      );
    },
    initGitalk() {
      let path = this.$route.path;
      if (path !== this.path) {
        this.initImgZoom();
        this.path = path;
        let a = document.getElementById("gitalk-container");
        if (a && a.children.length > 0) a.innerHTML = "";
        let gitTalkParams = this.$site.themeConfig.gitalk;
        if (Gitalk && gitTalkParams) {
          let labelRule = eval(gitTalkParams.labelRule);
          let id = labelRule(this.$page.title, this.$page.path);
          var gitalk = new Gitalk({
            ...gitTalkParams,
            id: id || this.$page.title
          });
          gitalk.render("gitalk-container");
        }
      }
    },
    initImgZoom() {
      let imgDom = document.getElementsByTagName("img");
      for (let v of imgDom) {
        v.style = `
          cursor: zoom-in;
        `;
        v.addEventListener("click", function(e) {
          let dom = document.createElement("div");
          dom.style = `
            position:fixed;
            top: 0;
            left: 0;
            z-index: 999;
            width:100%;
            height:100%;
            background-color:rgba(46, 46, 46, 0.79);
            display:flex;
            justify-content:center;
            align-items:center;
            cursor: zoom-out;
          `;

          let imgDom = document.createElement("img");
          imgDom.src = this.src;
          imgDom.style = `
            width:70%;
          `;
          dom.append(imgDom);
          document.body.append(dom);
          try {
            imagesZoom.init({
              elem: imgDom,
              parentDom: dom
            });
          } catch (e) {
            console.log(e);
          }

          dom.addEventListener("click", function() {
            document.body.removeChild(dom);
          });
        });
      }
    }
  },
  mounted() {
    this.initGitalk();
  },
  updated() {
    this.initGitalk();
  }
};

function resolvePrev(page, items) {
  return find(page, items, -1);
}

function resolveNext(page, items) {
  return find(page, items, 1);
}

function find(page, items, offset) {
  const res = [];
  flatten(items, res);
  for (let i = 0; i < res.length; i++) {
    const cur = res[i];
    if (cur.type === "page" && cur.path === decodeURIComponent(page.path)) {
      return res[i + offset];
    }
  }
}

function flatten(items, res) {
  for (let i = 0, l = items.length; i < l; i++) {
    if (items[i].type === "group") {
      flatten(items[i].children || [], res);
    } else {
      res.push(items[i]);
    }
  }
}
</script>

<style lang="stylus" scoped>
@require '../styles/wrapper.styl';

.page {
  padding-bottom: 2rem;
  display: block;
  max-width: 55rem;
  margin: 0 auto;
  margin-top: 5rem;
  // width:60%;
}

.tags {
  max-width: 55rem;
  margin: 0 auto;
  margin-top: 5rem;
  margin-bottom: -4rem;
  padding: 2rem;

  // padding-left:0;
  .tagPopup {
    margin-right: 0.8rem;
    display: inline-block;
    padding: 0;
    font-size: 13px;
    margin-bottom: 5px;

    .tag {
      display: inline-block;
      padding: 0 13px;
      color: $accentColor;
      background-color: rgba(1, 126, 102, 0.08);
      height: 25px;
      line-height: 25px;
      font-weight: normal;
      font-size: 13px;
      text-align: center;
    }
  }
}

.page-edit {
  @extend $wrapper;
  padding-top: 1rem;
  padding-bottom: 1rem;
  overflow: auto;

  .edit-link {
    display: inline-block;

    a {
      color: lighten($textColor, 25%);
      margin-right: 0.25rem;
    }
  }

  .last-updated {
    float: right;
    font-size: 0.9em;

    .prefix {
      font-weight: 500;
      color: lighten($textColor, 25%);
    }

    .time {
      font-weight: 400;
      color: #aaa;
    }
  }
}

.page-nav {
  @extend $wrapper;
  padding-top: 1rem;
  padding-bottom: 0;

  .inner {
    min-height: 2rem;
    margin-top: 0;
    border-top: 1px solid $borderColor;
    padding-top: 1rem;
    overflow: auto; // clear float
  }

  .next {
    float: right;
  }
}

@media (max-width: $MQMobile) {
  .tags {
    width: 100%;
    padding: 1rem;
    padding-left: 1.5rem;
    margin-bottom: -4rem;
  }

  .page-edit {
    .edit-link {
      margin-bottom: 0.5rem;
    }

    .last-updated {
      font-size: 0.8em;
      float: none;
      text-align: left;
    }
  }
}

#gitalk-container {
  // width: 100%;
  margin: 0 auto;
  padding: 2rem 2.5rem;
}

</style>
