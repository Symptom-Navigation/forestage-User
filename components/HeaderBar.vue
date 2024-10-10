<template>
  <div class="header-bar">{{ chatName }}</div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  chatName: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.header-bar {
  background-color: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
  height: 30px;
}
</style>
