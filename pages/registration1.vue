<template>
  <NuxtLayout name="tabbartop">
    <div class="search-container">
      <input type="text" placeholder="请输入医生、科室、疾病" />
      <button>搜索</button>
    </div>
    <!-- 筛选地区展示-->
    <div class="show-department">
      <div class="menu">
        <ul>
          <span><strong>科室:</strong></span>
          <li>内科</li>
          <li>外科</li>
          <li>儿科</li>
          <li>妇科</li>
          <li>眼科</li>
          <li>耳鼻喉科</li>
          <li>口腔科</li>
          <li>皮肤科</li>
          <li>中医科</li>
          <li>产科</li>
          <li>骨科</li>
          <li>烧伤科</li>
        </ul>
      </div>
    </div>
    <div class="show-department">
      <div class="menu">
        <ul>
          <span><strong>疾病:</strong></span>
          <li>高血压</li>
          <li>疼痛</li>
          <li>产前检查</li>
          <li>头晕</li>
          <li>头痛</li>
          <li>甲状腺疾病</li>
          <li>糖尿病</li>
          <li>失眠</li>
          <li>感染</li>
          <li>感冒</li>
        </ul>
      </div>
    </div>
    <!-- 下方医生展示 -->
    <div class="regi-top-div">
      <div>
        <img class="avatar" src="../assets/logo.jpg" alt="Logo" />
      </div>
      <div
        v-for="(item, index) in doctorsArr"
        :key="index"
        @click="toRegister(item)"
      >
        <div>
          <span class="doctor-name">{{ item.username }}</span>
          <span>{{ item.title }}</span>
        </div>
        <div>
          <span>就诊科室:</span>
          <span>{{ item.department }}</span>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
const doctorsArr = reactive([
  {
    username: "newdoctor1",
    title: "Consultant2",
    department: "Cardiology3",
  },
]);
const toRegister = (item: any) => {
  navigateTo({ path: "/reg2", query: { doctorInfo: JSON.stringify(item) } });
};
</script>
<style scoped>
.regi-top-div {
  width: 60%;
}
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

.search-container input {
  width: 300px; /* Adjust width as needed */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.search-container button {
  padding: 10px 20px;
  border: none;
  background-color: #2ec561;
  color: white;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.search-container button:hover {
  background-color: #2ec561;
}
.regi-top-div {
  width: 60%;
  padding-left: 10%;
  padding-right: 10%;
  height: 90px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  border-top: 1px solid;
  margin: 0 auto; /* 使 div 水平居中 */
}

.avatar {
  width: 50px;
  margin-left: 20px;
  border-radius: 50%;
}
.show-department {
  width: 650px;
  height: 82px;
  background-color: #f8f8f8;
  margin: 0 auto; /* 添加这一行 */
  margin-bottom: 30px;
  margin-top: 15px;
}

.menu {
  border: 1px solid #ebebeb;
  background-color: #f9f9f9;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}

.menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu li {
  display: inline-block;
  margin-right: 10px;
  margin-top: 5px;
  padding: 5px 10px;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}
</style>
