-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE "TechnicianAvailability" (
    "id" TEXT NOT NULL,
    "slotDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isSlotActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "TechnicianAvailability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TechnicianAvailability" ADD CONSTRAINT "TechnicianAvailability_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
