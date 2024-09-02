/*
  Warnings:

  - You are about to drop the column `sellerProfileWhereCoverImageId` on the `ImageFile` table. All the data in the column will be lost.
  - You are about to drop the column `address1` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `address2` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `locality` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `Location` table. All the data in the column will be lost.
  - Added the required column `formattedAddress` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImageFile" DROP CONSTRAINT "ImageFile_sellerProfileWhereCoverImageId_fkey";

-- DropIndex
DROP INDEX "ImageFile_sellerProfileWhereCoverImageId_key";

-- AlterTable
ALTER TABLE "ImageFile" DROP COLUMN "sellerProfileWhereCoverImageId";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "address1",
DROP COLUMN "address2",
DROP COLUMN "district",
DROP COLUMN "locality",
DROP COLUMN "zip",
ADD COLUMN     "formattedAddress" TEXT NOT NULL;
