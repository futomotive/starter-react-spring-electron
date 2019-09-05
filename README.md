# React-Spring-Electron

> A starter project integrating React, Spring and Electron.

## Overview

The rationale for this project is, to provide a quick start in creating a
desktop application (Electron), with a modern UI based on web-technology
(React.js) talking to a REST backend, provided in Java (Spring). This
architecture provides very good separation of concern.

The project structure reflects this separation by providing three distinct
projects, that can be developed and build (fairly) independently.

1. `frontend`: React.js application
2. `backend`: Spring Boot application
   (created by [Spring Initializr](https://start.spring.io/) with Gradle,
   Java 8 Jar, Spring Boot 2.1.7, Web Starter and Actuator)
3. `electron`: Electron app

> NOTE: This project uses the system JRE to run the Spring backend. If you
> prefer to bundle the JRE into the app, configure the `extraFiles` of
> ElectronBuilder to copy it when making the installer.

## Building the Complete App

The web-technology parts are build with yarn, the Java parts with Gradle, the
bundling of the web app (React.js + Spring) is orchestrated by a small node.js
script (`electron/build-web-app.js`).

You can build the electron installer by executing the following commands:

```bash
cd electron

# install dependencies for electron project
yarn

# build electron installer (also builds )
yarn build
```

### Build process

When building the final desktop app installer:

1. `frontend` is built first. The final artifacts, including `index.html` and
   script files, are copied into `backend/src/main/resources/public` folder.
2. `backend` is built second. It creates a web app with the frontend artifacts
   created above and an executable jar.
3. `electron` installer is built last. It includes the web app created above
   in the bundle and creates an executable installer.

However, both `frontend` sub project and `backend` sub project are free of
Electron and can be built independently without building the Electron part.
This allows them to be deployed online, instead of packaged into Electron app.

> TODO: Make sure the frontend also works in browser-only mode (windowControls
> should be omitted if not running in Electron).

## Development Setup

The project setup allows independent development of the three parts: `electron`
and `frontend` have their own `package.json`, hence the frontend can be
developed independent of electron. The backend can be developed as a
stand-alone Spring REST Server.

- Run backend: Import the Gradle project into Eclipse and launch from there.
  The application will be running on port `8080`.
- Run frontend: Execute `yarn start` in `frontend` folder. The webpack dev
  server will be running on port `3000` with hot reload.
- Run electron: Execute `yarn start` in `electron` folder. Electron loads the
  web app from `http://localhost:3000`, therefore you need to run the frontend dev server first.

### Launch process

When launching the Electron app:

1. Electron app detects an available port and starts the backend server with
   Node `child_process` at the specified port. The PID of the server process
   is kept to kill the process before quiting the app.
2. Electron app then displays a splash page, at the same time pings the
   `actuator/health` URL of the backend server.
3. Once the `actuator/health` ping returns OK (the web app is up), Electron
   app switches the page to the home page of the web app.

> The Electron app starts the backend server only in production build. During
> development, you will need to manually start the webpack-dev-server as
> mentioned earlier.

### Logging

The log messages from Electron, React and Spring apps are consolidated into
the [electron logger](https://www.npmjs.com/package/electron-log) in Electron
app. By default it writes logs to the following locations:

- on Linux: ~/.config/<app name>/log.log
- on macOS: ~/Library/Logs/<app name>/log.log
- on Windows: %USERPROFILE%\AppData\Roaming\<app name>\log.log

In the React app, the electron logger is wrapped by the `log` property of
`window.interop` object. During launch, this `log` is set as
`React.prototype.$log` and `React.$log` in `main.js`. Calling
`vm.$log.info(...)` or `React.$log.info(...)` will send the log messages
(after attaching a prefix to identify it is from UI) to electron logger. Other
logging level works in the same way.

In the Spring app, `logback-spring.xml` configuration sends the log to console,
which is the standard output received by the Electron app. The logback message
pattern put the log level (`INFO`, `DEBUG`, etc.) at the beginning of the
message so that Electron app checks and calls the corresponding function
(`info`, `debug`, etc.) on the electron logger.

## Acknowledgment

This work was inspired by Ruoyun Wu's work at
https://github.com/wuruoyun/electron-vue-spring.

## License

[MIT](LICENSE)
