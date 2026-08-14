import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Привіт! Бекенд працює 🕯️");
});

export default router;
