<template>
  <NuxtLayout name="show"> </NuxtLayout>
  <!-- 头像姓名账号 -->

  <div class="top-div">
    <div>
      <img
        class="avatar"
        src="https://img.picui.cn/free/2024/09/23/66f096676bb08.png"
        alt="User Image"
      />
    </div>
    <div>
      <!-- *************************************************************************************** -->
      <span class="user-name">你好，{{ userData.username }}</span>

      <br />
      <span>{{ userData.phoneNumber }}</span>
    </div>
  </div>
  <div class="mid-div"></div>
  <!-- 个人信息模块（待做） -->
  <div class="user-message">
    <div class="l-img">
      <!-- 左侧头像 -->
      <img src="" alt="" />
    </div>
    <div>
      <!-- 个人信息（姓名） -->
    </div>
  </div>
  <div class="my">
    <!-- 收藏区域 -->
    <van-grid :column-num="3">
      <van-grid-item icon="star-o" text="收藏" />
      <van-grid-item icon="clock-o" text="问诊历史" />
      <van-grid-item icon="orders-o" text="我的挂号" to="/myregistration" />
    </van-grid>
    <!-- 信息区域 -->
    <van-cell-group>
      <van-cell title="个人信息" is-link to="/userFile" />
      <van-cell title="消息通知" is-link />
      <van-cell title="用户反馈" is-link />
      <van-cell title="疾病百科" is-link />
      <van-cell title="退出登录" is-link @click="dialogVisible = true" />
    </van-cell-group>
  </div>
  <el-dialog v-model="dialogVisible" title="提示" width="80vw">
    <span>确定退出登录吗？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="logoutFun"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import service from "../utils/request";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false);
const userData = reactive({
  id: "",
  username: "",
  age: "",
  avatar: "",
  createdAt: "",
  gender: "",
  updatedA: "",
  phoneNumber: "",
  idCardNumber: "",
  password: "",
});
const loading = ref(true);
onMounted(async () => {
  try {
    const res = await service.get("/auth/user/info");
    console.log("API Response:", res.data);
    if ((res.status = 200)) {
      Object.assign(userData, res.data);
      console.log("Updated userData:", userData);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    loading.value = false;
  }
});

const logoutFun = async () => {
  try {
    dialogVisible.value = false;
    ElMessage({
      message: "退出登录成功!",
      type: "success",
    });
    localStorage.clear();
    delToken();
    navigateTo("/login");
  } catch (error) {
    ElMessage({
      message: "退出登录失败，请重试。",
      type: "error",
    });
  }
};
</script>

<style scoped>
.top-div {
  height: 100px;
  display: flex;
  align-items: center; /* 垂直居中 */
}

.mid-div {
  height: 5px;
  background-color: antiquewhite;
}

.top-div > div {
  flex: 1;
  padding: 30px;
}

.avatar {
  width: 70px;
  border-radius: 50%;
  margin-left: 30px;
}

.user-name {
  font-size: 20px;
}
</style>
