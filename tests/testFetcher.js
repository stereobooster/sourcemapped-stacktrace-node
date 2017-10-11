const fs = require("fs");
const path = require("path");

const mockFetchRespnse = text =>
  Promise.resolve({
    status: 200,
    text: () => Promise.resolve(text)
  });

const testFetcher = uri => {
  const uriParts = uri.split("/");
  const fileName = uriParts[uriParts.length - 1];
  const filePath = path.join(__dirname, "fixtures", fileName);
  if (fs.existsSync(filePath)) {
    return mockFetchRespnse(fs.readFileSync(filePath, "utf8"));
  }

  console.log(uri);
  return fetch(uri);
};

exports.default = testFetcher;
