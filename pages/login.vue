<template>
  <div class="container">
    <div v-if="isLargeScreen" class="login-wrapper large-screen">
      <!-- 第一种样式 -->
      <div class="header">症导医航</div>
      <div class="form-wrapper">
        <input
          type="text"
          id="username"
          name="username"
          placeholder="请输入账号"
          class="input-item"
          v-model="username"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="请输入密码"
          class="input-item"
          v-model="password"
        />
        <div class="btn" @click="loginHandler">登录</div>
      </div>
      <div class="msg">
        还没有账号?
        <a :href="'/register/'">立即注册</a>
      </div>
    </div>
    <div v-else class="login-wrapper small-screen">
      <!-- 第二种样式 -->
      <div class="header">
        <img width="300px" src="../assets/logo/logo1.png" alt="" />
      </div>
      <div class="form-wrapper">
        <input
          type="text"
          name="username"
          placeholder="请输入账号"
          class="input-item"
          v-model="username"
        />
        <input
          type="password"
          name="password"
          placeholder="请输入密码"
          class="input-item"
          v-model="password"
        />
        <div class="btn" @click="loginHandler">登录</div>
      </div>
      <div class="msg">
        还没有账号?
        <a :href="'/register1/'">立即注册</a>
      </div>
    </div>
    <div class="login-image">
      <img src="../assets/images/login.png" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import service from "../utils/request";

const router = useRouter();
const username = ref("");
const password = ref("");
const isLargeScreen = ref(false);
const loginHandler = async () => {
  try {
    const res = await service.post("/auth/login", {
      username: username.value,
      password: password.value,
    });
    if (res.status === 200) {
      setToken(res.data);
      console.log("Login successful:", username.value, res.data);
      router.replace("/main");
    } else {
      console.error("Unexpected response status:", res.status);
    }
  } catch (error) {
    console.error("登录失败", error);
    alert("登录失败，请检查您的账号和密码");
  }
};

const handleResize = () => {
  isLargeScreen.value = window.innerWidth > 768;
};

onMounted(() => {
  handleResize(); // 初始化时检查屏幕宽度
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to right, #fbc2eb, #a6c1ee);
}
.login-wrapper.large-screen {
  box-shadow: rgba(100, 100, 111, 0.4) 0px 7px 29px 0px;
  background-color: #fff;
  width: 16%;
  height: 46%;
  min-width: 300px;
  min-height: 500px;
  border-radius: 15px;
  padding: 0 50px;
  position: relative;
  left: 15%;
  top: 20%;
}
.login-wrapper.small-screen {
  width: 100%;
  height: 100%;
  padding-top: 20%;
  position: relative;
}
.header {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  line-height: 200px;
}
.form-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
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
.input-item::placeholder {
  text-transform: uppercase;
}
.btn {
  text-align: center;
  padding: 10px;
  width: 100%;
  margin-top: 40px;
  background-color: rgba(25, 117, 226, 1);
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

/* 媒体查询 */
@media (max-width: 768px) {
  .container {
    background-color: #fff;
  }
  .input-item {
    width: 80%;
  }
  .btn {
    width: 60%;
  }
  .form-wrapper {
    align-items: center;
  }
  .login-image {
    display: none;
  }
}
</style>
