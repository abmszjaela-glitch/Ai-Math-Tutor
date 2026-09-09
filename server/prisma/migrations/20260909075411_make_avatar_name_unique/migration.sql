/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Avatar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Avatar_name_key" ON "Avatar"("name");
