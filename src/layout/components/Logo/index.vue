<template>
  <div class="logo">
    <img src="~@/assets/images/logo.png" alt=""/>
    <h2 v-show="!collapsed" class="title">NaiveUiAdmin</h2>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    collapsed: {
      type: Boolean
    }
  }
}
</script>

<style lang="less" scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  white-space: nowrap;

  img {
    height: 32px;
  }

  .title {
    color: white;
    margin-bottom: 0;
  }
}
</style>
