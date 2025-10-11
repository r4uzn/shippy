-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "positions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "progressMethod" TEXT;
