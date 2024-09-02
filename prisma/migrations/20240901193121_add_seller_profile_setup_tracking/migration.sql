-- CreateEnum
CREATE TYPE "SetupStepName" AS ENUM ('BASIC_INFO', 'CONTACT_DETAILS', 'PROFILE_IMAGE', 'PRODUCTS');

-- CreateTable
CREATE TABLE "SetupStep" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "skippable" BOOLEAN NOT NULL DEFAULT false,
    "skippedAt" TIMESTAMP(3),
    "sellerProfileId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SetupStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SetupStep" ADD CONSTRAINT "SetupStep_sellerProfileId_fkey" FOREIGN KEY ("sellerProfileId") REFERENCES "SellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
