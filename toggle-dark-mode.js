{
  const classAdditions = {
    "body": "bg-dark",
    ".ui-fieldset legend, body": "text-light",
    ".form-control": "text-light bg-dark bg-darker",
    ".input-group-text, .modal-content": "bg-dark text-light",
    ".btn-default": "btn-dark btn-outline-light",
    ".btn-light": "btn-dark",
  };

  const changes = Object.keys(classAdditions).map((key) => ([
    () => $(key).addClass(classAdditions[key]),
    () => $(key).removeClass(classAdditions[key]),
  ]));

  function makeDark() {
    for (let i = 0; i < changes.length; i++) {
      changes[i][0]();
    }
  }

  function makeLight() {
    for (let i = changes.length - 1; i >= 0; i--) {
      changes[i][1]();
    }
  }

  var isLight = true;

  function toggleDarkMode() {
    if (isLight) {
      makeDark();
      isLight = false;
    } else {
      makeLight();
      isLight = true;
    }
  }

  window.toggleDarkMode = toggleDarkMode;
}
