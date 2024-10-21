import "reflect-metadata";

import express from "express";

import { configureRoutes } from "./Routes/ApiRoutes";
import { configureContainer } from "./Container";

const app = express();
const PORT = process.env.PORT || 3000;

const container = configureContainer();

// Middleware
app.use(express.json());

// Routes
app.use("/api", configureRoutes(container));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
