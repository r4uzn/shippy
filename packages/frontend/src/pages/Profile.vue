<template>
  <div class="container">
    <h1>내 프로필</h1>
    <div v-if="user" class="profile-card">
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
        <div v-if="!isEditing">
          <span>{{ user.personality || '아직 등록되지 않았습니다.' }}</span>
          <button @click="startEditing">수정</button>
        </div>
        <div v-else>
          <input v-model="editablePersonality" placeholder="MBTI를 입력하세요" />
          <button @click="savePersonality">저장</button>
          <button @click="cancelEditing">취소</button>
        </div>
      </div>

      <div class="profile-item bio-item">
        <label>자기소개:</label>
        
        <div v-if="!isEditingBio" class="bio-read-mode"> 
            
            <div class="bio-content-view">
                <span v-if="user.technicalSkills && user.technicalSkills.length > 0" class="skills-tag">
                    주요 스킬: {{ user.technicalSkills.join(', ') }}
                </span>
                
                <p v-if="user.bio" class="bio-text">{{ user.bio }}</p>
                <p v-else class="placeholder-text-bio">아직 등록되지 않았습니다.</p>
            </div>
            
            <button @click="startEditingBio" class="edit-bio-btn-read-mode">
                {{ user.bio ? '수정' : '등록' }}
            </button>
        </div>
        
        <div v-else class="bio-edit-mode-full"> 
          <span v-if="user.technicalSkills && user.technicalSkills.length > 0" class="skills-tag-edit">
              추출된 스킬: {{ user.technicalSkills.join(', ') }}
          </span>
          <textarea v-model="editableBio" placeholder="자기소개를 입력하세요 (이 내용을 기반으로 스킬이 자동 추출됩니다.)" rows="5"></textarea>
          <div class="edit-actions">
            <button @click="saveBio" class="save-btn">저장</button>
            <button @click="cancelEditingBio" class="cancel-btn">취소</button>
          </div>
        </div>
      </div>
      <div class="profile-item">
        <label>상태:</label>
        <div v-if="!isEditingStatus">
          <span>{{ user.status || '오프라인' }}</span>
          <button @click="startEditingStatus">수정</button>
        </div>
        <div v-else>
          <select v-model="editableStatus">
            <option value="온라인">온라인</option>
            <option value="오프라인">오프라인</option>
            <option value="다른 용무 중">다른 용무 중</option>
          </select>
          <button @click="saveStatus">저장</button>
          <button @click="cancelEditingStatus">취소</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>프로필 정보를 불러오는 중...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useAuth } from '../composables/useAuth';
import axios from 'axios';

const { user } = useAuth();

// MBTI 상태
const isEditing = ref(false);
const editablePersonality = ref('');

// Status 상태
const isEditingStatus = ref(false);
const editableStatus = ref('');

// Bio 상태
const isEditingBio = ref(false);
const editableBio = ref(''); 

watch(user, (newUser) => {
  if (newUser) {
    editablePersonality.value = newUser.personality || '';
    editableStatus.value = newUser.status || '오프라인';
    // Bio 초기화
    editableBio.value = newUser.bio || ''; 
  }
}, { immediate: true });

// MBTI 관련 로직 (생략)
const startEditing = () => { isEditing.value = true; };
const cancelEditing = () => { isEditing.value = false; editablePersonality.value = user.value.personality || ''; };
const savePersonality = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put('/api/users/me/personality', { personality: editablePersonality.value }, { headers: { Authorization: `Bearer ${token}` } });
        if (user.value) { user.value.personality = response.data.personality; }
        isEditing.value = false;
        alert('MBTI가 성공적으로 업데이트되었습니다.');
    } catch (error) { console.error('MBTI 업데이트 실패:', error); alert('MBTI 업데이트에 실패했습니다.'); }
};


// Status 관련 로직 (생략)
const startEditingStatus = () => { isEditingStatus.value = true; };
const cancelEditingStatus = () => { isEditingStatus.value = false; editableStatus.value = user.value.status || '오프라인'; };
const saveStatus = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put('/api/users/me/status', { status: editableStatus.value }, { headers: { Authorization: `Bearer ${token}` } });
        if (user.value) { user.value.status = response.data.status; }
        isEditingStatus.value = false;
        alert('상태가 성공적으로 업데이트되었습니다.');
    } catch (error) { console.error('상태 업데이트 실패:', error); alert('상태 업데이트에 실패했습니다.'); }
};

