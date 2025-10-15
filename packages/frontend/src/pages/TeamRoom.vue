<template>
  <div class="team-room-layout">
    <div class="team-sidebar">
      <h2>내 팀 목록</h2>
      <div v-if="loadingTeams" class="status">팀 목록 로딩 중...</div>
      <ul v-else-if="teams.length > 0" class="team-list">
        <li
          v-for="team in teams"
          :key="team.projectId"
          :class="['team-item', { 'is-active': selectedProjectId === team.projectId }]"
          @click="selectTeam(team.projectId)"
        >
          {{ team.project.title }}
        </li>
      </ul>
      <p v-else class="status">참여 중인 팀이 없습니다.</p>
    </div>

    <div class="main-content">
      <div class="video-chat-container">
        <div class="video-grid">
          <div class="video-wrapper">
            <video ref="localVideoRef" autoplay playsinline muted></video>
            <span class="video-label">내 화면</span>
          </div>
          <div v-for="(stream, peerId) in remoteStreams" :key="peerId" class="video-wrapper">
            <video :ref="el => setRemoteVideoRef(peerId, el as HTMLVideoElement)" autoplay playsinline></video>
            <span class="video-label">{{ peerId.substring(0, 6) }}</span>
          </div>
        </div>
        <div class="controls">
          <button @click="toggleAudio" :class="{ active: isAudioEnabled }">
            {{ isAudioEnabled ? '음소거' : '음소거 해제' }}
          </button>
          <button @click="toggleVideo" :class="{ active: isVideoEnabled }">
            {{ isVideoEnabled ? '카메라 끄기' : '카메라 켜기' }}
          </button>
          <button @click="startCall" class="start-call">참여</button>
          <button @click="endCall" class="end-call">나가기</button>
        </div>
      </div>

      <div class="chat-main">
        <div v-if="!selectedProjectId" class="chat-placeholder">
          <p>왼쪽에서 팀을 선택하여 채팅을 시작하세요.</p>
        </div>
        <div v-else class="chat-window">
          <h3 class="chat-header">{{ selectedTeam?.project.title }}</h3>
          <div class="message-list" ref="messageListRef">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="['message-item', { 'my-message': msg.sender === userName }]"
            >
              <strong>{{ msg.sender }}:</strong> {{ msg.content }}
            </div>
          </div>
          <div class="input-area">
            <input
              v-model="inputMessage"
              @keyup.enter="sendMessage"
              :placeholder="`#${selectedTeam?.project.title}에 메시지 보내기...`"
            />
            <button @click="sendMessage" :disabled="!inputMessage.trim()">전송</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useAuth } from '../composables/useAuth';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

// --- 상태 관리 ---
const { user, isAuthenticated } = useAuth();
const userName = computed(() => user.value?.name || user.value?.email?.split('@')[0] || '익명');

const teams = ref<any[]>([]);
const loadingTeams = ref(true);
const selectedProjectId = ref<number | null>(null);

const messages = ref<Array<{ content: string; sender: string }>>([]);
const inputMessage = ref('');
const messageListRef = ref<HTMLDivElement | null>(null);
const socket = ref<Socket | null>(null);

// --- WebRTC 상태 ---
const localStream = ref<MediaStream | null>(null);
const peerConnections = ref<Record<string, RTCPeerConnection>>({}); // 여러 명과 연결을 위해 객체로 관리
const remoteStreams = ref<Record<string, MediaStream>>({});
const localVideoRef = ref<HTMLVideoElement | null>(null);
const remoteVideoRefs = ref<Record<string, HTMLVideoElement>>({});

const isAudioEnabled = ref(true);
const isVideoEnabled = ref(true);

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

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

const setRemoteVideoRef = (peerId: string, el: HTMLVideoElement) => {
  if (el) {
    remoteVideoRefs.value[peerId] = el;
    if (remoteStreams.value[peerId]) {
      el.srcObject = remoteStreams.value[peerId];
    }
  }
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
      headers: { Authorization: `Bearer ${token}` },
    });
    teams.value = response.data;
  } catch (error) {
    console.error('팀 목록 조회 실패:', error);
  } finally {
    loadingTeams.value = false;
  }
};

