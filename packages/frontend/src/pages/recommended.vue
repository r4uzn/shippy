<template>
  <div class="container">
    <h1>맞춤 프로젝트 추천</h1>
    <p class="description">코사인 유사도 분석 결과</p>
    
    <div v-if="loading" class="status-message">추천 프로젝트를 분석 중입니다...</div>
    
    <div v-else-if="projects.length === 0" class="status-message no-projects">
        <p>추천할 프로젝트를 찾지 못했습니다.</p>
        <p><strong>[문제 진단]:</strong> 백엔드 API 호출 결과 배열의 길이가 0이거나, API 호출 자체가 실패했습니다. Mock 스킬을 DB에 저장했는지 확인해 주세요.</p>
    </div>

    <div v-else class="projects-grid-debug">
        
        <div v-for="p in projects" :key="p.id" class="debug-card">
            <h3>{{ p.title || '제목 없음' }} (ID: {{ p.id }})</h3>
            <p>매칭 유사도: <strong>{{ ((p.matchScore || 0) * 100).toFixed(1) }}%</strong></p>
            <p>작성자: {{ p.owner?.name || '작성자 정보 없음' }}</p>
            <p>기술 스택: {{ p.techStack?.join(', ') || '요구 스킬 없음' }}</p>
            <button @click="goToDetail(p.id)">상세 보기</button>
        </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth'; 
// ProjectCard 임포트를 제거해야 합니다.

const router = useRouter();
const { isAuthenticated } = useAuth();
const projects = ref([]);
const loading = ref(true);

const fetchRecommendations = async () => {
    // 🚨 [디버깅] 함수가 실행됨을 콘솔에 기록
    console.log('Fetching recommendations...');

    if (!isAuthenticated.value) {
        console.log('인증 필요. 리다이렉트.');
        router.push('/');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/me/recommendations', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // 데이터가 성공적으로 도착
        console.log('API Success. Received data length:', response.data.length);
        projects.value = response.data;
        
    } catch (error) {
        // API 호출 실패 시
        console.error('API 호출 실패:', error.response?.status, error.message);
        projects.value = []; 
        
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
.status-message {
    text-align: center;
    padding: 3rem;
    color: #888;
}

/* 🚨 디버깅 메시지 스타일 */
.no-projects {
    background-color: #fff3f3; 
    border: 1px solid #ffaaaa;
    color: #a00000;
    padding: 20px;
    border-radius: 8px;
    font-size: 1rem;
    line-height: 1.5;
}
.no-projects strong {
    font-weight: bold;
}

/* 디버그 카드 스타일 */
.projects-grid-debug {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
}
.debug-card {
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 8px;
    background: #f9f9f9;
}
.debug-card h3 {
    margin-top: 0;
    font-size: 1.1rem;
}
</style>