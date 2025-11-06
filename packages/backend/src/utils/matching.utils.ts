// packages/backend/src/utils/matching.utils.ts

// 스킬:숙련도 형식의 문자열을 파싱하여 [스킬, 숙련도] 튜플로 변환합니다.
function parseSkills(skills: string[]): Map<string, number> {
    const skillMap = new Map<string, number>();
    for (const skill of skills) {
        const parts = skill.split(':');
        const name = parts[0].trim();
        const proficiency = parseFloat(parts[1]) || 0;
        if (name) {
            skillMap.set(name, proficiency);
        }
    }
    return skillMap;
}

// 두 벡터(Map)의 코사인 유사도를 계산합니다.
function calculateCosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    // 모든 고유 키(스킬)를 결합하여 공통 차원을 정의합니다.
    const allSkills = new Set([...vecA.keys(), ...vecB.keys()]);

    for (const skill of allSkills) {
        const valA = vecA.get(skill) || 0;
        const valB = vecB.get(skill) || 0;

        dotProduct += valA * valB;
        magnitudeA += valA * valA;
        magnitudeB += valB * valB;
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    // 분모가 0인 경우 (두 벡터 모두 0인 경우)는 유사도 0으로 처리합니다.
    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

// 사용자 스킬과 프로젝트 요구사항을 기반으로 매칭 점수를 계산하는 메인 함수
export function calculateMatchScore(userSkills: string[], projectRequiredSkills: string[]): number {
    // 1. 사용자 스킬 (숙련도 포함) 벡터화
    const userVector = parseSkills(userSkills);

    // 2. 프로젝트 요구 스킬 벡터화 (요구사항은 숙련도 5.0으로 가정)
    // 실제 프로젝트 스킬(techStack)은 숙련도 없이 이름만 제공되므로, 
    // 여기서는 요구 스킬의 존재 여부를 1.0으로 벡터화합니다. (프로젝트 요구사항은 단순 존재 여부만 확인)
    const projectVector = new Map<string, number>();
    for (const skill of projectRequiredSkills) {
        // 요구 스킬은 모두 1.0의 가중치를 가집니다.
        projectVector.set(skill, 1.0);
    }

    // 3. 코사인 유사도 계산
    return calculateCosineSimilarity(userVector, projectVector);
}