const fetchMessages = async (projectId: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/projects/${projectId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
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

// --- WebRTC 로직 ---
const createPeerConnection = (peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = event => {
        if (event.candidate && socket.value) {
            socket.value.emit('webrtc:ice-candidate', {
                target: peerId,
                candidate: event.candidate,
                from: socket.value.id,
                roomId: selectedProjectId.value
            });
        }
    };

    pc.ontrack = event => {
        remoteStreams.value[peerId] = event.streams[0];
        const videoEl = remoteVideoRefs.value[peerId];
        if(videoEl) {
          videoEl.srcObject = event.streams[0]
        }
    };

    if (localStream.value) {
        localStream.value.getTracks().forEach(track => pc.addTrack(track, localStream.value!));
    }

    peerConnections.value[peerId] = pc;
    return pc;
};


const startCall = async () => {
  if (!selectedProjectId.value) {
    alert('팀을 먼저 선택해주세요.');
    return;
  }
  try {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.value) {
      localVideoRef.value.srcObject = localStream.value;
    }
    socket.value?.emit('webrtc:join', { roomId: selectedProjectId.value });

  } catch (error) {
    console.error('미디어 장치에 접근할 수 없습니다:', error);
    alert('카메라 또는 마이크 사용 권한을 확인해주세요.');
  }
};

const endCall = () => {
    Object.values(peerConnections.value).forEach(pc => pc.close());
    peerConnections.value = {};

    if (localStream.value) {
        localStream.value.getTracks().forEach(track => track.stop());
        localStream.value = null;
    }
    if (localVideoRef.value) localVideoRef.value.srcObject = null;
    
    remoteStreams.value = {};
    
    if (socket.value && selectedProjectId.value) {
        socket.value.emit('webrtc:leave', { roomId: selectedProjectId.value });
    }
};

const toggleAudio = () => {
  if (localStream.value) {
    isAudioEnabled.value = !isAudioEnabled.value;
    localStream.value.getAudioTracks().forEach(track => track.enabled = isAudioEnabled.value);
  }
}

const toggleVideo = () => {
  if (localStream.value) {
    isVideoEnabled.value = !isVideoEnabled.value;
    localStream.value.getVideoTracks().forEach(track => track.enabled = isVideoEnabled.value);
  }
}

// --- 채팅 & 소켓 로직 ---
const selectTeam = (projectId: number) => {
  if (selectedProjectId.value !== projectId) {
    endCall(); // 방을 옮길 때 기존 WebRTC 연결 종료
    if(socket.value && selectedProjectId.value) {
        socket.value.emit('chat:leave', String(selectedProjectId.value))
    }
    selectedProjectId.value = projectId;
    messages.value = [];
    fetchMessages(projectId);
    if(socket.value) {
        socket.value.emit('chat:join', String(projectId));
    }
  }
};

const sendMessage = () => {
  const projectId = selectedProjectId.value;
  if (inputMessage.value.trim() && projectId && socket.value) {
    const payload = {
      roomId: String(projectId),
      message: inputMessage.value,
      sender: userName.value,
    };
    socket.value.emit('chat:send', payload);
    inputMessage.value = '';
  }
};

// --- 생명주기 훅 ---
onMounted(() => {
  socket.value = io('http://localhost:3000');
  fetchTeams();

  socket.value.on('connect', () => {
    console.log('Socket.IO 연결 성공!', socket.value?.id);
  });

  socket.value.on('disconnect', () => {
    console.log('Socket.IO 연결 해제됨.');
    endCall();
  });

  socket.value.on('chat:message', (payload) => {
    if (payload.roomId === String(selectedProjectId.value)) {
      messages.value.push({ content: payload.message, sender: payload.sender });
      scrollToBottom();
    }
  });

  // --- WebRTC 시그널링 이벤트 핸들러 ---
  socket.value.on('webrtc:all-users', async (payload: { users: string[] }) => {
    payload.users.forEach(async (peerId) => {
        if(peerId !== socket.value?.id) {
            const pc = createPeerConnection(peerId);
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.value?.emit('webrtc:offer', {
                target: peerId,
                from: socket.value.id,
                sdp: offer,
                roomId: selectedProjectId.value
            });
        }
    });
  });

  socket.value.on('webrtc:offer', async (payload) => {
    const pc = createPeerConnection(payload.from);
    await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.value?.emit('webrtc:answer', {
        target: payload.from,
        from: socket.value.id,
        sdp: answer,
        roomId: selectedProjectId.value
    });
  });

  socket.value.on('webrtc:answer', async (payload) => {
    const pc = peerConnections.value[payload.from];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    }
  });

  socket.value.on('webrtc:ice-candidate', (payload) => {
    const pc = peerConnections.value[payload.from];
    if (pc) {
      pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
    }
  });

  socket.value.on('webrtc:user-left', (payload: { sid: string }) => {
    if (peerConnections.value[payload.sid]) {
        peerConnections.value[payload.sid].close();
        delete peerConnections.value[payload.sid];
    }
    if (remoteStreams.value[payload.sid]) {
        delete remoteStreams.value[payload.sid];
    }
  });
});

onUnmounted(() => {
  endCall();
  socket.value?.disconnect();
});
</script>

<style scoped>
.team-room-layout {
  display: flex;
  height: calc(100vh - 80px);
  padding-top: 80px;
  background-color: #f0f4f8;
  color: #333;
}

.team-sidebar {
  width: 250px;
  background-color: #e2e8f0;
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

.main-content {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
}

.video-chat-container {
  flex-basis: 350px;
  flex-shrink: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e0e0e0;
}

.video-grid {
  flex-grow: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  overflow-y: auto;
}

.video-wrapper {
  position: relative;
  background: #000;
  border-radius: 6px;
  overflow: hidden;
}

.video-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-label {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 15px;
  flex-shrink: 0;
}
.controls button {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.controls button.active {
  background-color: #4caf50;
  color: white;
}
.controls .start-call { background-color: #28a745; color: white; }
.controls .end-call { background-color: #dc3545; color: white; }


.chat-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0; /* padding은 chat-window에서 처리 */
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
  overflow: hidden;
}
.chat-header {
  padding: 15px 20px;
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
}
.message-item {
  margin-bottom: 10px;
  padding: 8px 12px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
}
.message-item:not(.my-message) {
  align-self: flex-start;
  background-color: #e2e8f0;
}
.my-message {
  align-self: flex-end;
  background-color: #1a73e8;
  color: white;
}

.input-area {
  display: flex;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
}
.input-area input {
  flex-grow: 1;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 10px;
}
.input-area button {
  padding: 12px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
</style>