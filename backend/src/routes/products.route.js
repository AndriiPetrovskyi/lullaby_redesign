import { Router } from "express";
import {
  listActiveProducts,
  getProductBySlug,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", listActiveProducts);
router.get("/:slug", getProductBySlug);

export default router;
