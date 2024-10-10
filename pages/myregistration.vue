<template>
  <NuxtLayout name="back"> </NuxtLayout>
  <div class="containera">
    <h1>我的预约</h1>
    <div
      v-for="(appointment, index) in appointments"
      :key="index"
      class="appointment"
    >
      <div class="appointment-time">{{ appointment.appointmentTime }}</div>
      <div class="appointment-details">
        医生姓名: {{ appointment.doctor.username }}
      </div>
      <div class="appointment-details">科室: {{ appointment.department }}</div>
      <div class="appointment-details">
        预约人: {{ appointment.user.username }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import service from "../utils/request";
import { ElMessage } from "element-plus";

interface User {
  id: number;
  username: string;
}

interface Doctor {
  id: number;
  username: string;
}

interface Appointment {
  id: number;
  user: User;
  doctor: Doctor;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  department?: string; // Assuming department is part of the response
}

const dialogVisible = ref(false);
const appointments = ref<Appointment[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await service.get("/appointments/user/QueryAppointment", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("API Response:", res.data);
    if (res.status === 200) {
      appointments.value = res.data;
      console.log("Updated appointments:", appointments.value);
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    ElMessage.error("获取预约信息失败");
  } finally {
    loading.value = false;
  }
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* 禁用水平滚动条 */
}
.containera {
  max-width: 800px;
  margin: 1px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-height: 80vh; /* 设置最大高度 */
  overflow-y: auto; /* 启用垂直滚动条 */
}
h1 {
  text-align: center;
  color: #333;
}
.appointment {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.appointment:last-child {
  border-bottom: none;
}
.appointment-time {
  font-weight: bold;
  color: #555;
}
.appointment-details {
  margin-top: 5px;
  color: #777;
}
</style>
