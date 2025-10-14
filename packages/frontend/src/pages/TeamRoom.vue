// packages/frontend/src/pages/TeamRoom.vue (전체 코드)

<template>
  <div class="team-room-layout">
    
    <div class="team-sidebar">
      <h2>내 팀 목록</h2>
      <div v-if="loadingTeams" class="status">팀 목록 로딩 중...</div>
      <ul v-else-if="teams.length > 0" class="team-list">
        <li v-for="team in teams" :key="team.projectId" 
            :class="['team-item', { 'is-active': selectedProjectId === team.projectId }]"
            @click="selectTeam(team.projectId)">
          {{ team.project.title }}
        </li>
      </ul>
      <p v-else class="status">참여 중인 팀이 없습니다.</p>
    </div>

    <div class="chat-main">
      
      <div v-if="!selectedProjectId" class="chat-placeholder">
        <p>왼쪽에서 팀을 선택하여 채팅을 시작하세요.</p>
      </div>

      <div v-else class="chat-window">
        <h3 class="chat-header">{{ selectedTeam?.project.title }}</h3>

        <div class="message-list" ref="messageListRef">
          <div v-for="(msg, index) in messages" :key="index" :class="['message-item', { 'my-message': msg.sender === userName }]">
            <strong>{{ msg.sender }}:</strong> {{ msg.content }}
          </div>
        </div>

        <div class="input-area">
          <input v-model="inputMessage" @keyup.enter="sendMessage" 
                 :placeholder="`#${selectedTeam?.project.title}에 메시지 보내기...`" />
          <button @click="sendMessage" :disabled="!inputMessage.trim()">전송</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useAuth } from '../composables/useAuth';
import axios from 'axios';
import { io } from 'socket.io-client';

// --- 상태 관리 ---
const { user, isAuthenticated } = useAuth();
const userName = computed(() => {
  const name = user.value?.name;
  if (name && name.trim()) return name;
  const email = user.value?.email;
  const localPart = typeof email === 'string' ? email.split('@')[0] : '';
  return localPart || '익명';
});

const teams = ref<any[]>([]);
const loadingTeams = ref(true);
const selectedProjectId = ref<number | null>(null);

// [수정] 메시지 배열의 타입을 통일합니다.
const messages = ref<Array<{ content: string; sender: string }>>([]);
const inputMessage = ref('');
const socket = io('http://localhost:3000'); 
const messageListRef = ref<HTMLDivElement | null>(null);

const selectedTeam = computed(() => {
  if (selectedProjectId.value === null) return null;
  return teams.value.find(team => team.projectId === selectedProjectId.value);
});


// --- 유틸리티 ---
const scrollToBottom = () => {
    nextTick(() => {
        const element = messageListRef.value;
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    });
};


// --- 데이터 로딩 ---
const fetchTeams = async () => {
  if (!isAuthenticated.value) {
    loadingTeams.value = false;
    return;
  }
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/users/me/applications', {
      headers: { Authorization: `Bearer ${token}` }
    });
    teams.value = response.data;
    
    if (teams.value.length > 0 && selectedProjectId.value === null) {
        selectTeam(teams.value[0].projectId);
    }

  } catch (error) {
    console.error('팀 목록 조회 실패:', error);
  } finally {
    loadingTeams.value = false;
  }
};


// --- 채팅 로직 ---
// [수정] API에서 메시지를 불러와서 통일된 형식으로 변환합니다.
const fetchMessages = async (projectId: number) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/projects/${projectId}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        messages.value = response.data.map((msg: any) => ({
            content: msg.content,
            sender: msg.author.name || msg.author.email.split('@')[0],
        }));
        scrollToBottom();
    } catch (error) {
        console.error('채팅 기록 불러오기 실패:', error);
    }
};

