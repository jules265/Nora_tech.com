
    // Existing cart and products initialization
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let userEmail = localStorage.getItem('userEmail');

    let products = [
        {name: 'Laptop', price: 999.99, imageUrl: 'laptop.jpg'},
        {name: 'Smartphone', price: 499.99, imageUrl: 'smartphone.jpg'},
        {name: 'Headphones', price: 199.99, imageUrl: 'headphones.jpg'},
        {name: 'Smartwatch', price: 129.99, imageUrl: 'smartwatch.jpg'},
        {name: 'Keyboard', price: 49.99, imageUrl: 'keyboard.jpg'},
        {name: 'Bluetooth', price: 80.99, imageUrl: 'Bluetooth.jpg'},
        {name: 'Speaker', price: 30.99, imageUrl: 'Speaker.jpg'},
        {name: 'Virual_Reality', price: 600.99, imageUrl: 'vr.jpg'},
        {name: 'Tablet', price: 200.00, imageUrl: 'tablet.jpg'},
        {name: 'Television', price: 600.99, imageUrl: 'tv.jpg'},
        {name: 'Handler', price: 600.99, imageUrl: 'handler.jpg'},
        {name: 'Projector', price: 600.99, imageUrl: 'projector.jpg'},
        {name: 'Macos', price: 600.99, imageUrl: 'macos.jpg'},
        {name: 'Ipad', price: 600.99, imageUrl: 'ipad.jpg'},
        {name: 'Infinix', price: 600.99, imageUrl: 'infinix.jpg'},
        {name: 'Infinix-Hot', price: 600.99, imageUrl: 'infinixhot.jpg'},
    ];

    // Update cart count in header
    function updateCartCount() {
        document.getElementById("cart-count").textContent = cart.length;
    }

    // Generate unique order ID
    function generateOrderId() {
        return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Save order to user's email history
    function saveOrderToEmail(product) {
        if (!userEmail) {
            alert('Please log in to save your order');
            window.location.href = 'login.html';
            return false;
        }

        const userOrders = JSON.parse(localStorage.getItem(`orders_${userEmail}`) || '[]');
        userOrders.push({
            product: product,
            date: new Date().toISOString(),
            orderId: generateOrderId()
        });
        localStorage.setItem(`orders_${userEmail}`, JSON.stringify(userOrders));
        return true;
    }

    // Enhanced addToCart function
    function addToCart(productName) {
        const product = products.find(p => p.name === productName);
        if (product) {
            // Original cart functionality
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            // New email-based order tracking
            if (saveOrderToEmail(product)) {
                alert(`${product.name} added to cart and saved to your order history!`);
            }
        }
    }

    // Enhanced display products function
    function displayProducts(filteredProducts) {
        const productListDiv = document.getElementById("product-list");
        productListDiv.innerHTML = ''; // Clear previous list
        
        // Add order history button if user is logged in
        if (userEmail) {
            const orderHistoryButton = document.createElement("button");
            orderHistoryButton.innerHTML = "View Order History";
            orderHistoryButton.className = "order-history-btn";
            orderHistoryButton.onclick = displayOrderHistory;
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

    // Display order history
    function displayOrderHistory() {
        const userOrders = JSON.parse(localStorage.getItem(`orders_${userEmail}`) || '[]');
        
        const modal = document.createElement("div");
        modal.className = "order-history-modal";
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Your Order History</h2>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
                <div class="orders-list">
                    ${userOrders.map(order => `
                        <div class="order-item">
                            <p>Order ID: ${order.orderId}</p>
                            <p>Product: ${order.product.name}</p>
                            <p>Price: $${order.product.price}</p>
                            <p>Date: ${new Date(order.date).toLocaleString()}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Existing search function
    function searchProduct() {
        const searchQuery = document.getElementById("search").value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchQuery)
        );
        displayProducts(filteredProducts);
    }

    // Enhanced initialization
    window.onload = function() {
        displayProducts(products);
        updateCartCount();
    };