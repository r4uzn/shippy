<template>
  <div class="container">
    <h1>맞춤 프로젝트 추천</h1>
    <p class="description">나의 스킬과 프로젝트 요구사항의 코사인 유사도를 바탕으로 추천된 목록입니다. (상위 5개)</p>
    
    <div v-if="loading" class="status-message">추천 프로젝트를 분석 중입니다...</div>
    <div v-else-if="projects.length > 0" class="projects-grid">
      <ProjectCard v-for="p in projects" :key="p.id" v-bind="p" @click="goToDetail(p.id)">
        <template v-slot:footer>
          <div class="project-footer">
            <span class="match-score">매칭 점수: {{ p.matchScore ? p.matchScore.toFixed(3) : 'N/A' }}</span>
          </div>
          <div class="project-meta">
             <span>작성자: {{ p.owner.name }}</span>
             <span>마감일: {{ new Date(p.deadline).toLocaleDateString() }}</span>
          </div>
        </template>
      </ProjectCard>
    </div>
    <div v-else class="status-message">
        <p>추천할 프로젝트를 찾지 못했습니다. 프로필의 자기소개를 등록하거나, 더 많은 프로젝트가 등록되기를 기다려주세요!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth'; 
import ProjectCard from '../components/ProjectCard.vue';

const router = useRouter();
const { isAuthenticated } = useAuth();
const projects = ref([]);
const loading = ref(true);

const fetchRecommendations = async () => {
    if (!isAuthenticated.value) {
        alert('로그인이 필요합니다.');
        router.push('/');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        // 코사인 유사도 기반 추천 API 호출
        const response = await axios.get('/api/users/me/recommendations', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // 백엔드에서 Project 객체에 임시로 matchScore를 추가하여 반환했을 것으로 가정합니다.
        projects.value = response.data;
        
    } catch (error) {
        console.error('추천 목록 조회 실패:', error);
        alert('추천 목록을 불러오는 데 실패했습니다. (백엔드 오류 확인)');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchRecommendations();
});

const goToDetail = (id) => {
    router.push(`/projects/${id}`);
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: #333;
}
h1 {
    margin-bottom: 0.5rem;
}
.description {
    color: #666;
    margin-bottom: 2rem;
}
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
.status-message {
    text-align: center;
    padding: 3rem;
    color: #888;
}

/* 추천 점수 스타일 (프로젝트 카드 내부에 표시) */
.match-score {
    font-weight: bold;
    color: #e8491a; /* 강조 색상 */
    font-size: 0.9rem;
    padding: 0.3rem 0;
}
/* ProjectCard의 기본 footer 스타일 재정의가 필요할 수 있습니다. */
</style>