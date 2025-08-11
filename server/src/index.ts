import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import environment from "./config";

async function main() {
  try {
    await mongoose.connect(environment.db_url as string);
    console.log("Database is connected successfully");

    app.listen(environment.port, () => {
      console.log(`App started`);
    });
  } catch (err) {
    console.log("Failed to connect database", err);
  }
}

main();
