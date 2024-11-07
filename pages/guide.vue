<template>
  <div class="container">
    <NuxtLayout name="show"> </NuxtLayout>
    <div class="common-layout">
      <el-container>
        <el-main class="main-content">
          <div v-if="showIntro" class="intro-overlay">
            <div class="intro-content">
              <p>
                欢迎使用导诊系统！在这里你可以输入症状，我们会为你提供相关的建议。如果你不清楚如何描述，您可以点击“跳转”，进入3D人体界面。
              </p>
              <div class="intro-buttons">
                <el-button @click="confirmIntro">确认</el-button>
                <el-button @click="navigateToOtherPage">跳转</el-button>
              </div>
            </div>
          </div>
          <div id="messageContainer" ref="messageContainer">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="[
                msg.id === 1 ? 'message-container' : 'message-container-left',
                { 'latest-message': index === messages.length - 1 },
              ]"
            >
              <img
                v-if="msg.id !== 1"
                src="../assets/ai.jpg"
                alt="icon"
                class="message-icon"
              />
              <div class="message">
                <template v-if="msg.type === 'text'">
                  <span v-html="msg.text"></span>
                </template>
              </div>
              <img
                v-if="msg.id === 1"
                src="../assets/logo.jpg"
                alt="icon"
                class="message-icon"
              />
            </div>
          </div>
          <div v-if="isWaiting" class="loading-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </el-main>
        <el-footer class="footer-bar">
          <div class="bottom-bar">
            <input
              type="text"
              v-model="messageInput"
              placeholder="请输入内容"
            />
            <el-button
              @click="symptomHandler"
              icon="el-icon-send"
              circle
              class="send-button"
            >
              <el-icon><Position /></el-icon>
            </el-button>
            <el-button
              :style="{ backgroundColor: isRecording ? 'red' : '#add8e6' }"
              @click="toggleRecording"
              icon="el-icon-microphone"
              circle
            >
              <el-icon><Microphone /></el-icon>
            </el-button>
          </div>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>
<script setup lang="ts">
import axios from "axios";
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Position, Microphone } from "@element-plus/icons-vue";

const messageInput = ref("");
const messages = ref([] as any[]);
const isRecording = ref(false);
const isWaiting = ref(false); // 新增的状态
const showIntro = ref(true); // 控制提示框显示
const messageContainer = ref<HTMLElement | null>(null);
const router = useRouter(); // 使用 Vue Router

let mediaRecorder: MediaRecorder;
let audioChunks: Blob[] = [];
let messageCount = 0;
let responseMessages = ref([] as any[]);
const symptom = computed(() => messageInput.value.trim());
const messageQueue = ref([] as string[]);
let isTyping = ref(false);

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
};

const displayMessage = (message: any) => {
  if (
    messages.value.length === 0 ||
    messages.value[messages.value.length - 1].id !== -1
  ) {
    messages.value.push({ id: -1, type: "text", text: message });
  } else {
    messages.value[messages.value.length - 1].text += "<br>" + message;
  }
  scrollToBottom();
};

const displayMessageWithTypingEffect = (message: string) => {
  let index = 0;
  isTyping.value = true;
  const interval = setInterval(() => {
    if (index < message.length) {
      if (
        messages.value.length === 0 ||
        messages.value[messages.value.length - 1].id !== -1
      ) {
        messages.value.push({ id: -1, type: "text", text: message[index] });
      } else {
        messages.value[messages.value.length - 1].text += message[index];
      }
      index++;
    } else {
      clearInterval(interval);
      messages.value[messages.value.length - 1].text += "<br>";
      isTyping.value = false;
      if (messageQueue.value.length > 0) {
        displayMessageWithTypingEffect(messageQueue.value.shift()!);
      }
      scrollToBottom();
    }
  }, 20);
};

