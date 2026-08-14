import express from "express";
import cors from "cors";
import AdminJSExpress from "@adminjs/express";
import { buildAdmin } from "./admin/index.js";
import indexRoute from "./routes/index.route.js";
import productsRoute from "./routes/products.route.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static("public/uploads"));

  const admin = buildAdmin();
  const adminRouter = AdminJSExpress.buildRouter(admin);
  app.use(admin.options.rootPath, adminRouter);

  app.use("/", indexRoute);
  app.use("/api/products", productsRoute);

  app.use(errorHandler);

  return app;
};
