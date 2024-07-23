-- CreateTable
CREATE TABLE "Goals" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);

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