// Bio 관련 로직
const startEditingBio = () => {
  editableBio.value = user.value.bio || '';
  isEditingBio.value = true;
};

const cancelEditingBio = () => {
  isEditingBio.value = false;
  editableBio.value = user.value.bio || '';
};

const saveBio = async () => {
  if (!editableBio.value.trim()) {
    alert('자기소개를 입력해주세요.');
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put('/api/users/me/bio', 
      { bio: editableBio.value }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // 백엔드에서 업데이트된 user 객체를 받아 상태 갱신
    if (user.value) {
        user.value.bio = response.data.bio;
        user.value.technicalSkills = response.data.technicalSkills;
    }

    isEditingBio.value = false;
    alert('자기소개가 성공적으로 업데이트되었고, 스킬이 추출되었습니다.');

  } catch (error) {
    console.error('자기소개 업데이트 실패:', error);
    alert('자기소개 업데이트에 실패했습니다.');
  }
};
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
  align-items: flex-start; /* 항목 시작점에 맞춤 */
  gap: 1rem;
  position: relative; 
}

.profile-item label {
  font-weight: bold;
  width: 80px;
  flex-shrink: 0; 
  padding-top: 0.4rem; 
}

/* MBTI/Status 항목의 내용과 버튼을 위한 flex 컨테이너 */
.profile-item > div {
    flex-grow: 1;
    display: flex;
    align-items: center;
}

/* 👇 [수정] Bio 읽기 모드 (버튼만) 컨테이너 스타일 */
.profile-item.bio-item {
    align-items: flex-start;
}

.bio-read-mode {
    flex-grow: 1;
    display: flex;
    align-items: flex-start; 
    justify-content: flex-start; 
    width: 100%;
    position: relative; /* 버튼의 절대 위치를 위한 기준점 */
}

/* Bio의 내용과 스킬 태그를 담는 뷰 (읽기 모드) */
.bio-content-view {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: calc(100% - 90px); /* 버튼 공간만큼 너비 확보 */
    padding-right: 10px; /* 버튼과의 간격 */
}

.bio-content-view .skills-tag {
    font-size: 0.85rem;
    font-weight: bold;
    color: #1a73e8;
    border: 1px solid #1a73e8;
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 5px;
    line-height: 1.2;
}

.bio-content-view .bio-text, .bio-content-view .placeholder-text-bio {
    white-space: pre-wrap;
    width: 100%;
    margin: 0;
    line-height: 1.5;
    word-break: break-word;
    /* Bio 내용이 길어질 경우를 대비해 여백 제거 */
}

.bio-content-view .placeholder-text-bio {
    color: #888;
}


/* 💡 [수정] 버튼 위치 조정: absolute 대신 flex를 활용해 오른쪽에 고정*/
.edit-bio-btn-read-mode {
    position: absolute;
    right: 0;
    top: 0;
    margin-left: 0; 
    padding: 0.4rem 0.8rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f0f0f0 !important; 
    color: #333 !important;
    flex-shrink: 0; 
    z-index: 1;
}

/* 편집 모드 전체 컨테이너 */
.bio-edit-mode-full {
    flex-grow: 1;
    width: calc(100% - 90px); /* label 너비 제외 */
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.bio-edit-mode-full .skills-tag-edit {
    font-size: 0.85rem;
    font-weight: bold;
    color: #1a73e8;
    border: 1px solid #1a73e8;
    padding: 2px 6px;
    border-radius: 4px;
    margin-bottom: 5px;
    align-self: flex-start;
    line-height: 1.2;
}

.bio-edit-mode-full textarea {
    width: 100%;
    margin-bottom: 10px;
    min-height: 100px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    color: #333;
    font-family: inherit;
    box-sizing: border-box;
}

.bio-edit-mode-full .edit-actions {
    display: flex;
    gap: 0.5rem;
}

.bio-edit-mode-full .save-btn {
    background-color: #1a73e8; 
    color: white;
    border: none;
}

.bio-edit-mode-full .cancel-btn {
    background-color: #6c757d; 
    color: white;
    border: none;
}

/* 기존 항목 버튼 스타일 (MBTI, Status) */
.profile-item > div > button {
  margin-left: 0.5rem;
}
.profile-item > div > button:first-of-type {
    background-color: #28a745;
    color: white;
}
.profile-item > div > button:last-of-type {
    background-color: #6c757d;
    color: white;
}

/* 기존 input, select 스타일 */
.profile-item input,
.profile-item select {
  flex-grow: 1;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
}
</style>