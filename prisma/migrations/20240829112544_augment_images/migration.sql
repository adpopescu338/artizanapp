/*
  Warnings:

  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `SellerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `SellerProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "images";

-- AlterTable
ALTER TABLE "SellerProfile" DROP COLUMN "coverImage",
DROP COLUMN "profileImage";

-- CreateTable
CREATE TABLE "ImageFile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "sellerProfileWhereProfileImageId" TEXT,
    "sellerProfileWhereCoverImageId" TEXT,
    "productWhereProductImageId" TEXT,

    CONSTRAINT "ImageFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_sellerProfileWhereProfileImageId_key" ON "ImageFile"("sellerProfileWhereProfileImageId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_sellerProfileWhereCoverImageId_key" ON "ImageFile"("sellerProfileWhereCoverImageId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_productWhereProductImageId_key" ON "ImageFile"("productWhereProductImageId");

-- AddForeignKey
ALTER TABLE "ImageFile" ADD CONSTRAINT "ImageFile_sellerProfileWhereProfileImageId_fkey" FOREIGN KEY ("sellerProfileWhereProfileImageId") REFERENCES "SellerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageFile" ADD CONSTRAINT "ImageFile_sellerProfileWhereCoverImageId_fkey" FOREIGN KEY ("sellerProfileWhereCoverImageId") REFERENCES "SellerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageFile" ADD CONSTRAINT "ImageFile_productWhereProductImageId_fkey" FOREIGN KEY ("productWhereProductImageId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
