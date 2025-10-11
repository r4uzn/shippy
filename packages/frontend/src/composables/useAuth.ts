import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// 모듈 범위에서 상태를 관리합니다.
const token = ref<string | null>(localStorage.getItem('token'));
const user = ref<any | null>(null);

// 사용자가 인증되었는지 여부를 나타내는 계산된 속성입니다.
const isAuthenticated = computed(() => !!token.value);

/**
 * 인증 상태를 관리하는 컴포저블 함수
 */
export function useAuth() {

  const fetchUser = async () => {
    if (token.value) {
      try {
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token.value}` }
        });
        user.value = response.data;
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        // 토큰이 유효하지 않은 경우일 수 있으므로 인증 정보를 초기화합니다.
        clearAuth();
      }
    }
  };

  /**
   * 로그인 처리 함수
   * @param newToken - 서버에서 받은 JWT
   */
  const setAuth = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
    fetchUser(); // 로그인 후 즉시 사용자 정보를 가져옵니다.
  };

  /**
   * 로그아웃 처리 함수
   */
  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  };

  // 컴포저블이 처음 사용될 때 사용자 정보를 가져옵니다.
  onMounted(() => {
    if (isAuthenticated.value) {
      fetchUser();
    }
  });

  return {
    isAuthenticated,
    user,
    setAuth,
    clearAuth,
  };
}
