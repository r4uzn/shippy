import { ref, computed } from 'vue';

// 모듈 범위에서 상태를 관리합니다.
const token = ref<string | null>(localStorage.getItem('token'));

// 사용자가 인증되었는지 여부를 나타내는 계산된 속성입니다.
const isAuthenticated = computed(() => !!token.value);

/**
 * 인증 상태를 관리하는 컴포저블 함수
 */
export function useAuth() {

  /**
   * 로그인 처리 함수
   * @param newToken - 서버에서 받은 JWT
   */
  const setAuth = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  /**
   * 로그아웃 처리 함수
   */
  const clearAuth = () => {
    token.value = null;
    localStorage.removeItem('token');
    // 필요하다면 여기에 추가적인 정리 로직을 넣을 수 있습니다.
    // 예: 사용자 정보 초기화
  };

  return {
    isAuthenticated,
    setAuth,
    clearAuth,
  };
}
