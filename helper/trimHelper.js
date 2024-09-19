function trimAll(obj) {
  const trimmedObj = {};
  for (const key in obj) {
    trimmedObj[key] = typeof obj[key] === "string" ? obj[key].trim() : obj[key];
  }
  return trimmedObj;
}

module.exports = { trimAll };