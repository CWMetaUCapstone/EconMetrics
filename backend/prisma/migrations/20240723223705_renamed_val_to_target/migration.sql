/*
  Warnings:

  - You are about to drop the column `deadline` on the `Goals` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Goals` table. All the data in the column will be lost.
  - Added the required column `target` to the `Goals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goals" DROP COLUMN "deadline",
DROP COLUMN "value",
ADD COLUMN     "target" INTEGER NOT NULL;
