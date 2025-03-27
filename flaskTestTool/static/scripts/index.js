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
    window.location.href = "profile";
  });
  document.querySelector("section").appendChild(button);
}

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.style.display = 'none';
  loginForm.insertBefore(errorMessage, loginForm.firstChild);
  
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
      errorMessage.style.display = 'none';
    }, 3000);
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (!email || !password) {
        showError('Please enter both email and password');
        return;
      }
      
      try {
        const response = await fetch('/index', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Store user data in sessionStorage with the correct key
          sessionStorage.setItem('userData', JSON.stringify(data));
          // Redirect to profile page
          window.location.href = '/profile';
        } else {
          showError(data.message || 'Invalid email or password');
        }
      } catch (error) {
        console.error('Login error:', error);
        showError('Error connecting to server');
      }
    });
  }
});
