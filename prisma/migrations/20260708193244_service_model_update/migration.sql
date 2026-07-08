/*
  Warnings:

  - You are about to alter the column `price` on the `Services` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `name` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Services" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE INTEGER;
