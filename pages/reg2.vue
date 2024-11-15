<template>
  <NuxtLayout name="back">预约挂号</NuxtLayout>
  <div class="reg2-top-div">
    <div>
      <img
        style="width: 50px; margin-left: 20px; border-radius: 50%"
        src="../assets/logo.jpg"
        alt=""
      />
    </div>
    <div>
      <div>
        <span style="font-size: 20px; font-weight: 700; margin-right: 20px">
          {{ doctorInfo.username }}
        </span>
        <span>{{ doctorInfo.title }}</span>
      </div>
      <div>
        <span>就诊科室:</span>
        <span>{{ doctorInfo.department }}</span>
      </div>
    </div>
  </div>
  <div class="reg2-mid-div"></div>
  <div class="reg2-bottom-div">
    <div
      style="
        margin-top: 15px;
        margin-left: 15px;
        margin-bottom: 15px;
        font-weight: 700;
        font-size: 16px;
      "
    >
      信息填写
      <el-icon><Tickets /></el-icon>
    </div>
    <div class="input-container" data-placeholder="就诊人">
      <input
        id="username"
        @input="updateUsername"
        type="text"
        class="input-box"
        placeholder="请输入姓名"
        onfocus="this.placeholder=''"
        onblur="this.placeholder='请输入姓名'"
      />
    </div>
    <div class="input-container" data-placeholder="身份证号">
      <input
        id="IDNumber"
        @input="updateIDNumber"
        type="text"
        class="input-box"
        placeholder="请输入身份证号"
        onfocus="this.placeholder=''"
        onblur="this.placeholder='请输入身份证号'"
      />
    </div>
    <div class="input-container" data-placeholder="手机号">
      <input
        id="telNumber"
        @input="updateTelNumber"
        type="tel"
        class="input-box"
        placeholder="请输入手机号"
        onfocus="this.placeholder=''"
        onblur="this.placeholder='请输入手机号'"
      />
    </div>
    <div class="datetime-container">
      <input
        type="datetime-local"
        class="datetime-box"
        id="meeting-time"
        name="meeting-time"
        value="2024-08-28T19:30"
        min="2024-01-01T00:00"
        max="2034-01-01T00:00"
        @change="updateAppointmentTime"
      />
    </div>
    <div class="input-container" data-placeholder="疾病描述">
      <textarea
        class="textarea-box"
        placeholder="请描述就诊人的疾病/病症..."
        onfocus="this.placeholder=''"
        onblur="this.placeholder='请输入备注'"
        rows="10"
        cols="30"
        id="diseaseDesc"
        @input="updateDiseaseDesc"
      ></textarea>
    </div>
    <div class="input-container">
      <input type="file" @change="handleFileUpload" multiple />
    </div>
    <div class="sub-but">
      <el-button @click="submitAppointment">确认提交</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Tickets } from "@element-plus/icons-vue";
import service from "../utils/request";
import { ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";

const username = ref<string>("");
const IDNumber = ref<string>("");
const telNumber = ref<string>("");
const appointmentDate = ref<string>("");
const appointmentTime = ref<string>("");
const diseaseDesc = ref<string>("");
const doctorInfo = reactive({
  username: "",
  title: "",
  department: "",
});
const files = ref<File[]>([]);

const updateUsername = () => {
  username.value = (
    document.getElementById("username") as HTMLInputElement
  ).value;
};
const updateIDNumber = () => {
  IDNumber.value = (
    document.getElementById("IDNumber") as HTMLInputElement
  ).value;
};
const updateTelNumber = () => {
  telNumber.value = (
    document.getElementById("telNumber") as HTMLInputElement
  ).value;
};
const updateDiseaseDesc = () => {
  diseaseDesc.value = (
    document.getElementById("diseaseDesc") as HTMLTextAreaElement
  ).value;
};
const updateAppointmentTime = () => {
  const meetingTime = (
    document.getElementById("meeting-time") as HTMLInputElement
  ).value;
  const [date, time] = meetingTime.split("T");
  appointmentDate.value = date;
  appointmentTime.value = time + ":00"; // 添加秒数
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    files.value = Array.from(input.files);
  }
};

onMounted(() => {
  const route = useRoute();
  const doctorInfoQuery = route.query.doctorInfo;

  if (typeof doctorInfoQuery === "string") {
    const data = JSON.parse(doctorInfoQuery);
    Object.keys(doctorInfo).forEach((key) => {
      if (key in data) {
        doctorInfo[key as keyof typeof doctorInfo] = data[key];
      }
    });
  } else {
    console.error("doctorInfo is not a valid string");
  }
});

const submitAppointment = async () => {
  const formData = new FormData();
  formData.append("userName", username.value);
  formData.append("doctorName", doctorInfo.username);
  formData.append("appointmentDate", appointmentDate.value);
  formData.append("appointmentTime", appointmentTime.value);
  formData.append("description", diseaseDesc.value);
  files.value.forEach((file, index) => {
    formData.append(`image${index + 1}`, file);
  });

  try {
    const response = await service.post(
      "/appointments/appointments",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.code === "200") {
      ElMessage({
        message: "用户预约成功!",
        type: "success",
      });
      navigateTo("/user");
    }
  } catch (error) {
    ElMessage({
      message: "预约失败，请重试。",
      type: "error",
    });
  }
};
</script>
<style scoped>
.reg2-top-div {
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
.reg2-mid-div {
  height: 5px;
  background-color: antiquewhite;
}
.input-container {
  position: relative;
  width: 100%;
  margin-bottom: 15px;
}
.input-box,
.textarea-box {
  width: 100%;
  padding: 5px 10px 5px 130px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 14px;
  color: #333;
}
.input-box::placeholder,
.textarea-box::placeholder {
  color: #aaa;
}
.input-container::before {
  content: attr(data-placeholder);
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #000;
  font-weight: bold;
  pointer-events: none;
}
.input-container::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 120px;
  transform: translateY(-50%);
  height: 60%;
  width: 1px;
  background-color: #000;
}
.datetime-container {
  position: relative;
  width: 100%;
  margin-bottom: 15px;
}
.datetime-box {
  width: 100%;
  padding: 5px 10px 5px 130px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 14px;
  color: #333;
}
.datetime-container::before {
  content: "就诊时间";
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #000;
  font-weight: bold;
  pointer-events: none;
}
.datetime-container::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 120px;
  transform: translateY(-50%);
  height: 60%;
  width: 1px;
  background-color: #000;
}
.sub-but {
  display: flex;
  justify-content: center;
}
</style>
