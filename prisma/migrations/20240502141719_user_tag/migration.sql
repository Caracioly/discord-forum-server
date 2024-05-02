/*
  Warnings:

  - You are about to drop the column `user` on the `users` table. All the data in the column will be lost.
  - Added the required column `user_tag` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "user_tag" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "profile_pic_url" TEXT
);
INSERT INTO "new_users" ("createdAt", "email", "id", "password", "profile_pic_url") SELECT "createdAt", "email", "id", "password", "profile_pic_url" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_user_tag_key" ON "users"("user_tag");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
