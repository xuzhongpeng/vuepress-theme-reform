<template>
  <div>
    <div class="content default"></div>
    <div class="tag">
      <div class="items">
        <span>vue</span><span>vue</span><span>vue</span><span>vue</span>
      </div>
      <div class="article-list">
          <Article/>
      </div>
    </div>
  </div>
</template>

<script>
import Article from "@theme/components/Article.vue"
export default {
    components:{
        Article
    }
};
</script>

<style lang='stylus' scoped>
.tag {
  max-width: 46.5rem;
  margin: 0 auto;
  padding: 0 2.5rem;

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
      background-color :red;
      &:hover{
          transform: scale(1.2);
        }
    }
  }
}
</style>
