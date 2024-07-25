/*
  Warnings:

  - You are about to drop the column `users` on the `Goals` table. All the data in the column will be lost.
  - You are about to drop the column `goals` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goals" DROP COLUMN "users";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "goals";

-- CreateTable
CREATE TABLE "_GoalsToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GoalsToUser_AB_unique" ON "_GoalsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_GoalsToUser_B_index" ON "_GoalsToUser"("B");

-- AddForeignKey
ALTER TABLE "_GoalsToUser" ADD CONSTRAINT "_GoalsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalsToUser" ADD CONSTRAINT "_GoalsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
