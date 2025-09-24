/**
 * 환경 변수들을 객체로 묶어 내보냅니다.
 * 이를 통해 코드 전체에서 일관되게 환경 변수를 사용할 수 있습니다.
 * .env 파일에 해당 변수가 없으면 || 뒤의 기본값을 사용합니다.
 */
declare const config: {
    port: string | number;
    jwt: {
        secret: string;
        expiresIn: string;
    };
    databaseUrl: string | undefined;
};
export default config;
//# sourceMappingURL=config.d.ts.map