import app from "./app";
import config from "./config";
import { prisma } from "./lib/primsa";
const PORT = config.port;
async function main() {
  try {
     await prisma.$connect()
     console.log("connect to the database successfully")
    app.listen(PORT, () => {
      console.log(`Server is running is on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error Starting the Server", error);
    await prisma.$disconnect()
    process.exit(1);
  }
}

main();
