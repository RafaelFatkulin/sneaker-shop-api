/*
  Warnings:

  - You are about to drop the `refresh_token` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hashedRefreshToken" TEXT;

-- DropTable
DROP TABLE "refresh_token";
