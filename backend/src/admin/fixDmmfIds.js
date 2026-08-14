import { Prisma } from "@prisma/client";

// Prisma 7 more no longer marks primary-key fields with `isId` in Prisma.dmmf,
// but @adminjs/prisma@5 still relies on that flag to find each model's id
// property (used for redirects after create/edit and building row links).
// Without this patch AdminJS throws an "id"-related error as soon as it needs
// to resolve a record's primary key.
//
// This walks every model in the schema (not just the ones currently wired
// into AdminJS) so a future model added to admin/resources doesn't silently
// hit the same bug. Assumes the primary key field is named "id", which holds
// for every model in prisma/schema.prisma today.
export const fixDmmfIds = () => {
  for (const model of Prisma.dmmf.datamodel.models) {
    const idField = model.fields.find((f) => f.name === "id");
    if (idField) idField.isId = true;
  }
};
