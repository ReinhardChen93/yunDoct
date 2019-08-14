<template>
  <div :style="{height:height}" class="content ">
  </div>
</template>

<script>
export default {
  props: ['height'],
  name: 'NAN'
}
</script>

<style scoped>
  .content {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    font-size: 14px;
    background: url("~@/assets/empty.png") no-repeat center;
    background-size: 126px;
  }
</style>
