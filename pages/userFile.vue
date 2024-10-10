<template>
  <NuxtLayout name="back">个人信息</NuxtLayout>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
        <el-button style="float: right" type="primary" @click="editProfile"
          >编辑</el-button
        >
      </div>
      <div v-if="!loading">
        <p><strong>姓名:</strong> {{ user.username }}</p>
        <p><strong>性别:</strong> {{ user.gender }}</p>
        <p><strong>电话:</strong> {{ user.phoneNumber }}</p>
        <p><strong>身份证号:</strong> {{ user.idCardNumber }}</p>
      </div>
      <div v-else>
        <el-spinner>加载中...</el-spinner>
      </div>
    </el-card>

    <el-dialog style="width: 80%" v-model="dialogVisible" title="编辑个人信息">
      <el-form :model="editUser">
        <el-form-item label="用户名">
          <el-input v-model="editUser.username"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="editUser.gender"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="editUser.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="editUser.idCardNumber"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import service from "~/utils/request";

const dialogVisible = ref(false);
const loading = ref(true);

const user = reactive({
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

const editUser = reactive<any>({});

const fetchUserData = async () => {
  try {
    const res = await service.get("/auth/user/info");
    console.log("API Response:", res.data);
    if (res.status === 200) {
      Object.assign(user, res.data);
      console.log("Updated user:", user);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUserData);

const editProfile = () => {
  Object.assign(editUser, user);
  dialogVisible.value = true;
};

const saveProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await service.put("/auth/user/update-profile", editUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      Object.assign(user, editUser);
      dialogVisible.value = false;
      ElMessage.success("个人信息更新成功");
    } else {
      ElMessage.error("更新失败");
    }
  } catch (error) {
    ElMessage.error("更新失败");
  }
};
</script>

<style scoped>
.box-card {
  margin: 20px;
}
</style>
