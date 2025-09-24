<script setup lang="ts">
defineProps<{
  title: string
  description: string
  techStack: string[]
  members: string
  deadline: string
}>()
</script>

<template>
  <div class="project-card">
    <h3 class="project-title">{{ title }}</h3>
    <p class="project-description">{{ description }}</p>
    <div class="project-tech">
      <span v-for="tech in techStack" :key="tech" class="tech-tag">{{ tech }}</span>
    </div>
    <div class="project-meta">
      <span class="members">{{ members }}</span>
      <span class="deadline">{{ deadline }}</span>
    </div>
    <button class="btn-apply">지원하기</button>
  </div>
</template>
