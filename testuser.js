// First, ensure user is logged in and we have their email
let userEmail = localStorage.getItem('userEmail');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to save cart to both localStorage and user's email record
function saveCart(productName) {
    const product = products.find(p => p.name === productName);
    
    if (!userEmail) {
        alert('Please log in to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    if (product) {
        // Add to local cart
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Save to user's orders in localStorage (as a demo - in production this would be a server call)
        const userOrders = JSON.parse(localStorage.getItem(`orders_${userEmail}`) || '[]');
        userOrders.push({
            product: product,
            date: new Date().toISOString(),
            orderId: generateOrderId()
        });
        localStorage.setItem(`orders_${userEmail}`, JSON.stringify(userOrders));
        
        updateCartCount();
        
        // Show confirmation to user
        alert(`Added ${product.name} to your cart and saved to your order history.`);
    }
}

// Generate unique order ID
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Function to view user's orders
function viewUserOrders() {
    if (!userEmail) {
        alert('Please log in to view your orders');
        return;
    }
    
    const userOrders = JSON.parse(localStorage.getItem(`orders_${userEmail}`) || '[]');
    return userOrders;
}

// Update the addToCart function in your existing code
function addToCart(productName) {
    saveCart(productName);
}

// Add this to your login success handler
function onLoginSuccess(email) {
    userEmail = email;
    localStorage.setItem('userEmail', email);
    // Merge any existing cart with user's saved cart
    const savedOrders = JSON.parse(localStorage.getItem(`orders_${email}`) || '[]');
    // Update UI as needed
}

// Function to clear cart and orders on logout
function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('cart');
    cart = [];
    updateCartCount();
    window.location.href = 'login.html';
}

// Update product display to show order history button for logged-in users
function displayProducts(filteredProducts) {
    const productListDiv = document.getElementById("product-list");
    productListDiv.innerHTML = '';
    
    if (userEmail) {
        const orderHistoryButton = document.createElement("button");
        orderHistoryButton.innerHTML = "View Order History";
        orderHistoryButton.onclick = () => {
            const orders = viewUserOrders();
            displayOrderHistory(orders);
        };
        productListDiv.appendChild(orderHistoryButton);
    }
    
    filteredProducts.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product-item");
        productDiv.innerHTML = `
            <div class="product-image" style="background-image: url(${product.imageUrl});"></div>
            <p>${product.name} - $${product.price}</p>
            <button onclick="addToCart('${product.name}')">${userEmail ? 'Add to Cart' : 'Login to Purchase'}</button>
        `;
        productListDiv.appendChild(productDiv);
    });
}

// Function to display order history
function displayOrderHistory(orders) {
    const modal = document.createElement("div");
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-height: 80vh;
        overflow-y: auto;
        z-index: 1000;
    `;
    
    let orderHtml = '<h2>Your Order History</h2><button onclick="this.parentElement.remove()">Close</button><br><br>';
    orders.forEach(order => {
        orderHtml += `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <p>Order ID: ${order.orderId}</p>
                <p>Product: ${order.product.name}</p>
                <p>Price: $${order.product.price}</p>
                <p>Date: ${new Date(order.date).toLocaleString()}</p>
            </div>
        `;
    });
    
    modal.innerHTML = orderHtml;
    document.body.appendChild(modal);
}