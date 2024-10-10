<template>
  <div class="chat-container">
    <div class="chat-header">
      <img :src="currentChat.avatar" alt="avatar" class="avatar" />
      <div class="chat-header-info">
        <div class="chat-name">{{ currentChat.name }}</div>
        <div class="chat-status">在线</div>
      </div>
    </div>
    <div class="chat-messages">
      <div
        class="message"
        v-for="message in messages"
        :key="message.id"
        :class="{ sent: message.sent }"
      >
        <div class="message-content">{{ message.text }}</div>
        <div class="message-time">{{ message.time }}</div>
      </div>
    </div>
    <div class="chat-input">
      <input
        type="text"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="输入消息..."
      />
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const currentChat = ref({
  id: 1,
  name: "Alice",
  avatar: "path/to/avatar1.jpg",
});

const messages = ref([
  { id: 1, text: "Hello!", time: "10:00 AM", sent: true },
  { id: 2, text: "Hi, how are you?", time: "10:01 AM", sent: false },
  { id: 3, text: "I'm good, thanks!", time: "10:02 AM", sent: true },
  // 更多消息
]);

const newMessage = ref("");

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    messages.value.push({
      id: messages.value.length + 1,
      text: newMessage.value,
      time: new Date().toLocaleTimeString(),
      sent: true,
    });
    newMessage.value = "";
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  border: 1px solid #ddd;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color: #f5f5f5;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.chat-header-info {
  display: flex;
  flex-direction: column;
}

.chat-name {
  font-weight: bold;
}

.chat-status {
  color: #888;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #fff;
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.message.sent .message-content {
  align-self: flex-end;
  background-color: #dcf8c6;
}

.message-content {
  padding: 10px;
  border-radius: 5px;
  background-color: #f1f1f1;
}

.message-time {
  font-size: 0.8em;
  color: #888;
  align-self: flex-end;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background-color: #f5f5f5;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
}

.chat-input button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #42b983;
  color: white;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #36a372;
}
</style>
