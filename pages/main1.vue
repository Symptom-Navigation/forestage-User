<template>
  <NuxtLayout name="tabbartop"> </NuxtLayout>
</template>
<script setup lang="ts"></script>
<style scoped>
.redister-show {
  width: 200px;
  height: 100px;
  background-color: #f8f8f8;
}
.main-main-left {
  margin-left: 20%;
  margin-top: 20px;
}
.main-main-right {
  margin-left: 25px;
  margin-top: 20px;
}
.to-communication {
  width: 650px;
  height: 82px;
  background-color: #f8f8f8;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.to-communication > div {
  align-items: center; /* 确保内部元素也垂直居中 */
  margin-right: 10px; /* 添加间距 */
}

.to-communication > div:last-child {
  margin-right: 0; /* 去掉最后一个 div 的右边距 */
}

.custom-button {
  margin-left: 10%;
  width: 100px;
  height: 50px;
  background-color: #2ec561;
  color: white;
}

.span2-to-communication {
  font-size: 13px;
  color: #999;
  letter-spacing: -0.09px;
  line-height: 13px;
}
/*  */
.show-department {
  margin-top: 20px;
  width: 650px;
  height: 82px;
  background-color: #f8f8f8;
}
.menu {
  border: 1px solid #ebebeb;
  background-color: #f9f9f9;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}

.menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu li {
  display: inline-block;
  margin-right: 10px;
  margin-top: 5px;
  padding: 5px 10px;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}
</style>
