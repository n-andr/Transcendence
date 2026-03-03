-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friends" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
