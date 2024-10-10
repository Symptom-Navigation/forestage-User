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
              :class="messageClass(msg.id)"
            >
              <img
                v-if="msg.id !== 1"
                src="../assets/ai.jpg"
                alt="icon"
                class="message-icon"
              />
              <div class="message">
                <template v-if="msg.type === 'text'">{{ msg.text }}</template>
              </div>
              <img
                v-if="msg.id === 1"
                src="../assets/logo.jpg"
                alt="icon"
                class="message-icon"
              />
            </div>
          </div>
          <div v-if="isRecording" class="recording-indicator">正在录音...</div>
        </el-main>
        <el-footer>
          <div class="bottom-bar">
            <input
              type="text"
              v-model="messageInput"
              placeholder="请输入内容"
              aria-label="Message input"
            />
            <el-button
              @click="symptomHandler"
              icon="el-icon-send"
              circle
              class="send-button"
              aria-label="Send message"
            >
              <el-icon><Position /></el-icon>
            </el-button>
            <el-button
              :style="{ backgroundColor: isRecording ? 'red' : '#add8e6' }"
              @click="toggleRecording"
              icon="el-icon-microphone"
              circle
              aria-label="Toggle recording"
            >
              <el-icon><Microphone /></el-icon>
            </el-button>
          </div>
        </el-footer>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      messageInput: "",
      isRecording: false,
    };
  },
  methods: {
    messageClass(id) {
      return id === 1 ? "message-container" : "message-container-left";
    },
    symptomHandler() {
      // Your handler code here
    },
    async startRecording() {
      try {
        this.audioChunks = [];
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data);
        };
      } catch (error) {
        console.error("Error accessing media devices:", error);
        this.$message.error("无法访问麦克风");
      }
    },
    async stopRecording() {
      this.mediaRecorder.stop();
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: "audio/wav" });

        // 发送录音文件到服务器
        const formData = new FormData();
        formData.append("dialectAudio", audioBlob, "test.wav");

        try {
          const res = await axios.post(
            "http://192.168.137.1:8083/audio",
            formData
          );
          console.log("FormData:", formData);

          const file = formData.get("dialectAudio");

          this.messageInput = "";
          const fullMessage = "我有些头痛";
          let index = 0;
          const interval = setInterval(() => {
            if (index < fullMessage.length) {
              this.messageInput += fullMessage[index];
              index++;
            } else {
              clearInterval(interval);
            }
          }, 100);
        } catch (error) {
          console.error("Error uploading audio:", error);
          this.$message.error("录音识别失败");
        }
      };
    },
    toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
      this.isRecording = !this.isRecording;
    },
  },
};
</script>

<style scoped>
.container {
  position: absolute;
  width: 100%;
  min-height: 100%;
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

.recording-indicator {
  position: fixed;
  top: 300px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 1000;
}
</style>
