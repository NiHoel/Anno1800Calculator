{
  const classAdditions = {
    "body": "bg-dark",
    ".ui-fieldset legend, body": "text-light",
    ".form-control": "text-light bg-dark bg-darker",
    ".input-group-text, .modal-content": "bg-dark text-light",
    ".btn-default": "btn-dark btn-outline-light",
    ".btn-light": "btn-dark",
  };

  const makeDark = () => Object.keys(classAdditions).forEach((key) => $(key).addClass(classAdditions[key]));
  const makeLight = () => Object.keys(classAdditions).reverse().forEach((key) => $(key).removeClass(classAdditions[key]));

  const toggleDarkMode = () => $("body").is(".bg-dark") ? makeLight() : makeDark();

  window.toggleDarkMode = toggleDarkMode;
}
