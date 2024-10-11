import "reflect-metadata";

import express from "express";

import apiRoutes from "./Routes/ApiRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
