<template>
    <div class="style">
        <van-loading size="24px" color="#333" vertical>加载中</van-loading>
    </div>
</template>

<script>
    export default {
    }
</script>

<style scoped>
*{
    color: #333;
}
.style{
    position: fixed;
    width: 60px; 
    overflow: hidden;
    text-align: center;
    z-index: 99999999;
    top: 50%;
    left: 50%;
    margin-left: -30px;
    height: 70px;
    border-radius: 4px;
    background: #f8f8f8;
    margin-top: -35px;
    padding: 8px 0;
    box-sizing: border-box;
}
</style>
