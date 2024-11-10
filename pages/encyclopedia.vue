<template>
  <NuxtLayout name="show"></NuxtLayout>
  <div class="medical-encyclopedia">
    <div class="search-container">
      <el-input
        v-model="symptom"
        placeholder="请输入疾病名"
        class="input"
        prefix-icon="el-icon-search"
      ></el-input>
      <el-button type="primary" @click="fetchDiseaseInfo" class="search-button"
        >搜索</el-button
      >
    </div>
    <div v-if="!diseaseInfo && !error" class="placeholder">
      这里是医疗百科<br />你可以搜索疾病名获取相关信息
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="diseaseInfo" class="disease-info">
      <h2>疾病介绍</h2>
      <p>{{ diseaseInfo.Summary_text }}</p>
      <h2>条目介绍</h2>
      <ul>
        <li v-for="(value, key) in diseaseInfo.Basic_info" :key="key">
          <strong>{{ key }}:</strong> {{ value }}
        </li>
      </ul>
    </div>
    <div style="margin-bottom: 30px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
    const res = await axios.get(
      "http://127.0.0.1:4523/m2/5085608-4747844-default/231964069",
      {
        params: { symptom: symptom.value },
      }
    );
    if (res.status === 200) {
      if (res.data.Summary_text || res.data.Basic_info) {
        diseaseInfo.value = res.data;
        error.value = "";
      } else {
        error.value = "条目不存在，请重新输入";
        diseaseInfo.value = null;
      }
    } else {
      error.value = `Unexpected response status: ${res.status}`;
      diseaseInfo.value = null;
    }
  } catch (err) {
    console.error("请求失败", err);
    error.value = "请求失败，请稍后再试";
    diseaseInfo.value = null;
  }
};
</script>

<style>
.medical-encyclopedia {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 避免滚动条出现 */
}

.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.input {
  flex: 1;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px; /* 设置固定宽度 */
}

.search-button:active,
.search-button:focus {
  width: 100px; /* 确保活动状态下宽度不变 */
}

.placeholder {
  color: #888;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

.disease-info {
  margin-top: 20px;
}

.disease-info h2 {
  color: #333;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.disease-info ul {
  list-style-type: none;
  padding: 0;
}

.disease-info li {
  background-color: #fff;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 5px;
}

.disease-info li strong {
  color: #555;
}
</style>
