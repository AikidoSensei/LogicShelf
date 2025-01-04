/*
  Warnings:

  - The `resetPasswordExpiresAt` column on the `UserAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `verificationTokenExpiresAt` column on the `UserAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserAccount" DROP COLUMN "resetPasswordExpiresAt",
ADD COLUMN     "resetPasswordExpiresAt" TIMESTAMP(3),
DROP COLUMN "verificationTokenExpiresAt",
ADD COLUMN     "verificationTokenExpiresAt" TIMESTAMP(3);
