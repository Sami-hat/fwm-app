import { _ } from "lodash";

function _getBaseUrl(category) {
  return category === "Food"
    ? "https://world.openfoodfacts.org"
    : "https://world.openbeautyfacts.org";
}

export async function getIngredients(imageUri) {
  baseUrl = "https://api.logmeal.com/v2/image/segmentation/complete";
  key = "897f792f475b6670ce199495d69478f576e21e50";
  headers = { Authorization: `Bearer ${key}` };
  const formData = new FormData();

  formData.append("image", {
    uri: imageUri,
    name: "photo.jpg",
    type: "image/jpg",
  });
  return fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: formData,
  });
}
