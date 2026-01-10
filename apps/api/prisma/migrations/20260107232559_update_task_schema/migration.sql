/*
  Warnings:

  - You are about to drop the column `branchName` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `prNumber` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `prStatus` on the `task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "PrStatus" AS ENUM ('open', 'merged', 'closed');

-- AlterTable
ALTER TABLE "task" DROP COLUMN "branchName",
DROP COLUMN "prNumber",
DROP COLUMN "prStatus",
ADD COLUMN     "githubBranch" TEXT,
ADD COLUMN     "githubPrId" INTEGER,
ADD COLUMN     "githubPrStatus" "PrStatus",
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'medium',
ADD COLUMN     "tags" TEXT[];
