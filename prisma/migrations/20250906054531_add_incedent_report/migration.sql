-- CreateEnum
CREATE TYPE "public"."Situation" AS ENUM ('Low', 'Medium', 'High', 'Crtical');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('Complete', 'Submitted');

-- CreateTable
CREATE TABLE "public"."IncidentReport" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "incidentTitle" TEXT NOT NULL,
    "procedure" TEXT,
    "severity" TEXT,
    "patientAge" INTEGER,
    "patientSex" TEXT,
    "descriptionOfIncident" TEXT NOT NULL,
    "situation" "public"."Situation" NOT NULL,
    "actionsTaken" TEXT NOT NULL,
    "outcome" TEXT NOT NULL,
    "lessonsLearned" TEXT NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."Status" NOT NULL DEFAULT 'Submitted',

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);
