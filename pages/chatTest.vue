<template>
  <div class="chat-container">
    <header-bar :chatName="chatName" />
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <div :class="['bubble', message.sender === 'me' ? 'me' : 'other']">
          {{ message.text }}
        </div>
      </div>
    </div>
    <div class="input-bar">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="输入信息"
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import HeaderBar from "../components/HeaderBar.vue";

interface Message {
  sender: string;
  text: string;
}

const route = useRoute();
const chatName = ref<string>(
  Array.isArray(route.params.chatName)
    ? route.params.chatName[0]
    : route.params.chatName || "未知用户"
);

const messages = ref<Message[]>([]);
const newMessage = ref("");
let ws: WebSocket;

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    const message = {
      id: null,
      from: "me",
      to: chatName.value,
      content: newMessage.value,
      time: new Date().toISOString(),
    };
    ws.send(JSON.stringify(message));
    messages.value.push({ sender: "me", text: newMessage.value });
    newMessage.value = "";
  }
};

const connectWebSocket = () => {
  ws = new WebSocket("ws://localhost:8081", ["jwt-token"]);

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    messages.value.push({ sender: "other", text: message.content });
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
</script>

<style scoped>
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
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
</style>
