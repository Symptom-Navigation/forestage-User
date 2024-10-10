<template>
  <div class="container">
    <NuxtLayout name="show"> </NuxtLayout>
    <div class="common-layout">
      <el-container>
        <el-main>
          <div id="messageContainer">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="
                msg.id === 1 ? 'message-container' : 'message-container-left'
              "
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
        </el-main>
        <el-footer>
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
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { Position, Microphone } from "@element-plus/icons-vue";

const messageInput = ref("");
const messages = ref([] as any[]);
const isRecording = ref(false);
let mediaRecorder: MediaRecorder;
let audioChunks: Blob[] = [];
let messageCount = 0;
let responseMessages = ref([] as any[]);
const symptom = computed(() => messageInput.value.trim());
const messageQueue = ref([] as string[]);
let isTyping = ref(false);

const displayMessage = (message: any) => {
  if (
    messages.value.length === 0 ||
    messages.value[messages.value.length - 1].id !== -1
  ) {
    messages.value.push({ id: -1, type: "text", text: message });
  } else {
    messages.value[messages.value.length - 1].text += "<br>" + message;
  }
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
      // 在每段话打印完之后添加换行符
      messages.value[messages.value.length - 1].text += "<br>";
      isTyping.value = false;
      if (messageQueue.value.length > 0) {
        displayMessageWithTypingEffect(messageQueue.value.shift()!);
      }
    }
  }, 20); // 每50毫秒显示一个字符
};

const parseMarkdownToText = (markdown: string) => {
  // 保留标题标记并转换为 HTML 标题，添加字体大小样式
  let text = markdown.replace(
    /### (.*?)(\n|$)/g,
    '<strong style="font-size: 24px;">$1</strong><br>'
  );

  // 保留加粗标记并转换为 HTML 加粗
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // 移除列表标记
  text = text.replace(/- /g, "");

  // 将换行符替换为 HTML 换行符
  text = text.replace(/\n/g, "<br>");

  // 在每个句子后添加换行符，但不在序列数字后添加换行符
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
    });

    eventSource.addEventListener("updateID", (event) => {
      const newSessionID = event.data;
      console.log("New session ID:", newSessionID);
      // 处理新的 sessionID
    });

    eventSource.onerror = (error) => {
      console.error("Error with SSE:", error);
      // messages.value.push({
      //   id: messageCount++,
      //   type: "text",
      //   text: "抱歉，获取数据时出错，请稍后再试。",
      // });
      eventSource.close();
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

    // 发送录音文件到服务器
    const formData = new window.FormData();
    formData.append("dialectAudio", audioBlob, "test.wav");

    try {
      const res = await axios.post("http://192.168.137.1:8083/audio", formData);
      const serverResponse = res.data; // 假设服务器返回的响应正文为纯文本

      // 显示服务器返回的文本
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
</script>

<!-- <script setup lang="ts">
import axios from "axios";
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";
import { Position, Microphone } from "@element-plus/icons-vue";

const messageInput = ref("");
const messages = ref([] as any[]);
const isRecording = ref(false);
let mediaRecorder: MediaRecorder;
let audioChunks: Blob[] = [];
let messageCount = 0;
let responseMessages = ref([] as any[]);
const symptom = computed(() => messageInput.value.trim());

const displayMessage = (message: any) => {
  if (
    messages.value.length === 0 ||
    messages.value[messages.value.length - 1].id !== -1
  ) {
    messages.value.push({ id: -1, type: "text", text: message });
  } else {
    messages.value[messages.value.length - 1].text += "<br>" + message;
  }
};

const parseMarkdownToText = (markdown: string) => {
  // 保留标题标记并转换为 HTML 标题
  let text = markdown.replace(/### (.*?)(\n|$)/g, "<strong>$1</strong><br>");

  // 保留加粗标记并转换为 HTML 加粗
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // 移除列表标记
  text = text.replace(/- /g, "");

  // 将换行符替换为 HTML 换行符
  text = text.replace(/\n/g, "<br>");

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

    const eventSource = new EventSource(
      `http://192.168.137.1:8082/symptom?sessionID=1&username=1234567&symptom=${encodeURIComponent(
        symptomValue
      )}`
    );
    console.log(symptomValue);

    eventSource.addEventListener("message", (event) => {
      const data = event.data;
      const parsedData = parseMarkdownToText(data.trim());
      displayMessage(parsedData);
    });

    eventSource.addEventListener("updateID", (event) => {
      const newSessionID = event.data;
      console.log("New session ID:", newSessionID);
      // 处理新的 sessionID
    });

    eventSource.onerror = (error) => {
      console.error("Error with SSE:", error);
      // messages.value.push({
      //   id: messageCount++,
      //   type: "text",
      //   text: "抱歉，获取数据时出错，请稍后再试。",
      // });
      eventSource.close();
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

    // 发送录音文件到服务器
    const formData = new window.FormData();
    formData.append("dialectAudio", audioBlob, "test.wav");

    try {
      const res = await axios.post("http://192.168.137.1:8083/audio", formData);
      const serverResponse = res.data; // 假设服务器返回的响应正文为纯文本

      // 显示服务器返回的文本
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
</script> -->

<style scoped>
.container {
  position: absolute;
  width: 100%;
  min-height: 100%;
  /* height: 100%; */
  background-color: #fff2e0;
}

.bottom-bar {
  position: fixed;
  bottom: 70px;
  width: 90%;
  left: 5%;
  padding: 10px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px 10px 0 0;
}

bottom-bar input {
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
</style>
