export const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  app: {
    name: "Tandem API",
    version: "1.0.0",
  },
  cors: {
    origin: "http://localhost:3000",
  },
};
