/*
  Warnings:

  - Added the required column `birth_date` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "user_tag" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profile_pic_url" TEXT
);
INSERT INTO "new_users" ("created_at", "email", "id", "password", "profile_pic_url", "user_tag") SELECT "created_at", "email", "id", "password", "profile_pic_url", "user_tag" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_user_tag_key" ON "users"("user_tag");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
