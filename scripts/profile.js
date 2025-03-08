// DOM Elements
const userCartsContainer = document.getElementById('user-carts-container');
const userRecipesContainer = document.getElementById('user-recipes-container');
const logoutBtn = document.getElementById('logout-btn');

// Get User Carts From Local Storage
function getUserCarts() {
    const allCarts = JSON.parse(localStorage.getItem('carts')) || [];
    return allCarts;
}

// Get User Recipes From Local Storage
function getUserRecipes() {
  const allRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
  return allRecipes;
}

// Display User Recipes
function displayUserRecipes() {
  const userRecipes = getUserRecipes();

  if (userRecipes.length === 0) {
    userRecipesContainer.innerHTML = `
    <div class="no-recipes">
      <h3>No Recipes Created</h3>
      </div>
    `;
    return;
  }

  // inner HTML for recipes will be placed here eventually
}

// Display User Carts
function displayUserCarts() {
    const userCarts = getUserCarts();
    
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
}

// Handle Logout
function handleLogout() {
    window.location.href = 'index.html';
}

// Event Listeners
logoutBtn.addEventListener('click', handleLogout);

// Initialize Display
displayUserCarts(); 
displayUserRecipes();