export function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key) {
  const jsonValue = localStorage.getItem(key);

  if (jsonValue == null) return null;
  return JSON.parse(jsonValue);
}
