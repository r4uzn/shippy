<template>
  <div class="container">
    <div v-if="user">
      <h1>{{ user.name }}님의 프로필</h1>
      <div class="profile-card">
        <div class="profile-item">
          <label>이름:</label>
          <span>{{ user.name }}</span>
        </div>
        <div class="profile-item">
          <label>이메일:</label>
          <span>{{ user.email }}</span>
        </div>
        <div class="profile-item">
          <label>MBTI:</label>
          <span>{{ user.personality || '정보 없음' }}</span>
        </div>
        <div class="profile-item">
          <label>상태:</label>
          <span>{{ user.status || '정보 없음' }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <p>사용자 정보를 불러오는 중...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const user = ref(null);

onMounted(async () => {
  try {
    const userId = route.params.id;
    const response = await axios.get(`/api/users/${userId}`);
    user.value = response.data;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    alert('사용자 정보를 불러오는 데 실패했습니다.');
  }
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  color: #333;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-item label {
  font-weight: bold;
  width: 80px;
}

.profile-item span {
  flex-grow: 1;
}
</style>
