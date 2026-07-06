import app from "./app";
import config from "./config";
const PORT = config.port;
async function main() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running is on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error Starting the Server", error);
    process.exit(1);
  }
}

main();
