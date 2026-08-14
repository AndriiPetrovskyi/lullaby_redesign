import { env } from "../config/env.js";

export const buildImageUrl = (imageKey) =>
  imageKey ? `${env.baseUrl}/uploads/${imageKey}` : null;
