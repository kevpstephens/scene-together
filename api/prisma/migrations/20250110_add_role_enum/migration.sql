-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- AlterTable: Add temporary column
ALTER TABLE "User" ADD COLUMN "role_new" "Role" NOT NULL DEFAULT 'USER';

-- Migrate existing data
UPDATE "User" 
SET "role_new" = CASE 
  WHEN "role" = 'staff' THEN 'ADMIN'::"Role"
  WHEN "role" = 'member' THEN 'USER'::"Role"
  ELSE 'USER'::"Role"
END;

-- Drop old column and rename new one
ALTER TABLE "User" DROP COLUMN "role";
ALTER TABLE "User" RENAME COLUMN "role_new" TO "role";

