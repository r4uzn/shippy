<script setup lang="ts">
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="shippy-main">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
/* 전체 페이지 스타일 리셋 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
  background-color: #f8f9fa; /* 전체 배경색 추가 */
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
}

.main-content {
  padding-top: 80px; /* 네비게이션바 높이만큼 패딩 추가 */
}
</style>

