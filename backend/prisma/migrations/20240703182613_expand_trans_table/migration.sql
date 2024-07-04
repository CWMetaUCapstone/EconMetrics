/*
  Warnings:

  - You are about to alter the column `rent` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `utilities` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `housing` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `loans` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `student_loans` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `car_loans_and_lease` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `credit_card_payments` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `other_loans` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `entertainment` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `streaming_services` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `other_entertainment` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `food` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `resturants` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `groceries` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `medical_care` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `transportation` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `gas` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `parking` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `ride_share` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.
  - You are about to alter the column `public_transit` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,2)`.

*/
-- AlterTable
ALTER TABLE "Transactions" ADD COLUMN     "apparel" DECIMAL(13,2),
ADD COLUMN     "e_commerce" DECIMAL(13,2),
ADD COLUMN     "electronics" DECIMAL(13,2),
ADD COLUMN     "financial_planning" DECIMAL(13,2),
ADD COLUMN     "gym_membership" DECIMAL(13,2),
ADD COLUMN     "insurance" DECIMAL(13,2),
ADD COLUMN     "investment" DECIMAL(13,2),
ADD COLUMN     "investment_and_saving" DECIMAL(13,2),
ADD COLUMN     "legal_services" DECIMAL(13,2),
ADD COLUMN     "merchandise" DECIMAL(13,2),
ADD COLUMN     "other_expenses" DECIMAL(13,2),
ADD COLUMN     "other_merchandise" DECIMAL(13,2),
ADD COLUMN     "other_transportation" DECIMAL(13,2),
ADD COLUMN     "pet_supplies" DECIMAL(13,2),
ADD COLUMN     "retail" DECIMAL(13,2),
ADD COLUMN     "savings_account" DECIMAL(13,2),
ADD COLUMN     "super_stores" DECIMAL(13,2),
ADD COLUMN     "tax_payments" DECIMAL(13,2),
ADD COLUMN     "travel" DECIMAL(13,2),
ALTER COLUMN "rent" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "utilities" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "housing" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "loans" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "student_loans" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "car_loans_and_lease" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "credit_card_payments" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "other_loans" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "entertainment" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "streaming_services" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "other_entertainment" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "food" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "resturants" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "groceries" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "medical_care" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "transportation" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "gas" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "parking" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "ride_share" SET DATA TYPE DECIMAL(13,2),
ALTER COLUMN "public_transit" SET DATA TYPE DECIMAL(13,2);
