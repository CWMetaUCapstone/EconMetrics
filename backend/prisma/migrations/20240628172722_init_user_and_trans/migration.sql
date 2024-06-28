-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "roommates" INTEGER NOT NULL,
    "children" INTEGER NOT NULL,
    "job" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rent" DOUBLE PRECISION NOT NULL,
    "utilities" DOUBLE PRECISION NOT NULL,
    "housing" DOUBLE PRECISION NOT NULL,
    "loans" DOUBLE PRECISION NOT NULL,
    "student_loans" DOUBLE PRECISION NOT NULL,
    "car_loans_and_lease" DOUBLE PRECISION NOT NULL,
    "credit_card_payments" DOUBLE PRECISION NOT NULL,
    "other_loans" DOUBLE PRECISION NOT NULL,
    "entertainment" DOUBLE PRECISION NOT NULL,
    "streaming_services" DOUBLE PRECISION NOT NULL,
    "other_entertainment" DOUBLE PRECISION NOT NULL,
    "food" DOUBLE PRECISION NOT NULL,
    "resturants" DOUBLE PRECISION NOT NULL,
    "groceries" DOUBLE PRECISION NOT NULL,
    "medical_care" DOUBLE PRECISION NOT NULL,
    "transportation" DOUBLE PRECISION NOT NULL,
    "gas" DOUBLE PRECISION NOT NULL,
    "parking" DOUBLE PRECISION NOT NULL,
    "ride_share" DOUBLE PRECISION NOT NULL,
    "public_transit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
