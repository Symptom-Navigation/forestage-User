<template>
  <div class="container">
    <NuxtLayout name="show"> </NuxtLayout>
    <div class="com-top-bar">
      <el-input
        v-model="searchKeyword"
        style="width: 90%; margin-top: 15px"
        placeholder="搜索关键字"
        @input="filterChats"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
      <el-row style="text-align: center; margin-top: 30px" class="top-row">
        <el-col
          :span="6"
          style="display: flex; flex-direction: column; align-items: center"
        >
          <a :href="'/myregistration/'">
            <div
              style="
                width: 65px;
                height: 65px;
                background-color: #42b983;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-size: 30px;
                margin-bottom: 10px;
              "
            >
              <el-icon><Document /></el-icon>
            </div>
            <span>我的预约</span>
          </a>
        </el-col>

        <el-col
          :span="6"
          style="display: flex; flex-direction: column; align-items: center"
        >
          <a :href="'/InterMessage/'">
            <div
              style="
                width: 65px;
                height: 65px;
                background-color: #ff9900;
                border-radius: 65%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-size: 30px;
                margin-bottom: 10px;
              "
            >
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <span style="color: black">互动消息</span>
          </a>
        </el-col>
        <el-col
          :span="6"
          style="display: flex; flex-direction: column; align-items: center"
        >
          <div
            style="
              width: 65px;
              height: 65px;
              background-color: #00b0f2;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: white;
              font-size: 30px;
              margin-bottom: 10px;
            "
          >
            <el-icon><User /></el-icon>
          </div>
          <span>3D模型</span>
        </el-col>
        <el-col
          :span="6"
          style="display: flex; flex-direction: column; align-items: center"
        >
          <div
            style="
              width: 65px;
              height: 65px;
              background-color: #66cdaa;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              color: white;
              font-size: 30px;
              margin-bottom: 10px;
            "
          >
            <el-icon><Bell /></el-icon>
          </div>
          <span>系统消息</span>
        </el-col>
      </el-row>
    </div>
    <div class="com-mid-bar"></div>
    <!-- 聊天对象列表 -->
    <div class="com-bot-bar">
      <div class="chat-list">
        <div
          class="chat-item"
          v-for="chat in filteredChats"
          :key="chat.id"
          @click="goToChat(chat.id)"
        >
          <img :src="chat.avatar" alt="avatar" class="avatar" />
          <div class="chat-info">
            <div class="chat-name">{{ chat.name }}</div>
            <div class="chat-last-message">{{ chat.lastMessage }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  Search,
  ChatDotRound,
  Bell,
  Document,
  User,
} from "@element-plus/icons-vue";
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { debounce } from "lodash";

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  avatar: string;
}

interface Message {
  id: number;
  from: string;
  to: string;
  content: string;
  time: string;
}

const router = useRouter();
const searchKeyword = ref("");
const chats = ref<Chat[]>([]);
const filteredChats = ref<Chat[]>([]);

const filterChats = debounce(() => {
  filteredChats.value = chats.value.filter((chat) =>
    chat.name.includes(searchKeyword.value)
  );
}, 300);

watch(searchKeyword, filterChats);

const goToChat = (chatId: number) => {
  router.push(`/chat/${chatId}`);
};

const connectWebSocket = () => {
  const ws = new WebSocket("ws://localhost:8081", ["jwt-token"]);

  ws.onmessage = (event) => {
    const message: Message = JSON.parse(event.data);
    const existingChat = chats.value.find((chat) => chat.id === message.id);

    if (existingChat) {
      existingChat.lastMessage = message.content;
    } else {
      chats.value.push({
        id: message.id,
        name: message.from,
        lastMessage: message.content,
        avatar: "https://img.picui.cn/free/2024/09/23/66f096676bb08.png", // 默认头像
      });
    }

    filterChats();
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
.com-top-bar {
  height: 200px;
  text-align: center;
  background-color: white;
}
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
}
.com-mid-bar {
  height: 10px;
  background-color: azure;
}
.com-bot-bar {
  margin-top: 10px;
  background-color: white;
  height: 300px; /* 设置合适的高度 */
  overflow-y: auto; /* 允许垂直滚动 */
}

.chat-list {
  display: flex;
  flex-direction: column;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer; /* 添加鼠标指针样式 */
}

.chat-item:hover {
  background-color: #f5f5f5; /* 添加悬停效果 */
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.chat-info {
  display: flex;
  flex-direction: column;
}

.chat-name {
  font-weight: bold;
}

.chat-last-message {
  color: #888;
}
</style>
