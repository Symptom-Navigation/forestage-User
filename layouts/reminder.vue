<template>
  <div class="container-rem">
    <div v-for="item in reminders" :key="item.id" class="reminder-item">
      <div class="reminder-content">
        <p class="reminder-name">{{ item.name }}</p>
        <p class="reminder-time">{{ formatTime(item.nextTime) }}</p>
      </div>
      <input
        type="checkbox"
        @change="completeReminder(item.id)"
        class="reminder-checkbox"
      />
    </div>
    <div class="action-panel">
      <button @click="showAddReminderModal = true" class="action-button">
        +
      </button>
      <button @click="showManageRemindersModal = true" class="action-button">
        ⚙️
      </button>
    </div>

    <!-- 添加待办事项弹窗 -->
    <div v-if="showAddReminderModal" class="modal">
      <div class="modal-content">
        <h3>添加待办事项</h3>
        <form @submit.prevent="addReminder" class="form">
          <label>事件名:</label>
          <input v-model="newReminder.name" required class="form-input" />
          <label>开始时间:</label>
          <input
            type="datetime-local"
            v-model="newReminder.startTime"
            required
            class="form-input"
          />
          <label>结束时间:</label>
          <input
            type="datetime-local"
            v-model="newReminder.endTime"
            required
            class="form-input"
          />
          <div class="frequency-container">
            <label>提醒频率:</label>
            <input
              type="number"
              v-model="frequency"
              @input="calculateReminderTimes"
              required
              class="form-input frequency-input"
            />
            <span>次/日</span>
            <div class="custom-reminder">
              <input
                type="radio"
                id="custom-time"
                value="custom"
                v-model="reminderTime"
                :disabled="!frequency"
              />
              <label for="custom-time">自定义提醒时间</label>
            </div>
          </div>
          <div v-if="reminderTime === 'custom'" class="custom-times-container">
            <div
              v-for="(time, index) in customTimes"
              :key="index"
              class="custom-time-input"
            >
              <input
                type="datetime-local"
                v-model="customTimes[index]"
                class="form-input"
              />
            </div>
            <div class="custom-time-buttons">
              <button
                type="button"
                @click="incrementFrequency"
                class="small-button"
              >
                +
              </button>
              <button
                type="button"
                @click="decrementFrequency"
                class="small-button"
              >
                -
              </button>
            </div>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="modal-button">添加</button>
            <button
              type="button"
              @click="showAddReminderModal = false"
              class="modal-button"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 管理待办事项弹窗 -->
    <div v-if="showManageRemindersModal" class="modal">
      <div class="modal-content">
        <h3>管理待办事项</h3>
        <div v-for="item in reminders" :key="item.id" class="manage-item">
          <p>{{ item.name }}</p>
          <div class="manage-buttons">
            <button @click="editReminder(item)" class="manage-button">
              编辑
            </button>
            <button @click="deleteReminder(item.id)" class="manage-button">
              删除
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="showManageRemindersModal = false"
          class="modal-button"
        >
          关闭
        </button>
      </div>
    </div>

    <!-- 编辑待办事项弹窗 -->
    <div v-if="showEditReminderModal" class="modal">
      <div class="modal-content">
        <h3>编辑待办事项</h3>
        <form @submit.prevent="updateReminder" class="form">
          <label>事件名:</label>
          <input v-model="currentReminder.name" required class="form-input" />
          <label>开始时间:</label>
          <input
            type="datetime-local"
            v-model="currentReminder.startTime"
            required
            class="form-input"
          />
          <label>结束时间:</label>
          <input
            type="datetime-local"
            v-model="currentReminder.endTime"
            required
            class="form-input"
          />
          <label>提醒时间:</label>
          <input
            type="text"
            v-model="currentReminder.timeRepeat"
            required
            class="form-input"
          />
          <div class="modal-buttons">
            <button type="submit" class="modal-button">更新</button>
            <button
              type="button"
              @click="showEditReminderModal = false"
              class="modal-button"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import service from "../utils/request";

interface Reminder {
  id: string;
  name: string;
  nextTime: string;
  startTime: string;
  endTime: string;
  timeRepeat: string[];
  username: string;
  prevTime: string;
}

const reminders = ref<Reminder[]>([]);
const showAddReminderModal = ref(false);
const showManageRemindersModal = ref(false);
const showEditReminderModal = ref(false);

const newReminder = ref<Reminder>({
  id: "",
  name: "",
  username: "",
  prevTime: "",
  nextTime: "",
  startTime: "",
  endTime: "",
  timeRepeat: [],
});

const currentReminder = ref<Reminder>({
  id: "",
  name: "",
  nextTime: "",
  startTime: "",
  endTime: "",
  timeRepeat: [],
  username: "",
  prevTime: "",
});

const frequency = ref<number | null>(null);
const reminderTime = ref<string>("");
const customTimes = ref<string[]>([]);

const userData = reactive({
  id: "",
  username: "",
  age: "",
  avatar: "",
  createdAt: "",
  gender: "",
  updatedA: "",
  phoneNumber: "",
  idCardNumber: "",
  password: "",
});
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await service.get("/auth/user/info");
    console.log("API Response:", res.data);
    if (res.status === 200) {
      Object.assign(userData, res.data);
      console.log("Updated userData:", userData);
      // 更新 newReminder 和 currentReminder 的用户名
      newReminder.value.username = userData.username;
      currentReminder.value.username = userData.username;
      fetchReminders();
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    loading.value = false;
  }
});

