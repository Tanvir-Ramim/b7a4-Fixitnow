/*
  Warnings:

  - The `technicianAccept` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TechnicianEnum" AS ENUM ('CANCEL', 'INPROGRESS', 'ACCPECT');

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "technicianAccept",
ADD COLUMN     "technicianAccept" "TechnicianEnum" NOT NULL DEFAULT 'INPROGRESS';
