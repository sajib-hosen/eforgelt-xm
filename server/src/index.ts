import mongoose from "mongoose";
import app from "./app";
import config from "./config";

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("✅✅ Database is connected successfully 👍👍");

    app.listen(config.port, () => {
      console.log(
        `🚀🚀~~ Blood bank app is listening on port ${config.port} ~~🚀🚀`
      );
    });
  } catch (err) {
    console.log("Failed to connect database", err);
  }
}

main();
