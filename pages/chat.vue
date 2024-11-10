<template>
  <div class="chat-container">
    <header-bar :chatName="chatName" />
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <div :class="['bubble', message.sender === 'me' ? 'me' : 'other']">
          <template v-if="message.type === 'image'">
            <img :src="message.content" alt="图片" class="image-preview" />
          </template>
          <template v-else>
            {{ message.text }}
          </template>
        </div>
      </div>
    </div>
    <div class="input-bar">
      <input
        v-model="newMessage"
        @input="handleInputChange"
        @keyup.enter="sendMessage"
        placeholder="输入信息"
      />
      <button :class="buttonClass" @click="handleButtonClick">
        {{ buttonText }}
      </button>
    </div>
    <div v-if="showOptions" class="options-bar">
      <div class="options-row">
        <button @click="triggerFileInput">
          <el-icon><upload /></el-icon> 文件
        </button>
        <button @click="openCamera">
          <el-icon><camera /></el-icon> 拍摄
        </button>
        <button @click="selectOption('导诊')">
          <el-icon><medal /></el-icon> 导诊
        </button>
        <button @click="selectOption('挂号')">
          <el-icon><document /></el-icon> 挂号
        </button>
      </div>
      <div class="options-row"></div>
    </div>
    <input
      type="file"
      ref="fileInput"
      @change="handleFileUpload"
      accept="image/*"
      style="display: none"
    />
    <div v-if="showCamera" class="camera-container">
      <video ref="video" class="video-preview" autoplay></video>
      <button @click="takePhoto">拍照</button>
      <button @click="closeCamera">关闭</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import HeaderBar from "../components/HeaderBar.vue";
import { Upload, Camera, Medal, Document } from "@element-plus/icons-vue";

interface Message {
  sender: string;
  text: string;
  type?: string;
  content?: string;
}

const route = useRoute();
const router = useRouter();
const chatName = ref<string>(
  Array.isArray(route.params.chatName)
    ? route.params.chatName[0]
    : route.params.chatName || "未知用户(未知门诊)"
);

const messages = ref<Message[]>([]);
const newMessage = ref("");
const showOptions = ref(false);
const showCamera = ref(false);
const video = ref<HTMLVideoElement | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
let ws: WebSocket;

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    const message = {
      id: null,
      from: "me",
      to: chatName.value,
      text: newMessage.value,
      time: new Date().toISOString(),
      type: newMessage.value.startsWith("data:image/") ? "image" : undefined,
      content: newMessage.value.startsWith("data:image/")
        ? newMessage.value
        : undefined,
    };
    ws.send(JSON.stringify(message));
    messages.value.push({
      sender: "me",
      text: newMessage.value,
      type: message.type,
      content: message.content,
    });
    newMessage.value = "";
    showOptions.value = false;
  }
};

const handleButtonClick = () => {
  if (newMessage.value.trim() === "") {
    showOptions.value = !showOptions.value;
  } else {
    sendMessage();
  }
};

const handleInputChange = () => {
  if (newMessage.value.trim() !== "") {
    showOptions.value = false;
  }
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      newMessage.value = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const openCamera = async () => {
  showCamera.value = true;
  if (video.value) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.value.srcObject = stream;
  }
};

const closeCamera = () => {
  showCamera.value = false;
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  }
};

const takePhoto = () => {
  if (video.value) {
    const canvas = document.createElement("canvas");
    canvas.width = video.value.videoWidth;
    canvas.height = video.value.videoHeight;
    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(video.value, 0, 0, canvas.width, canvas.height);
      newMessage.value = canvas.toDataURL("image/png");
      sendMessage();
      closeCamera();
    }
  }
};

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};

const selectOption = (option: string) => {
  console.log(`Selected option: ${option}`);
  showOptions.value = false;
};

const connectWebSocket = () => {
  ws = new WebSocket("ws://localhost:8081", ["jwt-token"]);

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    messages.value.push({
      sender: "other",
      text: message.text,
      content: message.content,
      type: message.type,
    });
  };

  ws.onopen = () => {
    console.log("WebSocket connection established");
  };

  ws.onclose = () => {
    console.log("WebSocket connection closed");
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

onMounted(() => {
  connectWebSocket();
});

const buttonText = computed(() => {
  if (showOptions.value && newMessage.value.trim() === "") {
    return "x";
  } else if (newMessage.value.trim() !== "") {
    return "发送";
  } else {
    return "+";
  }
});

const buttonClass = computed(() => {
  if (showOptions.value && newMessage.value.trim() === "") {
    return "red-button";
  } else if (newMessage.value.trim() === "") {
    return "orange-button";
  } else {
    return "blue-button";
  }
});
</script>

<style>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
.message {
  display: flex;
  margin-bottom: 10px;
}
.bubble {
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}
.me {
  background-color: #dcf8c6;
  align-self: flex-end;
  margin-left: auto;
}
.other {
  background-color: #fff;
  align-self: flex-start;
  margin-right: auto;
}
.input-bar {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #fff;
}
.input-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.input-bar button {
  margin-left: 10px;
  padding: 10px 20px;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
.orange-button {
  background-color: orange;
}
.blue-button {
  background-color: #007bff;
}
.red-button {
  background-color: red;
}
.options-bar {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ccc;
}
.options-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}
.options-bar button {
  display: flex;
  align-items: center;
  padding: 10px;
  border: none;
  background-color: #f0f0f0;
  border-radius: 5px;
  cursor: pointer;
}
.options-bar i {
  margin-right: 5px;
}
.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border-top: 1px solid #ccc;
}
.video-preview {
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  margin-bottom: 10px;
}
.image-preview {
  max-width: 100%;
  border-radius: 10px;
}
</style>
