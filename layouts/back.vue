<template>
  <div class="back-main">
    <span class="left" @click="goBack">
      <el-icon><ArrowLeft /></el-icon>
    </span>
    <span class="center"><slot /></span>
  </div>
</template>

<style scoped>
.back-main {
  height: 40px;
  background-color: #07c160;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.left {
  font-size: 25px;
  color: white;
  margin-left: 10px;
  flex: 0 0 auto;
}

.center {
  font-size: 20px;
  color: white;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";
const router = useRouter();
function goBack() {
  router.back();
}
</script>
