-- AlterTable
ALTER TABLE "SellerProfile" ADD COLUMN     "provisionalCreatingUserId" TEXT;

-- AddForeignKey
ALTER TABLE "SellerProfile" ADD CONSTRAINT "SellerProfile_provisionalCreatingUserId_fkey" FOREIGN KEY ("provisionalCreatingUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
