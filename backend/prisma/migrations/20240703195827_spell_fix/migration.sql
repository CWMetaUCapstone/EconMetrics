/*
  Warnings:

  - You are about to drop the column `resturants` on the `Transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "resturants",
ADD COLUMN     "restaurants" DECIMAL(13,2);
