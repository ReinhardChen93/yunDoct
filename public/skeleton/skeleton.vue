<template>
  <div class=" skeleton ">
    <span class="iconfont iconloding masked"></span>
  </div>
</template>

<style>
  .skeleton {
    position: fixed;
    overflow: hidden;
    padding: 15px;
    box-sizing: border-box;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .skeleton span {
    position: absolute;
    top: 50%;
    font-size: 40px;
    margin-top: -20px;
    text-align: center;
    width: 100%;
    left: 0;
    right: 0;
    font-weight: bold;
  }
  .masked {
    text-align: center;
    background-image: -webkit-linear-gradient(left, #d6d7dc, #f2f2f2 25%, #d6d7dc 50%, #f2f2f2 75%, #d6d7dc);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-background-size: 200% 100%;
    -webkit-animation: masked-animation 4s infinite linear;
  }
  @-webkit-keyframes masked-animation {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
</style>
