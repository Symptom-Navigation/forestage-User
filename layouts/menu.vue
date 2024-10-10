<template>
  <div class="common-layout">
    <el-container>
      <el-header class="e-header">
        <div class="header1">
          <!-- <div class="word-div">
            <span class="sp1">你好，aa</span>
            <br />
            <span class="sp2">希望能够帮助到你</span>
          </div>
          <div class="img-div">
            <img
              src="../assets/logo.jpg "
              style="width: 50px; border-radius: 50%"
            />
          </div> -->
          <el-row>
            <el-col :span="12"
              ><div class="word-div">
                <span class="sp1">你好，小明</span>
                <br />
                <span class="sp2">希望能够帮助到你</span>
              </div></el-col
            >
            <el-col :span="12"
              ><div class="img-div">
                <img
                  src="../assets/logo.jpg "
                  style="width: 50px; border-radius: 50%"
                /></div
            ></el-col>
          </el-row>
        </div>
      </el-header>
      <el-main class="e-main">
        <slot />
      </el-main>
      <el-footer> </el-footer>
    </el-container>
  </div>
</template>
<style>
/*全局去除默认样式*/
* {
  padding: 0;
  margin: 0;
}
.e-header {
  background-color: #69c98b;
  height: 200px;
}
.header1 {
  width: 100%;
  margin-top: 35px;
  /* height: 300px; */

  color: white;
}
.word-div {
  margin-top: 20px;
  height: 100%;
}
.img-div {
  margin-top: 30px;
  margin-left: 30px;
  height: 100%;
}
.header1 .sp1 {
  font-size: 30px;
}
.header1 .sp2 {
  font-size: 18px;
}
.e-main {
  background-color: antiquewhite;
}
</style>
