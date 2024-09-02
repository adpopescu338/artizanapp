/*
  Warnings:

  - Changed the type of `name` on the `SetupStep` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SetupStep" DROP COLUMN "name",
ADD COLUMN     "name" "SetupStepName" NOT NULL;
