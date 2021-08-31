import winston from "winston";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: "verbose" }),
    new winston.transports.File({ filename: "warn.log", level: "warn" }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

export { logger };
