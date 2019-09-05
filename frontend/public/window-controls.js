function isElectron() {
  // Renderer process
  if (
    typeof window !== "undefined" &&
    typeof window.process === "object" &&
    window.process.type === "renderer"
  ) {
    return true;
  }

  // Main process
  if (typeof process !== "undefined" && typeof process.versions === "object" && !!process.versions.electron) {
    return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  if (
    typeof navigator === "object" &&
    typeof navigator.userAgent === "string" &&
    navigator.userAgent.indexOf("Electron") >= 0
  ) {
    return true;
  }

  return false;
}

if (isElectron()) {
  const { remote } = require("electron");

  (function handleWindowControls() {
    // When document has loaded, initialise
    document.onreadystatechange = () => {
      if (document.readyState == "complete") {
        init();
      }
    };

    function init() {
      const window = remote.getCurrentWindow();

      const minButton = document.getElementById("WindowControls-MinButton");
      const maxButton = document.getElementById("WindowControls-MaxButton");
      const restoreButton = document.getElementById("WindowControls-RestoreButton");
      const closeButton = document.getElementById("WindowControls-CloseButton");

      minButton.addEventListener("click", event => {
        window.minimize();
      });

      maxButton.addEventListener("click", event => {
        window.maximize();
        toggleMaxRestoreButtons();
      });

      restoreButton.addEventListener("click", event => {
        window.unmaximize();
        toggleMaxRestoreButtons();
      });

      closeButton.addEventListener("click", event => {
        window.close();
      });

      function toggleMaxRestoreButtons() {
        if (window.isMaximized()) {
          maxButton.style.display = "none";
          restoreButton.style.display = "flex";
        } else {
          maxButton.style.display = "flex";
          restoreButton.style.display = "none";
        }
      }

      // Toggle maximise/restore buttons when maximisation/unmaximisation
      // occurs by means other than button clicks e.g. double-clicking
      // the title bar:
      toggleMaxRestoreButtons();
      window.on("maximize", toggleMaxRestoreButtons);
      window.on("unmaximize", toggleMaxRestoreButtons);
    }
  })();
}
