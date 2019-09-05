// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const logger = require("./logger");

const LOG_PREFIX = "[ui]";

window.versions = process.versions;

window.interop = {
  log: {
    info(msg) {
      logger.info(`${LOG_PREFIX} ${msg}`);
    },
    debug(msg) {
      logger.debug(`${LOG_PREFIX} ${msg}`);
    },
    warn(msg) {
      logger.warn(`${LOG_PREFIX} ${msg}`);
    },
    error(msg) {
      logger.error(`${LOG_PREFIX} ${msg}`);
    },
    log(msg) {
      logger.silly(`${LOG_PREFIX} ${msg}`);
    }
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
