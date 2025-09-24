<template>
  <div class="container" v-if="project">
    <h1>{{ project.title }}</h1>
    <div class="project-meta">
      <span>작성자: {{ project.owner.name }}</span>
      <span>마감일: {{ new Date(project.deadline).toLocaleDateString() }}</span>
    </div>
    <div class="project-content">
      <h3>프로젝트 설명</h3>
      <p>{{ project.description }}</p>
      <h3>기술 스택</h3>
      <div class="tech-stack">
        <span v-for="tech in project.techStack" :key="tech" class="tech-item">{{ tech }}</span>
      </div>
      <h3>모집 인원</h3>
      <p>{{ project.members }}</p>
    </div>

    <!-- 지원하기 버튼 -->
    <div class="apply-section" v-if="isAuthenticated">
      <button @click="handleApply" :disabled="project.hasApplied || isApplying" class="apply-btn">
        <span v-if="isApplying">지원 중...</span>
        <span v-else-if="project.hasApplied">지원 완료</span>
        <span v-else>지원하기</span>
      </button>
    </div>
    <div class="apply-section" v-else>
      <p>프로젝트에 지원하려면 <router-link to="/">로그인</router-link>이 필요합니다.</p>
    </div>

  </div>
  <div v-else>
    <p>프로젝트를 불러오는 중...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const router = useRouter();
const project = ref(null);
const isApplying = ref(false);

const { isAuthenticated } = useAuth();

const fetchProject = async () => {
  try {
    const projectId = route.params.id;
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.get(`/api/projects/${projectId}`, { headers });
    project.value = response.data;
  } catch (error) {
    console.error('프로젝트 조회 실패:', error);
    alert('프로젝트를 불러오는 데 실패했습니다.');
  }
};

const handleApply = async () => {
  isApplying.value = true;
  try {
    const projectId = route.params.id;
    const token = localStorage.getItem('token');
    
    await axios.post(`/api/projects/${projectId}/apply`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('성공적으로 지원했습니다.');
    // 지원 상태를 즉시 반영하기 위해 프로젝트 정보를 다시 불러옵니다.
    fetchProject();

  } catch (error) {
    console.error('지원 실패:', error);
    alert(error.response?.data?.message || '지원에 실패했습니다.');
  } finally {
    isApplying.value = false;
  }
};

onMounted(() => {
  fetchProject();
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  color: #333; /* 텍스트 색상 추가 */
}
.project-meta {
  margin-bottom: 2rem;
  color: #666;
}
.project-meta span {
  margin-right: 1rem;
}
.project-content h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.tech-stack {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.tech-item {
  background-color: #f0f0f0;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}
.apply-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
  text-align: center;
}
.apply-btn {
  padding: 0.8rem 2rem;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}
.apply-btn:hover:not(:disabled) {
  background-color: #1669c1;
}
.apply-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
