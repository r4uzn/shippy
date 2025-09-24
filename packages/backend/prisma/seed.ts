import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // 1. 기존 데이터 삭제
  console.log('Deleting existing data...');
  await prisma.application.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. 샘플 사용자 생성
  console.log('Creating sample users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      name: '김개발',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      name: '이코딩',
      password: hashedPassword,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'user3@example.com',
      name: '박서버',
      password: hashedPassword,
    },
  });

  console.log(`Created users: ${user1.name}, ${user2.name}, ${user3.name}`);

  // 3. 샘플 프로젝트 생성 (Home.vue 데이터 기반)
  console.log('Creating sample projects...');
  const project1 = await prisma.project.create({
    data: {
      title: "AI 챗봇 개발 프로젝트",
      description: "고객 서비스용 AI 챗봇을 개발하는 프로젝트입니다. 자연어 처리 기술을 활용하여 사용자의 질문에 실시간으로 답변하는 시스템을 구축합니다.",
      techStack: ["Python", "OpenAI", "FastAPI", "React"],
      members: "3/5명",
      deadline: new Date("2024-12-31"),
      ownerId: user1.id, // 김개발이 프로젝트 오너
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: "모바일 앱 개발",
      description: "위치 기반 소셜 네트워킹 앱을 개발합니다. 실시간 채팅, 친구 추가, 장소 공유 등의 기능을 포함합니다.",
      techStack: ["React Native", "Node.js", "MongoDB"],
      members: "2/4명",
      deadline: new Date("2025-01-15"),
      ownerId: user2.id, // 이코딩이 프로젝트 오너
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: "블록체인 NFT 마켓플레이스",
      description: "NFT 거래를 위한 블록체인 기반 마켓플레이스 개발. 스마트 컨트랙트를 이용하여 안전한 거래를 보장합니다.",
      techStack: ["Solidity", "Web3.js", "Next.js"],
      members: "1/6명",
      deadline: new Date("2025-02-28"),
      ownerId: user1.id, // 김개발이 프로젝트 오너
    },
  });

  console.log(`Created projects: ${project1.title}, ${project2.title}, ${project3.title}`);

  // 4. 샘플 지원 데이터 생성
  console.log('Creating sample applications...');
  // 이코딩(user2)이 AI 챗봇 프로젝트(project1)에 지원
  await prisma.application.create({
    data: {
      userId: user2.id,
      projectId: project1.id,
    },
  });

  // 박서버(user3)가 AI 챗봇 프로젝트(project1)에 지원
  await prisma.application.create({
    data: {
      userId: user3.id,
      projectId: project1.id,
    },
  });

  // 김개발(user1)이 모바일 앱 프로젝트(project2)에 지원
  await prisma.application.create({
    data: {
      userId: user1.id,
      projectId: project2.id,
    },
  });
  
  console.log('Created 3 sample applications.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
