<template>
  <div class="container">
    <NuxtLayout name="back">{{ doctorInfo.username }} </NuxtLayout>

    <div class="common-layout">
      <el-container>
        <el-main>
          <div id="messageContainer">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="
                msg.id === userid
                  ? 'message-container'
                  : 'message-container-left'
              "
            >
              <img
                v-if="msg.id !== userid"
                src="../assets/logo.jpg"
                alt="icon"
                class="message-icon"
              />
              <div class="message">{{ msg.text }}</div>
              <img
                v-if="msg.id === userid"
                src="../assets/logo.jpg"
                alt="icon"
                class="message-icon"
              />
            </div>
          </div>
        </el-main>
        <el-footer>
          <div class="bottom-bar">
            <input
              type="text"
              v-model="messageInput"
              placeholder="请输入内容"
            />
            <button @click="sendMessage">发送</button>
          </div>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const userid = "your_user_id"; // 替换为实际的用户ID
const messageInput = ref("");
const messages = ref([]);
// 设置为医生信息，但实际不一定
let doctorInfo = reactive({
  username: "",
  title: "",
  department: "",
});
onMounted(() => {
  let data = JSON.parse(useRoute().query.doctorInfo);
  for (let key in doctorInfo) {
    doctorInfo[key] = data[key];
  }
});
function sendMessage() {
  if (messageInput.value.trim() !== "") {
    messages.value.push({ id: userid, text: messageInput.value });
    messageInput.value = "";
  }
}
</script>

<style scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff2e0;
}
/* 输入框样式 */
.bottom-bar {
  position: fixed;
  bottom: 30px;
  width: 90%;
  left: 5%;
  padding: 10px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px 10px 0 0;
}
.bottom-bar input {
  width: 80%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  box-sizing: border-box;
  margin-right: 10px;
}
.bottom-bar button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 9px 10px;
  border-radius: 5px;
  cursor: pointer;
}
.bottom-bar button:hover {
  background-color: #0056b3;
}
.message-container,
.message-container-left {
  display: flex;
  align-items: center;
  margin: 20px;
}
.message-container {
  justify-content: flex-end;
}
.message-container-left {
  justify-content: flex-start;
}
.message {
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  background-color: #f8f9fa;
  word-wrap: break-word; /* 自动换行 */
  max-width: 70%; /* 限制消息框的最大宽度 */
}
.message-icon {
  margin: 0 10px;
  width: 20px;
  height: 20px;
}
</style>
