-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "technicalSkills" TEXT[] DEFAULT ARRAY[]::TEXT[];
