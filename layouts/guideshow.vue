<template>
  <div class="top-bar">
    <img style="height: 40px" src="../assets/logo/logo1.png" alt="" />
    <div class="top-bar-word">
      <p>可以点击这里查看人体3D模型--></p>
      <a href="3Dmodel.vue">111</a>
    </div>
  </div>

  <div class="layout-page">
    <!-- 插槽 -->
    <!-- <slot /> -->
    <!-- tabbar -->
    <van-tabbar route>
      <van-tabbar-item to="/main" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/guide" icon="notes-o">导诊</van-tabbar-item>
      <van-tabbar-item to="/communication" icon="chat-o">问诊</van-tabbar-item>
      <van-tabbar-item to="/registration" icon="orders-o">挂号</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script setup lang="ts">
import { Search, Operation } from "@element-plus/icons-vue";
</script>
<style>
.top-bar {
  height: 50px;
  background-color: aliceblue;
}
.top-bar img {
  margin-top: 5px;
  margin-left: 10px;
  float: left;
}
.top-bar-word {
  float: right;
}
.top-bar a {
  display: inline-block;
  width: 70px;
  height: 50px;
  line-height: 50px;
  margin-right: 15px;
  text-align: center;
  color: lightgreen; /* 设置文字颜色为浅绿色 */
  text-decoration: none; /* 去掉下划线 */
}
</style>
