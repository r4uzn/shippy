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
          <label>기술 스킬:</label>
          <div class="skills-display">
            <span v-if="user.technicalSkills && user.technicalSkills.length > 0" class="skills-list">
              {{ user.technicalSkills.join(', ') }}
            </span>
            <span v-else class="placeholder">정보 없음</span>
          </div>
        </div>
        <div class="profile-item">
          <label>상태:</label>
          <span>{{ user.status || '정보 없음' }}</span>
        </div>
        
        <div class="profile-item bio-item">
            <label>자기소개:</label>
            <p class="bio-content">{{ user.bio || '정보 없음' }}</p>
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
    // GET /api/users/:userId 요청을 통해 bio 및 technicalSkills가 포함된 사용자 정보를 받습니다.
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
  /* 기술 스킬, Bio 섹션을 위해 flex-start로 변경 */
  align-items: flex-start; 
  gap: 1rem;
}

.profile-item label {
  font-weight: bold;
  width: 80px;
  flex-shrink: 0;
  padding-top: 0.2rem; /* 정렬 맞춤 */
}

/* 기술 스킬 표시 스타일 */
.skills-display {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 0.2rem;
}

.skills-list {
  /* 스킬명:숙련도 형태의 텍스트가 줄 바꿈될 수 있도록 */
  line-height: 1.5; 
  word-break: break-all;
}

.skills-display .placeholder {
  color: #888;
}

/* Bio 섹션 스타일 */
.bio-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.bio-item label {
    padding-top: 0;
}

.bio-content {
    flex-grow: 1;
    white-space: pre-wrap; /* 줄 바꿈 유지 */
    margin: 0;
    line-height: 1.6;
    background-color: #f8f9fa;
    padding: 10px;
    border-radius: 4px;
    width: calc(100% - 90px); /* label 너비만큼 공간 확보 */
}
</style>