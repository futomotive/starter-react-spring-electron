// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require("electron");
const path = require("path");
const url = require("url");
var findPort = require("find-free-port");
const isDev = require("electron-is-dev");
const logger = require("./logger");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 338,
    frame: false,
    backgroundColor: "#FFF",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true
    }
  });

  // and load the splash.html of the app.
  mainWindow.loadFile("splash.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", function() {
  // Create window first to show splash before starting server
  createWindow();
  if (isDev) {
    // Connect to webpack dev server from React.js (CRA)
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.maximize();
  } else {
    // Start Spring Boot server at port 8080
    findPort(8080, function(err, port) {
      logger.info(`Starting server at port ${port}`);
      startServer(port);
      loadWebApp(`http://localhost:${port}`);
    });
  }
});

// The server process
const JAR = "backend-1.0.0.jar"; // how to avoid manual update of this?
const MAX_CHECK_COUNT = 10;
let serverProcess;

function startServer(port) {
  // const platform = process.platform;

  const server = `${path.join(app.getAppPath(), "..", "..", JAR)}`;
  logger.info(`Launching server with jar ${server} at port ${port}...`);

  serverProcess = require("child_process").spawn("java", ["-jar", server, `--server.port=${port}`]);

  serverProcess.stdout.on("data", logger.server);

  if (serverProcess.pid) {
    logger.info("Server PID: " + serverProcess.pid);
  } else {
    logger.error("Failed to launch server process.");
  }
}

function loadWebApp(baseUrl) {
  logger.info(`Loading web app at ${baseUrl}`);
  // check server health and switch to main page
  checkCount = 0;
  const axios = require("axios");
  setTimeout(function cycle() {
    axios
      .get(`${baseUrl}/actuator/health`)
      .then(response => {
        mainWindow.loadURL(`${baseUrl}?_=${Date.now()}`);
        mainWindow.maximize();
      })
      .catch(e => {
        if (e.code === "ECONNREFUSED") {
          if (checkCount < MAX_CHECK_COUNT) {
            checkCount++;
            setTimeout(cycle, 1000);
          } else {
            dialog.showErrorBox(
              "Server timeout",
              `UI does not receive server response for ${MAX_CHECK_COUNT} seconds.`
            );
            app.quit();
          }
        } else {
          logger.error(e);
          dialog.showErrorBox("Server error", "UI receives an error from server.");
          app.quit();
        }
      });
  }, 200);
}

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

app.on("will-quit", () => {
  if (serverProcess) {
    logger.info(`Killing server process ${serverProcess.pid}`);
    const kill = require("tree-kill");
    kill(serverProcess.pid, "SIGTERM", function(err) {
      logger.info("Server process killed");
      serverProcess = null;
    });
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
