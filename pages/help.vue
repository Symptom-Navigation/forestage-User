<template>
  <NuxtLayout name="tabbartop">
    <div class="image-container">
      <img src="../assets/images/help/1.1.png" alt="" />
      <img src="../assets/images/help/1.2.png" alt="" />
      <img src="../assets/images/help/1.3.jpg" alt="" />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts"></script>
<style scoped>
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.image-container img {
  width: 70%;
  margin-top: 5px;
  max-width: 100%;
  height: auto;
}
</style>
