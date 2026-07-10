/*
  Warnings:

  - You are about to drop the column `bookingId` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingTimeId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingTimeId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_bookingId_fkey";

-- DropIndex
DROP INDEX "Booking_bookingId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingId",
ADD COLUMN     "bookingTimeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingTimeId_key" ON "Booking"("bookingTimeId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_bookingTimeId_fkey" FOREIGN KEY ("bookingTimeId") REFERENCES "TechnicianAvailability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
