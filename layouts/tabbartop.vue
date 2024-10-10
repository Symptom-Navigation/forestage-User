<template>
  <div class="header">
    <div class="logo">
      <img
        style="width: 150px; padding-left: 70%"
        src="../assets/logo/logo2.png"
        alt=""
      />
    </div>
    <div class="search-contain">
      <el-input style="width: 90%" placeholder="搜索关键字">
        <template #prefix>
          <el-icon class="el-input__icon"><Search /></el-icon>
        </template>
      </el-input>
    </div>
    <div class="user-contain">
      <div
        style="
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-right: 30px;
        "
      >
        <div style="text-align: center; margin-right: 40px">
          <el-icon class="el-input__icon"><User /></el-icon>
          <p style="margin-top: 5px">登录</p>
        </div>
        <div style="text-align: center">
          <el-icon class="el-input__icon"><User /></el-icon>
          <p style="margin-top: 5px">注册</p>
        </div>
      </div>
    </div>
  </div>
  <div class="navbar" id="navbar">
    <ul>
      <li><a :href="'/main1/'" @click="setActive($event)">主页</a></li>
      <li><a :href="'/guide/'" @click="setActive($event)">导诊</a></li>
      <li><a :href="'/registration1/'" @click="setActive($event)">挂号</a></li>
      <li>
        <a :href="'/communication/'" @click="setActive($event)">在线问诊</a>
      </li>
      <li><a :href="'/#/'" @click="setActive($event)">我的预约</a></li>
      <li><a :href="'/#/'" @click="setActive($event)">3D模型</a></li>
      <li><a :href="'/help/'" @click="setActive($event)">帮助</a></li>
    </ul>
  </div>
  <div class="content">
    <slot />
  </div>
</template>

<script setup>
import { Search, User } from "@element-plus/icons-vue";

const setActive = () => {
  // 移除所有a标签的active类
  const links = document.querySelectorAll(".navbar a");
  links.forEach((link) => link.classList.remove("active"));

  // 为点击的a标签添加active类
  event.target.classList.add("active");
};
</script>

<style scoped>
/*  */

/*  */
body {
  margin: 0;
}
.header {
  width: 100%;
  height: 100px;
  /* background-color: pink; */
  display: flex;
}

.header > div {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar {
  width: 100%;
  height: 50px;
  line-height: 40px;
  text-align: center;
  /* 粘性定位 */
  position: sticky;
  left: 0;
  top: 0;
  z-index: 99;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #2ec561;
  display: flex;
  justify-content: center;
}

li {
  float: left;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 5px 25px;
  text-decoration: none;
}

li a:hover {
  background-color: #008e2f;
}

li a.active {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #1e8741;
}
</style>
