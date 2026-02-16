/*
  Warnings:

  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chef` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Experience` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Booking";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Chef";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Experience";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "type" TEXT NOT NULL,
    "personType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT,
    "cnpj" TEXT,
    "razaoSocial" TEXT,
    "nomeFantasia" TEXT,
    "cep" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLoginAt" DATETIME
);

-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalEvents" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "ClientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfessionalProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "slogan" TEXT,
    "description" TEXT NOT NULL,
    "experience" TEXT,
    "differentials" TEXT,
    "eventTypes" TEXT NOT NULL,
    "cuisineStyles" TEXT NOT NULL,
    "serviceTypes" TEXT NOT NULL,
    "priceRanges" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "hasWaiter" BOOLEAN NOT NULL DEFAULT false,
    "hasSoftDrinks" BOOLEAN NOT NULL DEFAULT false,
    "hasAlcoholicDrinks" BOOLEAN NOT NULL DEFAULT false,
    "hasDecoration" BOOLEAN NOT NULL DEFAULT false,
    "hasRental" BOOLEAN NOT NULL DEFAULT false,
    "hasSoundLight" BOOLEAN NOT NULL DEFAULT false,
    "hasPhotographer" BOOLEAN NOT NULL DEFAULT false,
    "hasBartender" BOOLEAN NOT NULL DEFAULT false,
    "hasSweets" BOOLEAN NOT NULL DEFAULT false,
    "hasCake" BOOLEAN NOT NULL DEFAULT false,
    "hasPlatesCutlery" BOOLEAN NOT NULL DEFAULT false,
    "serviceRadiusKm" INTEGER NOT NULL DEFAULT 50,
    "subscriptionPlan" TEXT NOT NULL DEFAULT 'FREE',
    "subscriptionExpiresAt" DATETIME,
    "rating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "totalEvents" INTEGER NOT NULL DEFAULT 0,
    "totalEarned" REAL NOT NULL DEFAULT 0,
    "availabilityJson" TEXT,
    CONSTRAINT "ProfessionalProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "professionalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" REAL NOT NULL,
    "minPeople" INTEGER NOT NULL,
    "maxPeople" INTEGER NOT NULL,
    "includes" TEXT NOT NULL,
    "menuFileUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Package_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "ProfessionalProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PortfolioImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "professionalId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PortfolioImage_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "ProfessionalProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" TEXT,
    "duration" TEXT,
    "billingType" TEXT NOT NULL,
    "locationType" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "hasKitchen" BOOLEAN NOT NULL DEFAULT false,
    "latitude" REAL,
    "longitude" REAL,
    "guestCount" INTEGER NOT NULL,
    "searchRadiusKm" INTEGER NOT NULL DEFAULT 50,
    "cuisineStyles" TEXT NOT NULL,
    "serviceTypes" TEXT NOT NULL,
    "needsWaiter" BOOLEAN NOT NULL DEFAULT false,
    "needsSoftDrinks" BOOLEAN NOT NULL DEFAULT false,
    "needsAlcoholicDrinks" BOOLEAN NOT NULL DEFAULT false,
    "needsDecoration" BOOLEAN NOT NULL DEFAULT false,
    "needsSoundLight" BOOLEAN NOT NULL DEFAULT false,
    "needsPhotographer" BOOLEAN NOT NULL DEFAULT false,
    "needsBartender" BOOLEAN NOT NULL DEFAULT false,
    "needsSweets" BOOLEAN NOT NULL DEFAULT false,
    "needsCake" BOOLEAN NOT NULL DEFAULT false,
    "needsPlatesCutlery" BOOLEAN NOT NULL DEFAULT false,
    "priceRange" TEXT NOT NULL,
    "maxBudget" REAL,
    "description" TEXT,
    "dietaryRestrictions" TEXT,
    "referenceImages" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    "hiredProposalId" TEXT,
    CONSTRAINT "Event_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Event_hiredProposalId_fkey" FOREIGN KEY ("hiredProposalId") REFERENCES "Proposal" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "totalPrice" REAL NOT NULL,
    "pricePerPerson" REAL,
    "message" TEXT,
    "attachmentUrl" TEXT,
    "packageId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" DATETIME,
    "expiresAt" DATETIME,
    CONSTRAINT "Proposal_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Proposal_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "ProfessionalProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reviewerId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "foodQuality" INTEGER NOT NULL,
    "serviceQuality" INTEGER NOT NULL,
    "punctuality" INTEGER NOT NULL,
    "communication" INTEGER NOT NULL,
    "valueForMoney" INTEGER NOT NULL,
    "overall" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "response" TEXT,
    "respondedAt" DATETIME,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "ProfessionalProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "eventId" TEXT,
    "proposalId" TEXT,
    "content" TEXT NOT NULL,
    "attachments" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" TEXT,
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "professionalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institution" TEXT,
    "year" INTEGER,
    "fileUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Certification_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "ProfessionalProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_city_state_idx" ON "User"("city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_userId_key" ON "ClientProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalProfile_userId_key" ON "ProfessionalProfile"("userId");

-- CreateIndex
CREATE INDEX "ProfessionalProfile_subscriptionPlan_idx" ON "ProfessionalProfile"("subscriptionPlan");

-- CreateIndex
CREATE INDEX "ProfessionalProfile_rating_idx" ON "ProfessionalProfile"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "Event_hiredProposalId_key" ON "Event"("hiredProposalId");

-- CreateIndex
CREATE INDEX "Event_clientId_idx" ON "Event"("clientId");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Proposal_professionalId_idx" ON "Proposal"("professionalId");

-- CreateIndex
CREATE INDEX "Proposal_status_idx" ON "Proposal"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_eventId_professionalId_key" ON "Proposal"("eventId", "professionalId");

-- CreateIndex
CREATE INDEX "Review_professionalId_idx" ON "Review"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewerId_eventId_key" ON "Review"("reviewerId", "eventId");

-- CreateIndex
CREATE INDEX "Message_senderId_receiverId_idx" ON "Message"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Message_eventId_idx" ON "Message"("eventId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_refreshToken_idx" ON "Session"("refreshToken");
