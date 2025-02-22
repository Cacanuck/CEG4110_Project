function createUsernameForm() {
  var section = document.querySelector("section");
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "/submit");
  form.classList.add("usernameForm");

  var usernameLabel = document.createElement("label");
  usernameLabel.textContent = "Username: ";
  form.appendChild(usernameLabel);
  var usernameInput = document.createElement("input");
  usernameInput.setAttribute("type", "text");
  usernameInput.setAttribute("name", "username")
  usernameInput.classList.add("Username", "input");
  
  form.appendChild(usernameInput);
  section.appendChild(form);
}

function createPasswordForm() {
  var section = document.querySelector("section");
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", "/submit");
  form.classList.add("passwordForm");

  var passwordLabel = document.createElement("label");
  passwordLabel.textContent = "Password: ";
  form.appendChild(passwordLabel);
  var passwordInput = document.createElement("input");
  passwordInput.setAttribute("type", "text");
  passwordInput.setAttribute("name", "password");
  passwordInput.classList.add("Password", "input");

  form.appendChild(passwordInput);
  section.appendChild(form);
}

function createLoginButton() {
  var button = document.createElement("button");
  button.textContent = "Login";
  button.id = "loginButton";
  button.addEventListener("click", function () {
    window.location.href = "profile.html";
  });
  document.querySelector("section").appendChild(button);
}

document.addEventListener("DOMContentLoaded", function () {
  createUsernameForm();
  createPasswordForm();
  createLoginButton();
});
