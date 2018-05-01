require("dotenv").config();

const chromeWebstoreUpload = require("chrome-webstore-upload");
const { readJson } = require("fs-extra");
const { resolve } = require("path");
const { createReadStream } = require("fs");

const webStore = chromeWebstoreUpload({
  extensionId: process.env.CHROME_EXTENSION_ID,
  clientId: process.env.CHROME_CLIENT_ID,
  clientSecret: process.env.CHROME_CLIENT_SECRET,
  refreshToken: process.env.CHROME_REFRESH_TOKEN,
});

const UPLOAD_FAILURE_STATES = ["FAILURE", "NOT_FOUND"];
// response: https://developer.chrome.com/webstore/webstore_api/items#resource
const uploadPackage = (packagePath, token) => {
  return webStore
    .uploadExisting(createReadStream(packagePath), token)
    .then(response => {
      const { uploadState } = response;
      // this API never rejects requests
      if (UPLOAD_FAILURE_STATES.includes(uploadState)) {
        const [{ error_code, error_detail }] = response.itemError;
        const error = new Error(error_detail);
        error.response = response;
        error.code = error_code;
        return Promise.reject(error);
      }
      return response;
    });
};
// https://developer.chrome.com/webstore/webstore_api/items/publish
const publishExtension = (target, token) => {
  return webStore.publish(target, token).then(response => {
    const [status] = response.status;
    if (status === "OK") {
      return response;
    } else {
      const error = new Error(
        `${response.statusDetail.join(",")} Publishing extension failed`
      );
      error.response = response;
      return Promise.reject(error);
    }
  });
};

const uploadChromeExtension = async () => {
  try {
    const target = "default";
    //  Read file name and version from package.json
    const { name, version } = await readJson("package.json");
    const browser = "chrome";
    const packagePath = resolve(
      "packages",
      `${name}.v${version}.${browser}.zip`
    );

    const token = await webStore.fetchToken();

    console.log("Beginning upload");
    const uploadResponse = await uploadPackage(packagePath, token);

    console.log(`Uploaded ${name} - ${version} succesfully!`);
    const publishResponse = await publishExtension(target, token);

    console.log("Package published", publishResponse);
  } catch (e) {
    console.error("Deploy failed!", e);
    throw e;
  }
  return {};
};

uploadChromeExtension();
