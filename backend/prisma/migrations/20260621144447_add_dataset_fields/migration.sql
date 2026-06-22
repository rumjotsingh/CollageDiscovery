-- AlterTable
ALTER TABLE "colleges" ADD COLUMN     "academicScore" DOUBLE PRECISION,
ADD COLUMN     "accommodationScore" DOUBLE PRECISION,
ADD COLUMN     "facultyScore" DOUBLE PRECISION,
ADD COLUMN     "infrastructureScore" DOUBLE PRECISION,
ADD COLUMN     "pgFees" INTEGER,
ADD COLUMN     "placementScore" DOUBLE PRECISION,
ADD COLUMN     "socialLifeScore" DOUBLE PRECISION,
ALTER COLUMN "establishedYear" DROP NOT NULL;
