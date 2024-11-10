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
          <label>提醒时间:</label>
          <input
            type="text"
            v-model="newReminder.timeRepeat"
            placeholder="1日X次或自定义时间"
            required
            class="form-input"
          />
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
import { ref, onMounted } from "vue";
import axios from "axios";

interface Reminder {
  id: string;
  name: string;
  nextTime: string;
  startTime: string;
  endTime: string;
  timeRepeat: string;
}

const reminders = ref<Reminder[]>([
  {
    id: "1",
    name: "吃早餐",
    nextTime: "2024-11-11T08:00:00Z",
    startTime: "2024-11-11T07:00:00Z",
    endTime: "2024-11-11T08:30:00Z",
    timeRepeat: "每天一次",
  },
  {
    id: "2",
    name: "午休",
    nextTime: "2024-11-11T12:00:00Z",
    startTime: "2024-11-11T12:00:00Z",
    endTime: "2024-11-11T13:00:00Z",
    timeRepeat: "每天一次",
  },
  {
    id: "3",
    name: "晚餐",
    nextTime: "2024-11-11T18:00:00Z",
    startTime: "2024-11-11T18:00:00Z",
    endTime: "2024-11-11T19:00:00Z",
    timeRepeat: "每天一次",
  },
]);

const showAddReminderModal = ref(false);
const showManageRemindersModal = ref(false);
const showEditReminderModal = ref(false);

const newReminder = ref<Reminder>({
  id: "",
  name: "",
  nextTime: "",
  startTime: "",
  endTime: "",
  timeRepeat: "",
});

const currentReminder = ref<Reminder>({
  id: "",
  name: "",
  nextTime: "",
  startTime: "",
  endTime: "",
  timeRepeat: "",
});

const fetchReminders = () => {
  axios
    .get("http://localhost:8084/reminder?username=1")
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
    nextTime: "",
    startTime: "",
    endTime: "",
    timeRepeat: "",
  };
};

const formatTime = (time: string) => {
  const date = new Date(time);
  return date.toLocaleString();
};

onMounted(fetchReminders);
</script>

<style>
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
</style>
