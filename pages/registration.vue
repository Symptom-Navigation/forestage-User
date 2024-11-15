<template>
  <NuxtLayout name="show"> </NuxtLayout>
  <div class="re-top-div">
    <div class="span1"></div>
    <el-input
      style="width: 90%"
      placeholder="搜索门诊、医生"
      v-model="searchQuery"
      @input="filterDoctors"
    >
      <template #prefix>
        <el-icon class="el-input__icon"><search /></el-icon>
      </template>
    </el-input>
  </div>
  <!-- 渲染样式 -->
  <div class="regi-top-div">
    <div class="doctor-list">
      <div
        v-for="(item, index) in filteredDoctors"
        :key="index"
        @click="toRegister(item)"
        class="doctor-item"
      >
        <div class="doctor-info">
          <img class="avatar" :src="item.avatar" alt="Avatar" />
          <div>
            <span class="doctor-name">{{ item.username }}</span>
            <span>{{ item.title }}</span>
          </div>
        </div>
        <div>
          <span>就诊科室:</span>
          <span>{{ item.department }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import service from "../utils/request";

interface Doctor {
  id: number;
  department: string;
  title: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  avatar: string | null;
  name: string;
}

const doctorsArr = reactive<Doctor[]>([]);
const searchQuery = ref("");
const filteredDoctors = reactive<Doctor[]>([]);

const filterDoctors = () => {
  const query = searchQuery.value.toLowerCase();
  filteredDoctors.splice(
    0,
    filteredDoctors.length,
    ...doctorsArr.filter(
      (doctor) =>
        doctor.username.toLowerCase().includes(query) ||
        doctor.department.toLowerCase().includes(query)
    )
  );
};

onMounted(async () => {
  try {
    const res = await service.get("/appointments/QueryAllDoctors");
    console.log("Full API Response:", res.doctors);
    if (res.doctors && Array.isArray(res.doctors)) {
      doctorsArr.push(...res.doctors);
      filterDoctors(); // 获取数据后更新筛选列表
    } else {
      console.error("Invalid response structure:", res);
    }
  } catch (error) {
    console.error("Error fetching doctors:", error);
  }
});

const toRegister = (item: Doctor) => {
  navigateTo({ path: "/reg2", query: { doctorInfo: JSON.stringify(item) } });
};
</script>

<style scoped>
.re-top-div {
  text-align: center;
  font-size: 26px;
  background-color: #69c98b;
  height: 70px;
}

.re-top-div .span1 {
  padding-top: 15px;
}

.regi-top-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid;
}

.doctor-list {
  width: 100%;
}

.doctor-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  width: 90%;
}

.doctor-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  margin-right: 20px;
  border-radius: 50%;
}

.doctor-name {
  font-size: 20px;
  font-weight: 700;
  margin-right: 20px;
}
</style>
