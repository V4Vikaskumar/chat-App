/*
  Warnings:

  - You are about to drop the column `deliverd` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "deliverd",
ADD COLUMN     "delivered" BOOLEAN NOT NULL DEFAULT false;
