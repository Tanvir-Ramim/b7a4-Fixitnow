/*
  Warnings:

  - You are about to drop the column `bookingDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingDate",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "bookingId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_bookingId_key" ON "Booking"("bookingId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "TechnicianAvailability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
