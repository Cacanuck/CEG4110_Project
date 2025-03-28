document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) {
        // If not logged in, redirect to login page
        window.location.href = '/index';
        return;
    }
    
    // If logged in, initialize cart functionality
    initializeCart();
});

function initializeCart() {
    // Initialize Carts Array from Local Storage or Create Empty Array if None Exist
    let carts = JSON.parse(localStorage.getItem('carts')) || [];

    // DOM Element References
    const cartsContainer = document.getElementById('carts-container');
    const createCartBtn = document.getElementById('create-cart-btn');
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close');
    const cartForm = document.getElementById('cart-form');
    const addItemBtn = document.getElementById('add-item-btn');

    // Display all Carts in Container
    displayCarts();
}

// Helper Function to Generate Unique IDs for Carts/Items
function generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Display all Carts in Container
function displayCarts() {
    // Show Message if No Cart Exists
    if (carts.length === 0) {
        cartsContainer.innerHTML = `
            <div class="no-carts">
                <h2>No Carts Created Yet</h2>
                <p>Click the Button Below to Create Your First Shopping Cart!</p>
            </div>
        `;
        return;
    }

    // Generate HTML for Each Cart
    cartsContainer.innerHTML = carts.map(cart => `
        <div class="cart-card" data-cart-id="${cart.id}">
            <div class="cart-header">
                <div class="cart-title-container">
                    <!-- Cart Icon SVG -->
                    <svg class="cart-icon" width="24" height="24" viewBox="0 0 310 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M68.5875 62.4999H29.8375M71.6875 62.4999L99.5876 160.5C101.916 168.228 106.753 175.026 113.382 179.888C120.012 184.75 128.082 187.419 136.4 187.5H249.292V62.4999H71.6875ZM159.004 231.25C159.004 241.605 150.33 250 139.629 250C128.929 250 120.254 241.605 120.254 231.25C120.254 220.895 128.929 212.5 139.629 212.5C150.33 212.5 159.004 220.895 159.004 231.25ZM249.421 231.25C249.421 241.605 240.746 250 230.046 250C219.345 250 210.671 241.605 210.671 231.25C210.671 220.895 219.345 212.5 230.046 212.5C240.746 212.5 249.421 220.895 249.421 231.25Z" stroke="#EC9192" stroke-width="17.6737" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2>${cart.title}</h2>
                </div>
                <div class="cart-meta">
                    <span class="cart-date">Created: ${new Date(cart.created_at).toLocaleDateString()}</span>
                </div>
                <div class="cart-actions">
                    <button class="edit-btn" onclick="editCart('${cart.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteCart('${cart.id}')">Delete</button>
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

// Add New Item Input Fields to the Form
function addItemFields() {
    const itemsContainer = document.getElementById('items-container');
    const itemEntry = document.createElement('div');
    itemEntry.className = 'item-entry';
    // Create New Item Entry with all Input Fields
    itemEntry.innerHTML = `
        <input type="text" class="item-name" placeholder="Item name" required>
        <input type="number" class="item-quantity" placeholder="Quantity" min="1" required>
        <select class="item-unit">
            <option value="pieces">Pieces</option>
            <option value="lbs">Pounds</option>
            <option value="oz">Ounces</option>
            <option value="gallons">Gallons</option>
        </select>
        <select class="item-category">
            <option value="uncategorized">Select Category</option>
            <option value="produce">Produce</option>
            <option value="dairy">Dairy</option>
            <option value="meat">Meat</option>
            <option value="pantry">Pantry</option>
            <option value="bakery">Bakery</option>
            <option value="frozen">Frozen</option>
            <option value="supplies">Supplies</option>
        </select>
        <button type="button" class="remove-item">Remove</button>
    `;
    itemsContainer.appendChild(itemEntry);
}

// Create New Cart
function createCart(e) {
    e.preventDefault();
    // Create New Cart Object with Metadata
    const newCart = {
        id: generateId('cart'),
        userId: 'user_123', // Placeholder for User System
        title: document.getElementById('cart-title').value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: Array.from(document.querySelectorAll('.item-entry')).map(entry => ({
            id: generateId('item'),
            name: entry.querySelector('.item-name').value,
            quantity: parseInt(entry.querySelector('.item-quantity').value),
            unit: entry.querySelector('.item-unit').value,
            category: entry.querySelector('.item-category').value
        }))
    };
    // Add to Carts Array and Save to Local Storage
    carts.push(newCart);
    localStorage.setItem('carts', JSON.stringify(carts));
    
    // Reset UI
    modal.style.display = 'none';
    cartForm.reset();
    displayCarts();
}

// Delete Cart by ID
function deleteCart(id) {
    if (confirm('Are you sure you want to delete this cart?')) {
        carts = carts.filter(cart => cart.id !== id);
        localStorage.setItem('carts', JSON.stringify(carts));
        displayCarts();
    }
}

// Edit Existing Cart
function editCart(id) {
    const cart = carts.find(c => c.id === id);
    // Populate Form with Existing Cart Data
    document.getElementById('cart-title').value = cart.title;
    // Clear and Rebuild Items Container
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = '<h3>Items</h3>';
    // Add Existing Items to Form
    cart.items.forEach(item => {
        const itemEntry = document.createElement('div');
        itemEntry.className = 'item-entry';
        itemEntry.innerHTML = `
            <input type="text" class="item-name" placeholder="Item name" value="${item.name}" required>
            <input type="number" class="item-quantity" placeholder="Quantity" min="1" value="${item.quantity}" required>
            <select class="item-unit">
                <option value="pieces" ${item.unit === 'pieces' ? 'selected' : ''}>Pieces</option>
                <option value="lbs" ${item.unit === 'lbs' ? 'selected' : ''}>Pounds</option>
                <option value="oz" ${item.unit === 'oz' ? 'selected' : ''}>Ounces</option>
                <option value="gallons" ${item.unit === 'gallons' ? 'selected' : ''}>Gallons</option>
            </select>
            <select class="item-category">
                <option value="uncategorized" ${item.category === 'uncategorized' ? 'selected' : ''}>Select Category</option>
                <option value="produce" ${item.category === 'produce' ? 'selected' : ''}>Produce</option>
                <option value="dairy" ${item.category === 'dairy' ? 'selected' : ''}>Dairy</option>
                <option value="meat" ${item.category === 'meat' ? 'selected' : ''}>Meat</option>
                <option value="pantry" ${item.category === 'pantry' ? 'selected' : ''}>Pantry</option>
                <option value="bakery" ${item.category === 'bakery' ? 'selected' : ''}>Bakery</option>
                <option value="frozen" ${item.category === 'frozen' ? 'selected' : ''}>Frozen</option>
                <option value="supplies" ${item.category === 'supplies' ? 'selected' : ''}>Supplies</option>
            </select>
            <button type="button" class="remove-item">Remove</button>
        `;
        itemsContainer.appendChild(itemEntry);
    });
    // Show Modal
    modal.style.display = 'block';
    // Remove Existing Submit Handler
    cartForm.removeEventListener('submit', createCart);
    // Add Edit Submit Handler
    const editSubmitHandler = (e) => {
        e.preventDefault();
        // Gather Updated Cart Data
        const updatedTitle = document.getElementById('cart-title').value;
        const itemEntries = document.querySelectorAll('.item-entry');
        const updatedItems = Array.from(itemEntries).map(entry => ({
            id: generateId('item'),
            name: entry.querySelector('.item-name').value,
            quantity: parseInt(entry.querySelector('.item-quantity').value),
            unit: entry.querySelector('.item-unit').value,
            category: entry.querySelector('.item-category').value
        }));
        // Create Updated Cart Object
        const updatedCart = {
            id: cart.id,
            userId: 'user_123',
            title: updatedTitle,
            created_at: cart.created_at,
            updated_at: new Date().toISOString(),
            items: updatedItems
        };
        // Update Carts Array and Save to Local Storage
        carts = carts.map(c => c.id === id ? updatedCart : c);
        localStorage.setItem('carts', JSON.stringify(carts));
        // Reset UI
        modal.style.display = 'none';
        cartForm.reset();
        // Clean up Event Listeners
        cartForm.removeEventListener('submit', editSubmitHandler);
        cartForm.addEventListener('submit', createCart);
        // Update Display
        displayCarts();
    };
    cartForm.addEventListener('submit', editSubmitHandler);
}

// Event Listeners
createCartBtn.addEventListener('click', () => {
    // Reset Form and Prepare for New Cart
    cartForm.reset();
    // Clear Items Container and Add One Empty Item Entry
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = `
        <h3>Items</h3>
        <div class="item-entry">
            <input type="text" class="item-name" placeholder="Item name" required>
            <input type="number" class="item-quantity" placeholder="Quantity" min="1" required>
            <select class="item-unit">
                <option value="pieces">Pieces</option>
                <option value="lbs">Pounds</option>
                <option value="oz">Ounces</option>
                <option value="gallons">Gallons</option>
            </select>
            <select class="item-category">
                <option value="uncategorized">Select Category</option>
                <option value="produce">Produce</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat</option>
                <option value="pantry">Pantry</option>
                <option value="bakery">Bakery</option>
                <option value="frozen">Frozen</option>
                <option value="supplies">Supplies</option>
            </select>
            <button type="button" class="remove-item">Remove</button>
        </div>
    `;
    modal.style.display = 'block';
});

// Close Modal and Reset Form
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    cartForm.reset();
    // Reset Event Listeners
    cartForm.removeEventListener('submit', createCart);
    cartForm.addEventListener('submit', createCart);
});

// Add New Item Fields when Button Clicked
addItemBtn.addEventListener('click', addItemFields);
// Handle Form Submission for New Cart
cartForm.addEventListener('submit', createCart);
// Handle Remove Item Button Clicks Using Event Delegation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item')) {
        e.target.parentElement.remove();
    }
});

// Close Modal when Clicking Outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        cartForm.reset();
        // Reset Event Listeners
        cartForm.removeEventListener('submit', createCart);
        cartForm.addEventListener('submit', createCart);
    }
});

// Initialize Display
displayCarts(); 