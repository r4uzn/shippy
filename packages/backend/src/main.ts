import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Users
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { email, name, mbti, skills } = req.body;
  const user = await prisma.user.create({
    data: { email, name, mbti, skills },
  });
  res.json(user);
});

// Projects
app.get("/projects", async (req, res) => {
  const projects = await prisma.project.findMany({ include: { owner: true } });
  res.json(projects);
});

app.post("/projects", async (req, res) => {
  const { title, description, techStack, ownerId } = req.body;
  const project = await prisma.project.create({
    data: { title, description, techStack, ownerId },
  });
  res.json(project);
});

// Applications
app.get("/applications", async (req, res) => {
  const apps = await prisma.application.findMany({ include: { user: true, project: true } });
  res.json(apps);
});

app.post("/applications", async (req, res) => {
  const { userId, projectId } = req.body;
  const appData = await prisma.application.create({
    data: { userId, projectId },
  });
  res.json(appData);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
