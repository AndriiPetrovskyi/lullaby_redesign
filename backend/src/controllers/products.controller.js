import { prisma } from "../db/prisma.js";
import { buildImageUrl } from "../utils/imageUrl.js";

const withImageUrl = (product) => ({
  ...product,
  image_url: buildImageUrl(product.imageKey) ?? product.image_url,
});

export const listActiveProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { is_active: true },
    });

    res.json(products.map(withImageUrl));
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findFirst({
      where: { slug, is_active: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Продукт не знайдено" });
    }

    res.json(withImageUrl(product));
  } catch (error) {
    next(error);
  }
};
