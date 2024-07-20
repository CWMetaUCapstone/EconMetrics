/*
  Warnings:

  - The `transaction_date` column on the `Transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "transaction_date",
ADD COLUMN     "transaction_date" INTEGER;
