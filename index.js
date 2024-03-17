import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./db/connectDb.js";
import cors from "cors";

const app = express();

dotenv.config();

// using middlewares
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

// importing routes
import userRoutes from "./routes/user.js";
import blogRoutes from "./routes/blog.js";

// using routes
app.use("/api", userRoutes);
app.use("/api", blogRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
