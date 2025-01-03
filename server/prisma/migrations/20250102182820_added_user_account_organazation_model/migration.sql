/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ExpenseSummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PurchaseSummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Sales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SalesSummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpenseSummary" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Expenses" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PurchaseSummary" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Purchases" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sales" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SalesSummary" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "role" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Organizations" (
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Organizations_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "resetPasswordToken" TEXT NOT NULL,
    "resetPasswordExpiresAt" TEXT NOT NULL,
    "verificationToken" TEXT NOT NULL,
    "verificationTokenExpiresAt" TEXT NOT NULL,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_name_key" ON "Organizations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_email_key" ON "UserAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("organizationId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccount" ADD CONSTRAINT "UserAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchases" ADD CONSTRAINT "Purchases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
