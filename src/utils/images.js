// The same photo sometimes gets uploaded more than once — as the main image
// and again into the gallery, into a different folder, or re-exported in
// another format (".../photo.png" vs ".../gallery/photo.webp"). Comparing
// full URLs treats those as different photos, so compare the base filename
// without its extension instead.
export function photoKey(url) {
  return url?.split("/").pop()?.replace(/\.[^.]+$/, "").toLowerCase();
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
