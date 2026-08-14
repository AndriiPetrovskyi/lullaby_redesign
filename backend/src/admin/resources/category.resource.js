export const buildCategoryResource = (categoryModel, prisma) => ({
  resource: { model: categoryModel, client: prisma },
});
