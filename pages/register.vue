<!-- register.vue -->
<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="header">账号注册</div>
      <div class="form-wrapper">
        <input
          type="text"
          name="username"
          placeholder="请输入账号"
          class="input-item"
          id="username"
          @input="usernameInput"
        />
        <input
          type="password"
          name="password"
          placeholder="请输入密码"
          class="input-item"
          id="password"
          @input="passwordInput"
        />
        <div class="btn" @click="registerFun">注册</div>
      </div>
      <div class="msg">
        已有账号?
        <a :href="'/login/'">返回登录</a>
      </div>
    </div>
    <div class="login-image">
      <img src="../assets/images/login.png" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import service from '../utils/request'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
let username = ref('')
let password = ref('')
const usernameInput = () => {
  username.value = (document.getElementById('username') as HTMLFormElement).value
}
const passwordInput = () => {
  password.value = (document.getElementById('password') as HTMLFormElement).value
}
const registerFun = async() => {
  await service.post('/auth/register', {
    username: username.value,
    password: password.value
  }).then((res:any)=> {
    if (res.code === '200') {
      ElMessage({
        message: '注册成功!',
        type: 'success',
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;

  background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);
}
.login-wrapper {
  box-shadow: rgba(100, 100, 111, 0.4) 0px 7px 29px 0px;
  background-color: #fff;
  width: 300px;
  height: 500px;
  border-radius: 15px;
  padding: 0 50px;
  position: relative;
  left: 15%;
  top: 20%;
  // transform: translate(0%, 0%);
}
.header {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  line-height: 200px;
}
.input-item {
  display: block;
  width: 100%;
  margin-bottom: 20px;
  border: 0;
  padding: 10px;
  border-bottom: 1px solid rgb(128, 125, 125);
  font-size: 15px;
  outline: none;
}
.input-item:placeholder {
  text-transform: uppercase;
}
.btn {
  text-align: center;
  padding: 10px;
  width: 100%;
  margin-top: 40px;
  background-color: rgba(25, 117, 226, 1);
  // background-image: linear-gradient(to right, #a6c1ee, #fbc2eb);
  color: #fff;
}
.msg {
  text-align: center;
  line-height: 88px;
}
a {
  text-decoration-line: none;
  color: rgba(25, 117, 226, 1);
}
.login-image {
  position: absolute;
  display: inline-block;
  bottom: 0px;
  right: 0px;
  width: 60%;
}
.login-image img {
  position: absolute;
  bottom: 0px;
  right: 0px;
  max-width: 100%;
}
</style>
