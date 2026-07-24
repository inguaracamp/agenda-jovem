import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.church.deleteMany();

  const passwordHash = await hash("natanael09", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "naelgoncalves478@live.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Seed OK — banco limpo, só o admin.");
  console.log("Admin: naelgoncalves478@live.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
