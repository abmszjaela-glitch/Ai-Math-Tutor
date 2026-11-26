ALTER TABLE "Conversation"
ADD COLUMN "avatarId" TEXT;

CREATE TABLE "AvatarSelection" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "selectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvatarSelection_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AvatarSelection_studentId_selectedAt_idx"
ON "AvatarSelection"("studentId", "selectedAt");

ALTER TABLE "Conversation"
ADD CONSTRAINT "Conversation_avatarId_fkey"
FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AvatarSelection"
ADD CONSTRAINT "AvatarSelection_studentId_fkey"
FOREIGN KEY ("studentId") REFERENCES "Student"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AvatarSelection"
ADD CONSTRAINT "AvatarSelection_avatarId_fkey"
FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
