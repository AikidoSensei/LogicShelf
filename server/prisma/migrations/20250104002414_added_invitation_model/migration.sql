-- CreateTable
CREATE TABLE "Invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invitations_email_key" ON "Invitations"("email");

-- CreateIndex
CREATE INDEX "Invitations_email_organizationId_idx" ON "Invitations"("email", "organizationId");

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;
