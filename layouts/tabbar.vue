<template>
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
