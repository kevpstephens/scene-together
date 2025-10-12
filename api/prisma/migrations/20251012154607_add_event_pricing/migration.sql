-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "price" INTEGER,
ADD COLUMN     "payWhatYouCan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "minPrice" INTEGER;

