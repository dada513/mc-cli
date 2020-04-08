require("colors");
const { Client, Authenticator } = require("minecraft-launcher-core");
const launcher = new Client();
const fs = require("fs");
const { resolve } = require("path");
const download = require("download");
const { ask, hiddenQuestion } = require("./helpers");
const versionindex = require("./versionindex.json");

const logger = {
  log: (message) => console.log(`[INFO]: `.green.bold + message),
  mc: (message) => console.log(`[MC]: `.blue.bold + message),
  warn: (message) => console.log(`[WARN]:`.yellow.bgRed + " " + message),
  error: (message) => console.log(`[ERROR]: `.red + message),
};
let options = {};
const app = async ({ username, password, version }) => {
  console.clear();
  logger.log(`Username: ` + JSON.stringify(username));
  logger.log(`Password: ` + JSON.stringify("REDACTED"));
  logger.log(`Version: ` + JSON.stringify(version));
  logger.log("Downloading files...");
  if (fs.existsSync(resolve("./mc.zip"))) {
    logger.log("mc.zip already exists, download aborted.");
  } else {
    logger.warn("mc.zip does not exist, downloading...");
    logger.log("Downloading configuration to mc.zip (0%)");
    await download("http://textures.dada513.eu/mc.zip", ".");
    logger.log("Successfully downloaded configuration to mc.zip (100%)");
  }
  let opts = {
    clientPackage: null,
    authorization: Authenticator.getAuth(username, password),
    clientPackage: "./mc.zip",
    root: "./minecraft",
    os: "windows",
    version: {
      number: version,
      type: "release",
    },
    memory: {
      max: "6000",
      min: "4000",
    },
  };
  launcher.launch(opts);
  logger.log("Downloading minecraft and opening...");
  launcher.on("data", logger.mc);
};
ask("[QUESTION]: ".cyan.bold + "Username: ")
  .then((answer) => {
    options.username = answer;
    return ask(
      "[QUESTION]: ".cyan.bold + "Password (leave blank to use offline-mode): "
    );
  })
  .then((answer) => {
    options.password = answer;
    return ask("[QUESTION]: ".cyan.bold + "Minecraft Version: ");
  })
  .then((answer) => {
    if (!answer) {
      answer = "1.15.2";
    }
    if (versionindex.indexOf(answer) === -1) {
      throw "Incorrect version.";
    }
    options.version = answer;
    app(options);
  });

process.on("unhandledRejection", (e) => {
  logger.error("Something went wrong -_-".rainbow);
  logger.error(e);
  process.exit(0);
});