const parseMarkdownToText = (markdown: string) => {
  let text = markdown.replace(
    /### (.*?)(\n|$)/g,
    '<strong style="font-size: 24px;">$1</strong><br>'
  );

  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/- /g, "");
  text = text.replace(/\n/g, "<br>");
  text = text.replace(/(\d+\.\s*)(.*?)(\.|\?|\!)(\s|$)/g, "$1$2$3<br>");

  return text;
};

const symptomHandler = async () => {
  if (symptom.value) {
    messages.value.push({
      id: 1,
      type: "text",
      text: symptom.value,
    });
    console.log(symptom.value);
    let symptomValue = symptom.value;
    messageInput.value = "";
    isWaiting.value = true; // 显示等待动画

    const eventSource = new EventSource(
      `http://192.168.137.1:8082/symptom?sessionID=1&username=1234567&symptom=${encodeURIComponent(
        symptomValue
      )}`
    );
    console.log(symptomValue);

    eventSource.addEventListener("message", (event) => {
      const data = event.data;
      const parsedData = parseMarkdownToText(data.trim());
      messageQueue.value.push(parsedData);
      if (!isTyping.value) {
        displayMessageWithTypingEffect(messageQueue.value.shift()!);
      }
      isWaiting.value = false; // 隐藏等待动画
    });

    eventSource.addEventListener("updateID", (event) => {
      const newSessionID = event.data;
      console.log("New session ID:", newSessionID);
    });

    eventSource.onerror = (error) => {
      console.error("Error with SSE:", error);
      eventSource.close();
      isWaiting.value = false; // 隐藏等待动画
    };
  }
};

const startRecording = async () => {
  audioChunks = [];
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();
  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };
};

const stopRecording = async () => {
  mediaRecorder.stop();
  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

    const formData = new window.FormData();
    formData.append("dialectAudio", audioBlob, "test.wav");

    try {
      const res = await axios.post("http://192.168.137.1:8083/audio", formData);
      const serverResponse = res.data;

      messageInput.value = "";
      let index = 0;
      const interval = setInterval(() => {
        if (index < serverResponse.length) {
          messageInput.value += serverResponse[index];
          index++;
        } else {
          clearInterval(interval);
        }
      }, 100);
    } catch (error) {
      console.error("Error uploading audio:", error);
      ElMessage.error("录音识别失败");
    }
  };
};

const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
  isRecording.value = !isRecording.value;
};

const confirmIntro = () => {
  showIntro.value = false;
};

const navigateToOtherPage = () => {
  router.push("/3Dmodel"); // 跳转到另一个页面
};

onMounted(() => {
  scrollToBottom();
});
</script>
<style scoped>
.container {
  position: absolute;
  width: 100%;
  min-height: 100%;
  background-color: #fff2e0;
  display: flex;
  flex-direction: column;
}

.common-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 70px; /* 确保最后一条消息显示在输入框上方 */
}

.footer-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.bottom-bar {
  width: 90%;
  margin: 0 auto;
  padding: 15px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px 10px 0 0;
  background-color: #fff2e0;
  left: 2%;
  bottom: 8%;
}

.bottom-bar input {
  width: 70%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  box-sizing: border-box;
  margin-right: 10px;
}

.bottom-bar .el-button {
  margin-left: 10px;
  color: white;
  border: none;
  padding: 9px 10px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-bar .send-button {
  background-color: #add8e6;
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
  word-wrap: break-word;
  max-width: 70%;
}

.message-icon {
  margin: 0 10px;
  width: 20px;
  height: 20px;
}

.latest-message {
  margin-bottom: 60px; /* 新增的样式，确保最新消息距离底部有额外的间距 */
}

.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-dots .dot {
  width: 8px;
  height: 8px;
  margin: 0 4px;
  background-color: #09f;
  border-radius: 50%;
  animation: bounce 0.6s infinite alternate;
}

.loading-dots .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  to {
    opacity: 0.3;
    transform: translateY(-10px);
  }
}

.intro-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.intro-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 70%;
}

.intro-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
}
</style>
