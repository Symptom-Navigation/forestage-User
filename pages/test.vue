<template>
  <div class="medical-encyclopedia">
    <el-input
      v-model="symptom"
      placeholder="请输入疾病名"
      class="input"
    ></el-input>
    <el-button type="primary" @click="fetchDiseaseInfo">搜索</el-button>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="diseaseInfo">
      <h2>疾病介绍</h2>
      <p>{{ diseaseInfo.Summary_text }}</p>
      <h2>条目介绍</h2>
      <ul>
        <li v-for="(value, key) in diseaseInfo.Basic_info" :key="key">
          <strong>{{ key }}:</strong> {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Search, Operation } from "@element-plus/icons-vue";
import axios from "axios";

interface DiseaseInfo {
  Summary_text: string;
  Basic_info: Record<string, string>;
}

const symptom = ref("");
const diseaseInfo = ref<DiseaseInfo | null>(null);
const error = ref("");

const fetchDiseaseInfo = async () => {
  try {
    const res = await axios.get("http://localhost:5000", {
      params: { symptom: symptom.value },
    });
    if (res.status === 200) {
      if (res.data.Summary_text || res.data.Basic_info) {
        diseaseInfo.value = res.data;
        error.value = "";
      } else {
        error.value = "条目不存在，请重新输入";
        diseaseInfo.value = null;
      }
    } else {
      console.error("Unexpected response status:", res.status);
    }
  } catch (error) {
    console.error("请求失败", error);
    alert("请求失败，请稍后再试");
    diseaseInfo.value = null;
  }
};
</script>

<style>
.top-bar {
  height: 50px;
  background-color: aliceblue;
}
.top-bar img {
  margin-top: 5px;
  margin-left: 10px;
  float: left;
}
.top-bar-word {
  float: right;
}
.top-bar a {
  display: inline-block;
  width: 70px;
  height: 50px;
  line-height: 50px;
  margin-right: 15px;
  text-align: center;
  color: lightgreen; /* 设置文字颜色为浅绿色 */
  text-decoration: none; /* 去掉下划线 */
}
.medical-encyclopedia {
  padding: 20px;
}
.input {
  margin-bottom: 10px;
}
.error {
  color: red;
}
</style>
