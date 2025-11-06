// packages/backend/src/services/llm.service.ts

import axios from 'axios';
import logger from '../utils/logger.js';
import { User } from '@prisma/client';

// Ollama API 호출 및 스킬 추출을 요청하는 함수
export async function extractSkillsFromBio(bio: string): Promise<string[]> {
    const LLM_PORT = 11434;
    const LLM_API_URL = `http://localhost:${LLM_PORT}/api/generate`;
    const MODEL_NAME = 'gemma3:4b'; // 

    // LLM에 정확한 JSON 응답 형식을 요구하는 프롬프트
    const prompt = `다음 사용자의 자기소개서 내용을 분석하여, 언급된 기술 스킬과 해당 스킬에 대한 숙련도를 1.0(초급)에서 5.0(전문가) 사이의 소수점 값으로 평가하고, 결과를 JSON 형식의 문자열 배열로만 반환하시오. 각 문자열은 '스킬명:숙련도' (예: ['Python:3.5', 'React:4.0']) 형식이어야 합니다. 언급된 스킬이 없으면 빈 배열을 반환하시오.

자기소개서: ${bio}`;

    try {
        const response = await axios.post(LLM_API_URL, {
            model: MODEL_NAME,
            prompt: prompt,
            stream: false,
            format: 'json',
            options: {
                temperature: 0.1,
            }
        });

        // 🚨 [수정] 응답 객체를 'any'로 명시적으로 캐스팅하여 타입 오류를 해결합니다.
        const responseData: any = response.data;
        const rawResponse = responseData.response;

        // JSON 문자열 파싱 및 클리닝
        let jsonString = rawResponse.trim();
        if (jsonString.startsWith('"') && jsonString.endsWith('"')) {
            // LLM이 반환한 JSON 문자열에서 이스케이프 문자를 제거
            jsonString = jsonString.slice(1, -1).replace(/\\n/g, '').replace(/\\"/g, '"');
        }

        const extracted = JSON.parse(jsonString);

        if (Array.isArray(extracted)) {
            logger.info(`LLM 스킬 추출 성공 (${MODEL_NAME}): ${extracted.join(', ')}`);
            return extracted as string[];
        }

        logger.error('LLM 응답 형식 오류: 배열 형식이 아님', { rawResponse });
        return [];

    } catch (error) {
        logger.error(`LLM API 호출 실패 또는 파싱 오류 (${MODEL_NAME}): Request failed with status code ${error.response?.status || 'N/A'}`, error);
        return [];
    }
}