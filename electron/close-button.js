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
    const closeButton = document.getElementById("close-button");
    closeButton.addEventListener("click", event => {
      window.close();
    });
  }
})();
