import { prisma } from "../src/lib/prisma";

async function seed() {
  await prisma.user.create({
    data: {
      email: "andre@email.com",
      userTag: "andre",
      password: "123",
    },
  });
}

seed().then(() => {
  console.log("Database seeded!");
});
