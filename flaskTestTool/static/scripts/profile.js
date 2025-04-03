// DOM Elements
const userCartsContainer = document.getElementById('user-carts-container');
const userRecipesContainer = document.getElementById('user-recipes-container');
const logoutBtn = document.getElementById('logout-btn');
const userNameElement = document.querySelector('.user-name');
const userEmailElement = document.querySelector('.user-email');

// Get User Information From Session Storage
function getUserInfo() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
        userNameElement.textContent = `${userData.firstName} ${userData.lastName}`;
        userEmailElement.textContent = userData.email;
    } else {
        // If no user data is found, redirect to login page
        window.location.href = '/index';
    }
}

// Get User Carts From API
async function getUserCarts() {
    try {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        const response = await fetch('/api/carts', {
            headers: {
                'User-Id': userData.id
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch carts');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching user carts:', error);
        return [];
    }
}

// Get User Recipes
async function getUserRecipes() {
  try {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
      console.error('No user data found');
      return [];
    }
    
    const response = await fetch('/getRecipes', {
      headers: {
        'User-Id': userData.id
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    return [];
  }
}

// Display User Recipes
async function displayUserRecipes() {
  try {
    const userRecipes = await getUserRecipes();

    if (userRecipes.length === 0) {
      userRecipesContainer.innerHTML = `
        <div class="no-recipes">
          <h3>No Recipes Created</h3>
        </div>
      `;
      return;
    }

    userRecipesContainer.innerHTML = userRecipes.map(recipe => `
      <div class="cart-card" style="background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; transition: transform 0.2s ease;">
        <div style="padding: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <svg class="cart-icon" width="24" height="24" viewBox="0 0 344 404" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M79.5313 398.75C70.9532 398.75 62.7263 395.342 56.6606 389.277C50.595 383.211 47.1875 374.984 47.1875 366.406L61.25 190.625H99.2187L113.281 366.406C113.285 370.775 112.405 375.099 110.692 379.117C108.979 383.136 106.47 386.766 103.316 389.789C100.162 392.811 96.4288 395.163 92.3409 396.704C88.253 398.244 83.8956 398.94 79.5313 398.75Z" stroke="#EC9192" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M79.5313 190.625C120.694 190.625 154.062 149.072 154.062 97.8126C154.062 46.5537 120.694 5 79.5313 5C38.3688 5 5 46.5537 5 97.8126C5 149.072 38.3688 190.625 79.5313 190.625Z" stroke="#EC9192" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M275 398.75C266.422 398.75 258.195 395.343 252.129 389.277C246.064 383.212 242.656 374.985 242.656 366.407L256.719 190.625H294.687L308.75 366.407C308.754 370.775 307.873 375.099 306.161 379.118C304.448 383.137 301.939 386.767 298.785 389.789C295.631 392.812 291.898 395.164 287.81 396.704C283.722 398.244 279.364 398.94 275 398.75Z" stroke="#EC9192" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M338.281 127.344C337.914 144.256 330.936 160.35 318.845 172.179C306.753 184.008 290.509 190.629 273.594 190.625C256.811 190.625 240.715 183.958 228.847 172.091C216.98 160.223 210.312 144.127 210.312 127.344H338.281Z" stroke="#EC9192" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M210.312 10.625V127.344" stroke="#EC9192" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M273.594 10.625V124.531" stroke="#EC9192" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M338.281 10.625V127.344" stroke="#EC9192" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h2 style="margin: 0; font-size: 1.25rem; color: black;">${recipe.dish}</h2>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div style="margin: 0;">
              <h3 style="color: black; margin-bottom: 0.5rem; font-size: 1.1rem;">Ingredients:</h3>
              <div style="color: #666;">
                ${recipe.ingredients.map(item => `
                  <div style="margin-bottom: 0.5rem; line-height: 1.5; display: flex; align-items: center; gap: 0.5rem;">
                    <span>${item.size} ${item.measure}</span>
                    <span style="background-color: #f0f0f0; color: #666; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.9rem;">${item.ingredient}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div style="margin: 0; text-align: right;">
              <h3 style="color: black; margin-bottom: 0.5rem; font-size: 1.1rem;">Instructions:</h3>
              <div style="color: #666;">
                ${recipe.instructions.map(step => `
                  <div style="margin-bottom: 0.5rem; line-height: 1.5;">${step.instruction}</div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error displaying user recipes:', error);
    userRecipesContainer.innerHTML = `
      <div class="error-message">
        <h3>Error Loading Recipes</h3>
        <p>Please try again later.</p>
      </div>
    `;
  }
}

// Display User Carts
async function displayUserCarts() {
    try {
        const userCarts = await getUserCarts();
        
        if (userCarts.length === 0) {
            userCartsContainer.innerHTML = `
                <div class="no-carts">
                    <h3>No Shopping Carts Created</h3>
                </div>
            `;
            return;
        }

        userCartsContainer.innerHTML = userCarts.map(cart => `
            <div class="cart-card" data-cart-id="${cart.id}">
                <div class="cart-header">
                    <div class="cart-title-container">
                        <svg class="cart-icon" width="24" height="24" viewBox="0 0 310 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M68.5875 62.4999H29.8375M71.6875 62.4999L99.5876 160.5C101.916 168.228 106.753 175.026 113.382 179.888C120.012 184.75 128.082 187.419 136.4 187.5H249.292V62.4999H71.6875ZM159.004 231.25C159.004 241.605 150.33 250 139.629 250C128.929 250 120.254 241.605 120.254 231.25C120.254 220.895 128.929 212.5 139.629 212.5C150.33 212.5 159.004 220.895 159.004 231.25ZM249.421 231.25C249.421 241.605 240.746 250 230.046 250C219.345 250 210.671 241.605 210.671 231.25C210.671 220.895 219.345 212.5 230.046 212.5C240.746 212.5 249.421 220.895 249.421 231.25Z" stroke="#EC9192" stroke-width="17.6737" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <h2>${cart.title}</h2>
                    </div>
                    <div class="cart-meta">
                        <span class="cart-date">Created: ${new Date(cart.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="cart-items">
                    ${cart.items.map(item => `
                        <div class="cart-item">
                            <div class="item-info">
                                <span class="item-name">${item.name}</span>
                                <span class="item-category">${item.category}</span>
                            </div>
                            <span class="item-quantity">${item.quantity} ${item.unit}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error displaying user carts:', error);
        userCartsContainer.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Shopping Carts</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

// Handle Logout
function handleLogout() {
    // Clear user data from session storage
    sessionStorage.removeItem('userData');
    // Redirect to home page
    window.location.href = '/index';
}

// Event Listeners
logoutBtn.addEventListener('click', handleLogout);

// Initialize Display
getUserInfo();
displayUserCarts(); 
displayUserRecipes();