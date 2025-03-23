// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toggleBtn = document.getElementById('toggle-form');
const errorDiv = document.getElementById('error-message');
const successDiv = document.getElementById('success-message');

// Initialize form display
document.addEventListener('DOMContentLoaded', () => {
    if (loginForm && signupForm) {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        toggleBtn.textContent = 'Create an account';
    }
});

// Add input event listeners to all form inputs
document.querySelectorAll('.form-group input').forEach(input => {
    // Check initial value
    if (input.value.trim() !== '') {
        input.classList.add('has-value');
    }
    
    // Add input event listener
    input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.classList.add('has-value');
        } else {
            this.classList.remove('has-value');
        }
    });
});

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password) {
    // Password must be at least 8 characters long and contain:
    // One uppercase letter, one lowercase letter, one number, one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// Toggle between login and signup forms
function toggleForms() {
    const currentDisplay = loginForm.style.display;
    if (currentDisplay === 'none' || currentDisplay === '') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        toggleBtn.textContent = 'Create an account';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        toggleBtn.textContent = 'Already have an account?';
    }
}

// Display error message
function showError(message) {
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

// Display success message
function showSuccess(message) {
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate inputs
    if (!firstName || !lastName) {
        showError('Please enter your first and last name');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!isValidPassword(password)) {
        showError('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    const formData = {
        firstName,
        lastName,
        email,
        password
    };
    
    console.log('Sending signup data:', formData);
    
    try {
        const response = await fetch('/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            showSuccess('Account created successfully!');
            // Clear the form
            signupForm.reset();
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '/index';
            }, 2000);
        } else {
            showError(data.message || 'Error creating account');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showError('Error connecting to server');
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showError('Please enter both email and password');
        return;
    }
    
    const formData = { email, password };
    
    try {
        const response = await fetch('/index', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            sessionStorage.setItem('currentUser', JSON.stringify(data));
            window.location.href = '/index';
        } else {
            showError(data.message || 'Invalid email or password');
        }
    } catch (error) {
        showError('Error connecting to server');
        console.error('Login error:', error);
    }
}

// Event Listeners
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleForms);
}