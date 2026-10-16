require("dotenv").config();
for (const name of ["DATABASE_URL", "JWT_SECRET"]) {
  if (!process.env[name]) throw new Error(`${name} is required. See .env.example.`);
}
if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must have at least 32 characters");
const app = require("./app");
const prisma = require("./config/prisma");
const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  const timer = setTimeout(() => process.exit(1), 10000);
  timer.unref();
  server.close(async () => {
    await prisma.$disconnect();
    clearTimeout(timer);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
