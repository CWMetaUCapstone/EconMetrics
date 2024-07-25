/*
  Warnings:

  - You are about to drop the `_GoalsToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GoalsToUser" DROP CONSTRAINT "_GoalsToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GoalsToUser" DROP CONSTRAINT "_GoalsToUser_B_fkey";

-- AlterTable
ALTER TABLE "Goals" ADD COLUMN     "users" INTEGER[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "goals" INTEGER[];

-- DropTable
DROP TABLE "_GoalsToUser";
