import { Router } from "express";
const router = Router();
// 샘플 프로젝트 데이터
const projects = [
    {
        id: 1,
        title: "AI 챗봇 개발 프로젝트",
        description: "고객 서비스용 AI 챗봇을 개발하는 프로젝트입니다.",
        techStack: ["Python", "OpenAI", "FastAPI", "React"],
        members: "3/5명",
        deadline: "2024-12-31"
    },
    {
        id: 2,
        title: "모바일 앱 개발",
        description: "위치 기반 소셜 네트워킹 앱을 개발합니다.",
        techStack: ["React Native", "Node.js", "MongoDB"],
        members: "2/4명",
        deadline: "2025-01-15"
    },
    {
        id: 3,
        title: "블록체인 NFT 마켓플레이스",
        description: "NFT 거래를 위한 블록체인 기반 마켓플레이스 개발",
        techStack: ["Solidity", "Web3.js", "Next.js"],
        members: "1/6명",
        deadline: "2025-02-28"
    }
];
// GET /api/projects
router.get("/", (req, res) => {
    res.json(projects);
});
export default router;
//# sourceMappingURL=projects.js.map