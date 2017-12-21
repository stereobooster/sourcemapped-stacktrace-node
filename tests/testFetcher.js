const fs = require("fs");
const path = require("path");

const mockFetchRespnse = ({ text, status = 200 }) =>
  Promise.resolve({
    status,
    text: () => Promise.resolve(text)
  });

const fixturePath = uri => {
  const uriParts = uri.split("/");
  const fileName = uriParts[uriParts.length - 1];
  return path.join(__dirname, "fixtures", fileName);
};

const uriFetcher = uri => {
  const filePath = fixturePath(uri);
  if (fs.existsSync(filePath)) {
    return mockFetchRespnse({ text: fs.readFileSync(filePath, "utf8") });
  } else {
    console.log(uri);
    return Promise.reject();
  }
};

const fsFetcher = uri => {
  const filePath = fixturePath(uri);
  if (fs.existsSync(filePath)) {
    return Promise.resolve(fs.readFileSync(filePath, "utf8"));
  } else {
    console.log(uri);
    return Promise.reject();
  }
};

exports.uriFetcher = uriFetcher;
exports.fsFetcher = fsFetcher;