const fetchReminders = () => {
  axios
    .get(`http://localhost:8084/reminder?username=${userData.username}`)
    .then((response) => {
      reminders.value = response.data;
    })
    .catch((error) => {
      console.error("Error fetching reminders:", error);
    });
};

const completeReminder = (id: string) => {
  axios
    .post("http://localhost:8084/finish", { id })
    .then(() => {
      reminders.value = reminders.value.filter((item) => item.id !== id);
    })
    .catch((error) => {
      console.error("Error completing reminder:", error);
    });
};

const addReminder = () => {
  const now = new Date().toISOString();
  newReminder.value.prevTime = now;
  newReminder.value.nextTime = now;

  // 确保 startTime 和 endTime 包含秒
  const startTime = new Date(newReminder.value.startTime);
  newReminder.value.startTime = startTime.toISOString();

  const endTime = new Date(newReminder.value.endTime);
  newReminder.value.endTime = endTime.toISOString();

  // 生成 timeRepeat 数组
  if (reminderTime.value === "custom") {
    newReminder.value.timeRepeat = customTimes.value.map((time) => {
      const date = new Date(time);
      return date.toISOString();
    });
  } else if (frequency.value) {
    const interval = 24 / frequency.value;
    newReminder.value.timeRepeat = [];
    for (let i = 1; i <= frequency.value; i++) {
      const reminderTime = new Date(
        startTime.getTime() + i * interval * 60 * 60 * 1000
      );
      newReminder.value.timeRepeat.push(reminderTime.toISOString());
    }
  }

  // 打印请求数据以进行调试
  console.log("Request Data:", newReminder.value);

  axios
    .put("http://localhost:8084/reminder", newReminder.value)
    .then((response) => {
      reminders.value.push(response.data);
      showAddReminderModal.value = false;
      resetNewReminder();
    })
    .catch((error) => {
      console.error("Error adding reminder:", error);
    });
};

const editReminder = (item: Reminder) => {
  currentReminder.value = { ...item };
  showEditReminderModal.value = true;
};

const updateReminder = () => {
  axios
    .put("http://localhost:8084/reminder", currentReminder.value)
    .then((response) => {
      const index = reminders.value.findIndex(
        (item) => item.id === currentReminder.value.id
      );
      reminders.value[index] = response.data;
      showEditReminderModal.value = false;
    })
    .catch((error) => {
      console.error("Error updating reminder:", error);
    });
};

const deleteReminder = (id: string) => {
  axios
    .delete("http://localhost:8084/reminder", { data: { id } })
    .then(() => {
      reminders.value = reminders.value.filter((item) => item.id !== id);
    })
    .catch((error) => {
      console.error("Error deleting reminder:", error);
    });
};

const resetNewReminder = () => {
  newReminder.value = {
    id: "",
    name: "",
    username: userData.username,
    prevTime: "",
    nextTime: "",
    startTime: "",
    endTime: "",
    timeRepeat: [],
  };
};

const formatTime = (time: string) => {
  const date = new Date(time);
  return date.toLocaleString();
};

const calculateReminderTimes = () => {
  if (frequency.value) {
    const interval = 24 / frequency.value;
    const now = new Date();
    customTimes.value = [];
    for (let i = 0; i < frequency.value; i++) {
      const reminderTime = new Date(
        now.getTime() + i * interval * 60 * 60 * 1000
      );
      customTimes.value.push(reminderTime.toISOString().slice(0, 16));
    }
  }
};

const incrementFrequency = () => {
  if (frequency.value !== null) {
    frequency.value++;
    calculateReminderTimes();
  }
};

const decrementFrequency = () => {
  if (frequency.value !== null && frequency.value > 1) {
    frequency.value--;
    calculateReminderTimes();
  }
};
</script>

<style scoped>
.container-rem {
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.reminder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.reminder-content {
  display: flex;
  flex-direction: column;
}

.reminder-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.reminder-time {
  color: #888;
}

.reminder-checkbox {
  transform: scale(1.5);
}

.action-panel {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.action-button {
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  background-color: #d3d3d3;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #d3d3d3;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto; /* 添加滚动功能 */
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 500px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-input {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #d3d3d3;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.modal-button:hover {
  background-color: #d3d3d3;
}

.manage-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.manage-buttons {
  display: flex;
  gap: 10px;
}

.manage-button {
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  background-color: #d3d3d3;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.manage-button:hover {
  background-color: #d3d3d3;
}

/* 新增样式 */
.custom-reminder input[type="datetime-local"] {
  width: 150px; /* 调整宽度 */
  margin-right: 10px; /* 添加右边距 */
  display: inline-block; /* 确保在同一行 */
}

.custom-times-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中 */
}

.custom-time-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.custom-time-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.small-button {
  margin: 0 5px;
  padding: 10px; /* 增加按钮宽度 */
  margin: 20px;
  margin-top: -10px;
  width: 60px;
  font-size: 20px;
  border: none;
  border-radius: 5px;
  background-color: #d3d3d3;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.small-button:hover {
  background-color: #1a1111;
}

.frequency-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.frequency-input {
  width: 20px; /* 减短输入框宽度 */
  margin-right: 10px;
}
</style>
