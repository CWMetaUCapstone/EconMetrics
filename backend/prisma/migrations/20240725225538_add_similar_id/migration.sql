/*
  Warnings:

  - A unique constraint covering the columns `[similarId]` on the table `SimilarUsers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `similarId` to the `SimilarUsers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SimilarUsers" ADD COLUMN     "similarId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SimilarUsers_similarId_key" ON "SimilarUsers"("similarId");
