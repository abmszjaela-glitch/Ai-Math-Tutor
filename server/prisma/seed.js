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
  // =========================
  // GRADES
  // =========================

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


  // =========================
  // AVATARS
  // =========================

  const avatars = [
    {
      name: "Panda",
      personality:
        "Friendly, patient, calm and encouraging. Explains maths step by step.",
      imageUrl: null,
      voiceId: null,
    },
    {
      name: "Kangaroo",
      personality:
        "Energetic, playful and motivating. Encourages students to keep trying.",
      imageUrl: null,
      voiceId: null,
    },
    {
      name: "Koala",
      personality:
        "Gentle, thoughtful and reassuring. Helps students learn at a comfortable pace.",
      imageUrl: null,
      voiceId: null,
    },
  ];

  for (const avatar of avatars) {
    await prisma.avatar.upsert({
      where: {
        name: avatar.name,
      },
      update: {
        personality: avatar.personality,
        imageUrl: avatar.imageUrl,
        voiceId: avatar.voiceId,
      },
      create: avatar,
    });
  }

  console.log("Avatars seeded successfully");


  // =========================
  // CURRICULUM
  // =========================

  const curriculum = {
    1: {
      Algebra: [
        "Number Patterns",
        "Missing Numbers",
        "Simple Number Sentences",
      ],
      Measurement: [
        "Length",
        "Time",
        "Money",
      ],
      "Problem Solving": [
        "Simple Word Problems",
        "Logical Thinking",
      ],
      Statistics: [
        "Sorting Objects",
        "Simple Tables",
        "Pictographs",
      ],
    },

    2: {
      Algebra: [
        "Number Patterns",
        "Addition and Subtraction Sentences",
        "Missing Numbers",
      ],
      Measurement: [
        "Length",
        "Mass",
        "Time",
        "Money",
      ],
      "Problem Solving": [
        "Word Problems",
        "Problem Solving Strategies",
      ],
      Statistics: [
        "Collecting Data",
        "Tables",
        "Pictographs",
      ],
    },

    3: {
      Algebra: [
        "Number Patterns",
        "Unknown Numbers",
        "Simple Expressions",
      ],
      Measurement: [
        "Length",
        "Mass",
        "Capacity",
        "Time",
      ],
      "Problem Solving": [
        "Multi-Step Word Problems",
        "Logical Reasoning",
      ],
      Statistics: [
        "Data Collection",
        "Tables",
        "Bar Charts",
      ],
    },

    4: {
      Algebra: [
        "Number Patterns",
        "Variables",
        "Simple Expressions",
        "Equations",
      ],
      Measurement: [
        "Length",
        "Area",
        "Perimeter",
        "Time",
        "Money",
      ],
      "Problem Solving": [
        "Word Problems",
        "Multi-Step Problems",
        "Logical Reasoning",
      ],
      Statistics: [
        "Data Collection",
        "Tables",
        "Bar Graphs",
        "Interpreting Data",
      ],
    },

    5: {
      Algebra: [
        "Patterns and Sequences",
        "Expressions",
        "Equations",
        "Variables",
      ],
      Measurement: [
        "Area",
        "Perimeter",
        "Volume",
        "Time",
        "Unit Conversion",
      ],
      "Problem Solving": [
        "Multi-Step Problems",
        "Fractions in Problems",
        "Logical Reasoning",
      ],
      Statistics: [
        "Data Collection",
        "Bar Graphs",
        "Line Graphs",
        "Interpreting Data",
      ],
    },

    6: {
      Algebra: [
        "Patterns and Sequences",
        "Algebraic Expressions",
        "Equations",
        "Variables",
      ],
      Measurement: [
        "Area",
        "Perimeter",
        "Volume",
        "Unit Conversion",
        "Time and Distance",
      ],
      "Problem Solving": [
        "Complex Word Problems",
        "Multi-Step Problems",
        "Logical Reasoning",
      ],
      Statistics: [
        "Data Collection",
        "Bar Graphs",
        "Line Graphs",
        "Data Interpretation",
      ],
    },
  };


  // =========================
  // CREATE TOPICS + LESSONS
  // =========================

  for (const [gradeNumber, topics] of Object.entries(curriculum)) {
    const grade = await prisma.grade.findUnique({
      where: {
        number: Number(gradeNumber),
      },
    });

    if (!grade) {
      continue;
    }

    for (const [topicName, lessons] of Object.entries(topics)) {
      const topic = await prisma.topic.upsert({
        where: {
          id: `${grade.id}-${topicName}`,
        },
        update: {
          name: topicName,
          description: `${topicName} lessons for ${grade.name}`,
        },
        create: {
          id: `${grade.id}-${topicName}`,
          name: topicName,
          description: `${topicName} lessons for ${grade.name}`,
          gradeId: grade.id,
        },
      });

      for (let i = 0; i < lessons.length; i++) {
        await prisma.lesson.upsert({
          where: {
            id: `${topic.id}-lesson-${i + 1}`,
          },
          update: {
            title: lessons[i],
            description: `${lessons[i]} lesson for ${grade.name}`,
            order: i + 1,
          },
          create: {
            id: `${topic.id}-lesson-${i + 1}`,
            title: lessons[i],
            description: `${lessons[i]} lesson for ${grade.name}`,
            order: i + 1,
            topicId: topic.id,
          },
        });
      }
    }
  }

  console.log("Curriculum seeded successfully");
}


// =========================
// RUN SEED
// =========================

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });