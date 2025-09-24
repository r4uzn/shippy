<template>
  <div class="container">
    <h1>프로젝트 목록</h1>
    <div class="project-grid">
      <div v-for="project in projects" :key="project.id" class="project-card" @click="goToDetail(project.id)">
        <h2>{{ project.title }}</h2>
        <p class="description">{{ project.description }}</p>
        <div class="tech-stack">
          <span v-for="tech in project.techStack" :key="tech" class="tech-item">{{ tech }}</span>
        </div>
        <div class="project-footer">
          <span>작성자: {{ project.owner.name }}</span>
          <span>마감일: {{ new Date(project.deadline).toLocaleDateString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const projects = ref([]);
const router = useRouter();

onMounted(async () => {
  try {
    const response = await axios.get('/api/projects');
    projects.value = response.data;
  } catch (error) {
    console.error('프로젝트 목록 조회 실패:', error);
  }
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
  color: #333; /* 컨테이너 기본 텍스트 색상 추가 */
}
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
.project-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  color: #333; /* 카드 기본 텍스트 색상 추가 */
}
.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.project-card h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}
.description {
  color: #666;
  margin-bottom: 1rem;
  height: 4.5em; /* 3 lines with line-height 1.5 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.tech-item {
  background-color: #f0f0f0;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
}
.project-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #888;
  border-top: 1px solid #f0f0f0;
  padding-top: 1rem;
  margin-top: 1rem;
}
</style>
