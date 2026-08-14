import AdminJS, { ComponentLoader } from "adminjs";
import { Database, Resource } from "@adminjs/prisma";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma.js";
import { fixDmmfIds } from "./fixDmmfIds.js";
import { buildCategoryResource } from "./resources/category.resource.js";
import { buildProductResource } from "./resources/product.resource.js";

AdminJS.registerAdapter({ Database, Resource });

const findModel = (name) =>
  Prisma.dmmf.datamodel.models.find((m) => m.name === name);

export const buildAdmin = () => {
  const componentLoader = new ComponentLoader();

  fixDmmfIds();

  const categoryModel = findModel("Category");
  const productModel = findModel("Product");

  const admin = new AdminJS({
    componentLoader,
    rootPath: "/admin",
    branding: {
      companyName: "Магазин Свічок",
      softwareBrothers: false,
    },
    resources: [
      buildCategoryResource(categoryModel, prisma),
      buildProductResource(productModel, prisma, componentLoader),
    ],
  });

  admin.watch();

  return admin;
};
