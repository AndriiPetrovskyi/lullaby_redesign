import slugify from "slugify";
import uploadFeature from "@adminjs/upload";

const applySlugAndCategory = async (request) => {
  if (request.payload) {
    if (request.payload.name && !request.payload.slug) {
      request.payload.slug = slugify(request.payload.name, {
        lower: true,
        strict: true,
      });
    }
    if (request.payload.categoryId === "") {
      request.payload.categoryId = null;
    }
  }
  return request;
};

export const buildProductResource = (productModel, prisma, componentLoader) => ({
  resource: { model: productModel, client: prisma },
  options: {
    properties: {
      id: {
        isVisible: { edit: false, show: true, list: true, filter: true },
      },
      slug: { isVisible: { edit: false, show: true, list: true } },
      imageKey: { isVisible: false },
      imageBucket: { isVisible: false },
      imageMimeType: { isVisible: false },
      imageSize: { isVisible: false },
      image_url: { isVisible: false },
    },
    actions: {
      new: { before: [applySlugAndCategory] },
      edit: { before: [applySlugAndCategory] },
    },
  },
  features: [
    uploadFeature({
      componentLoader,
      provider: {
        local: {
          bucket: "public/uploads",
          opts: { baseUrl: "/uploads" },
        },
      },
      properties: {
        key: "imageKey",
        bucket: "imageBucket",
        mimeType: "imageMimeType",
        size: "imageSize",
        file: "uploadImage",
      },
      validation: {
        mimeTypes: [
          "image/png",
          "image/jpeg",
          "image/webp",
          "video/mp4",
          "video/webm",
          "video/quicktime",
        ],
      },
    }),
  ],
});
