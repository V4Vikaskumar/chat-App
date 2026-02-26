/*
  Warnings:

  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "deliverd" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receiverId" UUID NOT NULL;
