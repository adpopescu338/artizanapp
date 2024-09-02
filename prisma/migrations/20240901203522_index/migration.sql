/*
  Warnings:

  - A unique constraint covering the columns `[sellerProfileId,name]` on the table `SetupStep` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "sellerProfileId_name_idx" ON "SetupStep"("sellerProfileId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SetupStep_sellerProfileId_name_key" ON "SetupStep"("sellerProfileId", "name");
