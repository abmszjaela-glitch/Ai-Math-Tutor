require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const grades = [
    {
      number: 1,
      name: "Grade 1",
    },
    {
      number: 2,
      name: "Grade 2",
    },
    {
      number: 3,
      name: "Grade 3",
    },
    {
      number: 4,
      name: "Grade 4",
    },
    {
      number: 5,
      name: "Grade 5",
    },
    {
      number: 6,
      name: "Grade 6",
    },
  ];

  for (const grade of grades) {
    await prisma.grade.upsert({
      where: {
        number: grade.number,
      },
      update: {
        name: grade.name,
      },
      create: grade,
    });
  }

  console.log("Grades seeded successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });