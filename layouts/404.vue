<template>
  <div class="theme-container">
    <div class="content">
      <h1>404</h1>
      <blockquote>{{ getMsg() }}</blockquote>
      <router-link to="/">回到亲爱的首页</router-link>
    </div>
  </div>
</template>

<script>
const msgs = [
  `路从哪来，它就在哪`,
  `我们怎么来到这里的？`,
  `哪怕有一粒花生米，你也不至于醉得找不到路了。`
];

export default {
  methods: {
    getMsg() {
      return msgs[Math.floor(Math.random() * msgs.length)];
    }
  }
};
</script>
