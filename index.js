import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import authRouter from "./src/routes/AuthR/authRouter.js";
import featuredCategoriesRouter from "./src/routes/feature-categories-R/featured-category-router.js";
import featureSubCategoriesRouter from "./src/routes/feature-categories-R/featured-sub-categories-router.js";
import blogRouter from "./src/routes/Blog-R/blog-roluter.js";
import homeRouter from "./src/routes/Home-R/common-router.js";
import serviceRouter from "./src/routes/Service-R/service-router.js";
import taskCategoryRouter from "./src/routes/Task-R/task-category/task-category-router.js";
import taskSubcategoryRouter from "./src/routes/Task-R/Task-subCategory/task-subcategoryrouter.js";
import portfolioRouter from "./src/routes/Portfolio-R/portfolioRouter.js";

import cors from "cors"; 
import morgan from "morgan"; 
import projectRouter from "./src/routes/Project-R/projectRouter.js";
import depositRouter from "./src/routes/Deposit-R/depositRouter.js";


dotenv.config();

const app = express();

connectDb();

app.use(express.json());
app.use(cors()); 
app.use(morgan('dev')); 


app.use("/api/v1", authRouter);
app.use("/api/v1", featuredCategoriesRouter);
app.use("/api/v1", featureSubCategoriesRouter);
app.use("/api/v1", blogRouter);
app.use("/api/v1", homeRouter);
app.use("/api/v1", serviceRouter);
app.use("/api/v1", taskCategoryRouter)
app.use("/api/v1", taskSubcategoryRouter)
app.use("/api/v1", portfolioRouter)
app.use("/api/v1", projectRouter)
app.use("/api/v1", depositRouter)


app.use("/", express.static("public/upload"));

const port = process.env.PORT || 5000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});

process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  process.exit();
});
