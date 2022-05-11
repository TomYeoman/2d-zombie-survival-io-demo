import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
  logger.debug("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
} else {
  logger.debug("Using .env.example file to supply config environment variables");
  dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
export const PORT = process.env.PORT;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

// Logger
logger.info("ENV = ", ENVIRONMENT);
if (!ENVIRONMENT) {
  logger.error("Define an environment to run under ( I.E dev, test, prod )");
  // process.exit(1);
}

// DB
export const MYSQL_URI = prod ? process.env["MYSQL_URI_PROD"] : process.env["MYSQL_URI_DEV"];
if (!MYSQL_URI) {
  if (prod) {
    logger.error("No MYSQL connection string. Make sure MYSQL_DB_URI variable is set.");
  } else {
    logger.error("No MYSQL connection string. Set MYSQL_DB_URI_DEV environment variable.");
  }
  // process.exit(1);
}
