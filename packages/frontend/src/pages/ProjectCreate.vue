<template>
  <div class="container">
    <h1>프로젝트 등록</h1>
    <form @submit.prevent="submitProject">
      <div class="form-group">
        <label for="title">제목</label>
        <input type="text" id="title" v-model="project.title" required>
      </div>
      <div class="form-group">
        <label for="description">설명</label>
        <textarea id="description" v-model="project.description" required></textarea>
      </div>
      <div class="form-group">
        <label for="techStack">기술 스택 (쉼표로 구분)</label>
        <input type="text" id="techStack" v-model="techStackInput">
      </div>
      <div class="form-group">
        <label for="members">모집 인원</label>
        <input type="text" id="members" v-model="project.members" required>
      </div>
      <div class="form-group">
        <label for="deadline">마감일</label>
        <input type="date" id="deadline" v-model="project.deadline" required>
      </div>
      <button type="submit" class="submit-btn">등록하기</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const project = ref({
  title: '',
  description: '',
  techStack: [],
  members: '',
  deadline: ''
});

const techStackInput = ref('');

const submitProject = async () => {
  try {
    // 마감일을 ISO 문자열로 변환
    const deadlineISO = new Date(project.value.deadline).toISOString();
    
    const projectData = {
      ...project.value,
      techStack: techStackInput.value.split(',').map(item => item.trim()),
      deadline: deadlineISO,
    };

    const response = await axios.post('/api/projects', projectData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    alert('프로젝트가 성공적으로 등록되었습니다.');
    router.push(`/projects/${response.data.id}`);
  } catch (error) {
    console.error('프로젝트 등록 실패:', error);
    alert('프로젝트 등록에 실패했습니다. 로그인 상태를 확인해주세요.');
  }
};
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

.container h1 {
  margin-bottom: 2rem; /* 제목 하단 여백 추가 */
}
.form-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
input, textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}
.submit-btn {
  padding: 0.8rem 1.5rem;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
