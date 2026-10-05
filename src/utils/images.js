// The same photo sometimes gets uploaded more than once — as the main image
// and again into the gallery, into a different folder, or re-exported in
// another format (".../photo.png" vs ".../gallery/photo.webp"). Comparing
// full URLs treats those as different photos, so compare the base filename
// without its extension instead.
export function photoKey(url) {
  return url?.split("/").pop()?.replace(/\.[^.]+$/, "").toLowerCase();
}

// Product photos are uploaded full-size (2–12 MB). The backend serves a
// resized WebP for `/uploads/...?w=<width>` (widths must match its
// ALLOWED_WIDTHS), so the browser picks the smallest one that fits.
// URLs not served by the backend (e.g. bundled assets) pass through as-is.
export function responsiveImage(url, widths, sizes) {
  if (!url || !url.includes("/uploads/")) return { src: url };
  const variant = (w) => `${url}${url.includes("?") ? "&" : "?"}w=${w}`;
  return {
    src: variant(widths[Math.floor(widths.length / 2)]),
    srcSet: widths.map((w) => `${variant(w)} ${w}w`).join(", "),
    sizes,
  };
}

// Ads link to `/products/<slug>?photo=<file name without extension>` so the
// gallery opens on the same photo the ad showed. Moves that photo to the
// front; `extraPool` lets it be found even if it isn't in `urls` (e.g. the
// product's main image, which the mobile gallery doesn't include). Unknown
// or missing keys leave the order untouched.
export function withPhotoFirst(urls, key, extraPool = []) {
  if (!key) return urls;
  const wanted = key.toLowerCase();
  const match = [...urls, ...extraPool].find((url) => photoKey(url) === wanted);
  if (!match) return urls;
  return [match, ...urls.filter((url) => photoKey(url) !== wanted)];
}

export function uniquePhotos(urls) {
  const seen = new Set();
  return urls.filter((url) => {
    if (!url) return false;
    const key = photoKey(url);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
