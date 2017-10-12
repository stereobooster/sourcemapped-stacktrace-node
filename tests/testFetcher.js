const fs = require("fs");
const path = require("path");

const mockFetchRespnse = ({ text, status = 200 }) =>
  Promise.resolve({
    status,
    text: () => Promise.resolve(text)
  });

const testFetcher = uri => {
  const uriParts = uri.split("/");
  const fileName = uriParts[uriParts.length - 1];
  const filePath = path.join(__dirname, "fixtures", fileName);
  if (fs.existsSync(filePath)) {
    return mockFetchRespnse({ text: fs.readFileSync(filePath, "utf8") });
  }

  console.log(uri);
  return Promise.resolve(false);
  // return fetch(uri);
};

exports.default = testFetcher;