const joinRoom = (projectId: number) => {
  if (selectedProjectId.value) {
    // socket.emit('chat:leave', selectedProjectId.value);
  }

  messages.value = []; 
  fetchMessages(projectId);
  selectedProjectId.value = projectId;

  // 서버에 새로운 방 참여 요청
  if (socket.connected) {
      socket.emit('chat:join', String(projectId)); 
      console.log(`[Socket] Room ${projectId}에 참여 요청`);
  } else {
      console.log(`[Socket] 소켓 연결 중... 재연결 시도 후 Room ${projectId} 참여 요청 예정.`);
  }
};

const selectTeam = (projectId: number) => {
    if (selectedProjectId.value !== projectId) {
        joinRoom(projectId);
    }
};


const sendMessage = () => {
  const projectId = selectedProjectId.value;
  if (inputMessage.value.trim() && projectId) {
    const payload = {
      roomId: String(projectId),
      message: inputMessage.value,
      sender: userName.value,
    };

    socket.emit('chat:send', payload); 
    
    inputMessage.value = '';
  }
};


// --- 생명주기 훅 ---
onMounted(() => {
  fetchTeams();
  scrollToBottom();

  socket.on('connect', () => {
    console.log('Socket.IO 연결 성공!');
    if (selectedProjectId.value) {
        joinRoom(selectedProjectId.value);
    }
  });

  socket.on('disconnect', () => {
      console.log('Socket.IO 연결 해제됨.');
  });
  
  // [수정] 백엔드에서 받은 메시지를 통일된 형식으로 변환합니다.
  socket.on('chat:message', (payload) => {
    if (payload.roomId === String(selectedProjectId.value)) {
        // [수정] API 데이터와 동일한 형식으로 변환
        messages.value.push({ content: payload.message, sender: payload.sender });
        scrollToBottom();
    }
  });

  socket.on('user:joined', (payload) => {
    if (payload.roomId === String(selectedProjectId.value)) {
        messages.value.push({
            content: `[시스템] ${payload.userId} 님이 채팅방에 접속했습니다.`,
            sender: '시스템',
        });
        scrollToBottom();
    }
  });
});
</script>

<style scoped>
/* 디스코드 레이아웃 스타일 */
.team-room-layout {
  display: flex;
  height: calc(100vh - 80px); /* 화면 높이 - Navbar 높이 */
  padding-top: 80px;
  background-color: #f0f4f8; /* 배경색 */
  color: #333;
}

/* 1. 팀 사이드바 스타일 */
.team-sidebar {
  width: 250px;
  background-color: #e2e8f0; /* 밝은 회색 */
  padding: 15px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  flex-shrink: 0;
}

.team-sidebar h2 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #1a1a1a;
  border-bottom: 1px solid #c0c0c0;
  padding-bottom: 10px;
}

.team-list {
  list-style: none;
  padding: 0;
}

.team-item {
  padding: 10px 15px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  background-color: #ffffff;
  font-weight: 500;
  border-left: 4px solid transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team-item:hover {
  background-color: #d1d9e2;
}

.team-item.is-active {
  background-color: #1a73e8;
  color: white;
  border-left-color: #0d47a1;
  font-weight: bold;
}

/* 2. 채팅 메인 스타일 */
.chat-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.chat-placeholder {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  color: #666;
}

.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  background-color: #ffffff;
}

.message-list {
  flex-grow: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column; /* 메시지를 아래로 정렬 */
}

.message-item {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 0.95rem;
}

.message-item strong {
    font-weight: bold;
    margin-right: 5px;
}

.message-item:not(.my-message) {
  align-self: flex-start;
  background-color: #e2e8f0;
  color: #1a1a1a;
}

.my-message {
  align-self: flex-end;
  background-color: #1a73e8;
  color: white;
}

.my-message strong {
    color: white;
}

/* 입력 영역 */
.input-area {
  display: flex;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  background: #ffffff;
}

.input-area input {
  flex-grow: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 10px;
  background-color: #f9f9f9;
  color: #333;
  font-size: 1rem;
}

.input-area button {
  padding: 12px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.input-area button:hover:not(:disabled) {
  background-color: #1e8e3e;
}

.input-area button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>a