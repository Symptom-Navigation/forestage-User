<template>
  <NuxtLayout name="tabbartop">
    <div style="display: flex">
      <div class="main-main-left">
        <!-- 上方去提问div -->
        <div class="to-communication">
          <div>
            <img
              style="width: 39px; height: 28px"
              src="https://staff.chunyu.mobi/@/media/images/2022/06/13/b9d0/1910b6309530_w98_h70_.png"
              alt=""
            />
          </div>
          <div style="margin-right: 10%">
            <span>快速问医生</span><br /><span class="span2-to-communication"
              >一对一在线咨询。您可直接与您的预约医生交流!</span
            >
          </div>
          <div>
            <el-button class="custom-button">去提问</el-button>
          </div>
        </div>
        <!-- 找医生提示件 -->
        <div style="display: flex; margin-top: 20px">
          <div
            style="
              width: 5px;
              height: 20px;
              background-color: #2ec561;
              margin-right: 10px;
            "
          ></div>
          <span>按科室找医生</span>
        </div>
        <!-- 科室展示按键 -->
        <div class="show-department">
          <div class="menu">
            <ul>
              <li>内科</li>
              <li>外科</li>
              <li>儿科</li>
              <li>妇科</li>
              <li>眼科</li>
              <li>耳鼻喉科</li>
              <li>口腔科</li>
              <li>皮肤科</li>
              <li>中医科</li>
              <li>产科</li>
              <li>骨科</li>
              <li>烧伤科</li>
            </ul>
          </div>
        </div>
        <!-- 医生展示卡片 -->
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="16">
            <!--使用el-row el-col行列布局，页面分为24栏，gutter 属性来指定列之间的间距-->
            <el-row :gutter="20" style="padding-bottom: 10px; height: 50%">
              <el-col :span="12">
                <div class="ve-card ve_card1">
                  <div>
                    <p>待处理预约</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="ve-card ve_card2">
                  <div>
                    <p>待面诊预约</p>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="padding-top: 10px; height: 50%">
              <el-col :span="12">
                <div class="ve-card ve_card3">
                  <div>
                    <p>待反馈预约</p>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="ve-card ve_card4">
                  <div>
                    <p>未回复信息</p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div class=""></div>
        <!-- 医学提示件 -->
        <div style="display: flex; margin-top: 50px">
          <div
            style="
              width: 5px;
              height: 20px;
              background-color: #2ec561;
              margin-right: 10px;
            "
          ></div>
          <span>医学知识</span>
        </div>
      </div>

      <div class="main-main-right">
        <div class="redister-show" style="padding-left: 25px">
          <div>
            <br />

            <span>小明</span>
            <span style="padding-left: 15px">预约时间</span>
            <br />
            <span>预约科室</span>
            <span style="padding-left: 15px">预约医生</span>
          </div>
        </div>
        <NuxtLayout name="3d"> </NuxtLayout>
      </div>
    </div>
  </NuxtLayout>
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
