import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Projects from '../pages/Projects.vue'
import ProjectDetail from '../pages/ProjectDetail.vue'
import ProjectCreate from '../pages/ProjectCreate.vue'
import MyApplications from '../pages/MyApplications.vue' // 추가

const routes = [
  { path: '/', component: Home },
  { path: '/projects', component: Projects },
  { path: '/projects/new', component: ProjectCreate }, // 프로젝트 등록
  { path: '/projects/:id', component: ProjectDetail }, // 프로젝트 상세
  { path: '/my-applications', component: MyApplications }, // 내 지원 목록
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
