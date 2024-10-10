<template>
  <div class="login-wrapper">
    <div class="header">
      <img width="300px" src="../assets/logo/logo1.png" alt="" />
    </div>

    <div class="form-wrapper">
      <input
        type="text"
        name="username"
        placeholder="请输入账号"
        class="input-item"
      />
      <input
        type="password"
        name="password"
        placeholder="请输入密码"
        class="input-item"
      />
      <div class="btn">注册</div>
    </div>
    <div class="msg">
      已有账号?
      <a :href="'/login1/'">登录</a>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.form-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-wrapper {
  width: 100%;
  height: 100%;
  padding-top: 20%;
  position: relative;

  // transform: translate(0%, 0%);
}
.header {
  font-size: 38px;
  font-weight: bold;
  text-align: center;
  line-height: 200px;
  font-family: "Open Sans";
}
.input-item {
  display: block;
  width: 80%;
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
  width: 80%;
  border-radius: 5px;
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
</style>
