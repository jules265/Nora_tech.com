// admin.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the dashboard
    initializeCharts();
    updateDashboard();
    showTab('dashboard');
    
    // Add event listeners
    document.getElementById('add-product-form').addEventListener('submit', addProduct);
});

// Show/Hide Tabs
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(`${tabName}-tab`).style.display = 'block';
    updateDashboard();
}

// Modal Functions
function showAddProductModal() {
    document.getElementById('add-product-modal').style.display = 'flex';
}

function hideAddProductModal() {
    document.getElementById('add-product-modal').style.display = 'none';
}

// Initialize Charts with Real Data
function initializeCharts() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const salesData = getMonthlyData(orders);
    
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');

    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: salesData.labels,
            datasets: [{
                label: 'Sales',
                data: salesData.data,
                borderColor: '#4CAF50',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const revenueData = getCategoryData(orders);
    new Chart(revenueCtx, {
        type: 'doughnut',
        data: {
            labels: revenueData.labels,
            datasets: [{
                data: revenueData.data,
                backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#F44336']
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Helper function to get monthly data
function getMonthlyData(orders) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = new Array(12).fill(0);
    
    orders.forEach(order => {
        const month = new Date(order.orderDate).getMonth();
        data[month] += parseFloat(order.price);
    });
    
    return {
        labels: months,
        data: data
    };
}

// Helper function to get category data
function getCategoryData(orders) {
    const categories = {};
    orders.forEach(order => {
        if (!categories[order.name]) {
            categories[order.name] = 0;
        }
        categories[order.name] += parseFloat(order.price);
    });
    
    return {
        labels: Object.keys(categories),
        data: Object.values(categories)
    };
}

// Update Dashboard Data
function updateDashboard() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Update stats
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('total-revenue').textContent = '$' + orders.reduce((sum, order) => sum + parseFloat(order.price), 0).toFixed(2);
    document.getElementById('total-users').textContent = users.length;
    document.getElementById('total-products').textContent = products.length;

    // Update tables
    updateOrdersTable(orders);
    updateProductsTable(products);
    updateUsersTable(users);
}

// Update Orders Table
function updateOrdersTable(orders) {
    const tbody = document.getElementById('orders-body');
    tbody.innerHTML = '';

    orders.forEach((order, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${index + 1000}</td>
            <td>${order.customerName}</td>
            <td>${order.name}</td>
            <td>$${order.price}</td>
            <td>${new Date(order.orderDate).toLocaleDateString()}</td>
            <td>
                <button class="action-btn view-btn" onclick="viewOrderDetails(${index})">View</button>
                <button class="action-btn delete-btn" onclick="deleteOrder(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Update Products Table with Images
function updateProductsTable(products) {
    const tbody = document.getElementById('products-body');
    tbody.innerHTML = '';

    products.forEach((product, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${product.image || '/api/placeholder/50/50'}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>${product.stock || 'N/A'}</td>
            <td>
                <button class="action-btn view-btn" onclick="viewProduct(${index})">View</button>
                <button class="action-btn edit-btn" onclick="editProduct(${index})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Update Users Table
function updateUsersTable(users) {
    const tbody = document.getElementById('users-body');
    tbody.innerHTML = '';

    users.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${new Date(user.joinDate).toLocaleDateString()}</td>
            <td>${user.orderCount || 0}</td>
            <td>
                <button class="action-btn view-btn" onclick="viewUserDetails(${index})">View</button>
                <button class="action-btn delete-btn" onclick="deleteUser(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// CRUD Operations
function addProduct(event) {
    event.preventDefault();
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    const newProduct = {
        name: document.getElementById('product-name').value,
        price: document.getElementById('product-price').value,
        image: document.getElementById('product-image').value || '/api/placeholder/50/50',
        description: document.getElementById('product-description').value,
        stock: 100,
        createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    hideAddProductModal();
    updateDashboard();
    event.target.reset();
}

function viewProduct(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[index];
    alert(`
        Product Details:
        Name: ${product.name}
        Price: $${product.price}
        Stock: ${product.stock || 'N/A'}
        Description: ${product.description}
        Created: ${new Date(product.createdAt).toLocaleString()}
    `);
}

function editProduct(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[index];
    
    // Pre-fill the modal with current values
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description;
    
    showAddProductModal();
    
    // Update the form submission handler
    const form = document.getElementById('add-product-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        products[index] = {
            ...product,
            name: document.getElementById('product-name').value,
            price: document.getElementById('product-price').value,
            image: document.getElementById('product-image').value,
            description: document.getElementById('product-description').value,
        };
        localStorage.setItem('products', JSON.stringify(products));
        hideAddProductModal();
        updateDashboard();
        // Reset the form submission handler
        form.onsubmit = (e) => addProduct(e);
    };
}

function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        updateDashboard();
    }
}

// Buy Now Page JavaScript
function initBuyPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');
    const productPrice = urlParams.get('price');
    const productImage = urlParams.get('image');
    const productDescription = urlParams.get('description');

    document.getElementById("product-name").textContent = `Product: ${productName}`;
    document.getElementById("product-description").textContent = productDescription || "No description available";
    document.getElementById("product-price").textContent = `Price: $${productPrice}`;
    document.getElementById("product-image").src = productImage || '/api/placeholder/400/400';

    document.getElementById("order-form").addEventListener("submit", handleOrderSubmission);
}

function handleOrderSubmission(event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');
    const productPrice = urlParams.get('price');
    const productImage = urlParams.get('image');

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !email || !phone || !address) {
        alert("Please fill in all fields.");
        return;
    }

    // Create and save order
    const order = {
        name: productName,
        price: productPrice,
        image: productImage,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerAddress: address,
        orderDate: new Date().toISOString(),
        status: 'Pending'
    };

    // Update orders
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Update user data
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUserIndex = users.findIndex(u => u.email === email);
    
    if (existingUserIndex !== -1) {
        users[existingUserIndex].orderCount = (users[existingUserIndex].orderCount || 0) + 1;
    } else {
        users.push({
            name: name,
            email: email,
            joinDate: new Date().toISOString(),
            orderCount: 1
        });
    }
    localStorage.setItem("users", JSON.stringify(users));

    alert("Order placed successfully! Thank you for your purchase.");
    window.location.href = "index.html";
}


// admin.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the dashboard
    initializeCharts();
    updateDashboard();
    showTab('dashboard');
    
    // Add event listeners
    document.getElementById('add-product-form').addEventListener('submit', addProduct);
});

// ... (previous functions remain the same until updateOrdersTable)

// Updated Orders Table with Enhanced View Functionality
function updateOrdersTable(orders) {
    const tbody = document.getElementById('orders-body');
    tbody.innerHTML = '';

    orders.forEach((order, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${index + 1000}</td>
            <td>${order.customerName}</td>
            <td>${order.name}</td>
            <td>$${order.price}</td>
            <td>${new Date(order.orderDate).toLocaleDateString()}</td>
            <td>
                <button class="action-btn view-btn" onclick="viewOrderDetails(${index})">View</button>
                <button class="action-btn delete-btn" onclick="deleteOrder(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Enhanced Order Details View
function viewOrderDetails(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[index];
    
    // Create a modal for order details
    const modalHTML = `
        <div id="order-details-modal" class="modal" style="display: flex;">
            <div class="modal-content">
                <h2>Order Details</h2>
                <div class="customer-details">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.customerEmail || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${order.customerPhone || 'N/A'}</p>
                    <p><strong>Address:</strong> ${order.customerAddress || 'N/A'}</p>
                </div>
                <div class="order-details">
                    <h3>Order Information</h3>
                    <p><strong>Product:</strong> ${order.name}</p>
                    <p><strong>Price:</strong> $${order.price}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                </div>
                <button class="btn" onclick="closeOrderDetailsModal()">Close</button>
            </div>
        </div>
    `;
    
    // Remove existing modal if present
    const existingModal = document.getElementById('order-details-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeOrderDetailsModal() {
    const modal = document.getElementById('order-details-modal');
    if (modal) {
        modal.remove();
    }
}

// Updated Product Addition Function
function addProduct(event) {
    event.preventDefault();
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    const newProduct = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value).toFixed(2),
        image: document.getElementById('product-image').value || '/api/placeholder/50/50',
        description: document.getElementById('product-description').value,
        stock: 100,
        createdAt: new Date().toISOString()
    };

    // Validate the input
    if (!newProduct.name || !newProduct.price || isNaN(newProduct.price)) {
        alert('Please fill in all required fields correctly');
        return;
    }

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    // Show success message
    alert('Product added successfully!');
    
    // Clear form and update display
    hideAddProductModal();
    updateDashboard();
    event.target.reset();
    
    // Switch to products tab to show the new product
    showTab('products');
}


// ... (rest of the existing functions remain the same)



// // Modal Functions
// function showAddProductModal() {
//     const modal = document.getElementById('add-product-modal');
//     if (modal) {
//         modal.style.display = 'flex';
//         // Reset form when showing modal
//         document.getElementById('add-product-form').reset();
//     }
// }

// function hideAddProductModal() {
//     const modal = document.getElementById('add-product-modal');
//     if (modal) {
//         modal.style.display = 'none';
//     }
// }

// // Make these functions available globally
// window.showAddProductModal = showAddProductModal;
// window.hideAddProductModal = hideAddProductModal;

// // Show/Hide Tabs
// function showTab(tabName) {
//     document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
//     document.getElementById(`${tabName}-tab`).style.display = 'block';
//     updateDashboard();
// }

// // Initialize Charts with Real Data
// function initializeCharts() {
//     const orders = JSON.parse(localStorage.getItem('orders')) || [];
//     const salesData = getMonthlyData(orders);
    
//     const salesCtx = document.getElementById('salesChart').getContext('2d');
//     const revenueCtx = document.getElementById('revenueChart').getContext('2d');

//     new Chart(salesCtx, {
//         type: 'line',
//         data: {
//             labels: salesData.labels,
//             datasets: [{
//                 label: 'Sales',
//                 data: salesData.data,
//                 borderColor: '#4CAF50',
//                 tension: 0.4
//             }]
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });

//     const revenueData = getCategoryData(orders);
//     new Chart(revenueCtx, {
//         type: 'doughnut',
//         data: {
//             labels: revenueData.labels,
//             datasets: [{
//                 data: revenueData.data,
//                 backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#F44336']
//             }]
//         },
//         options: {
//             responsive: true
//         }
//     });
// }

// // ... [Keep all your helper functions and other existing code]

// // CRUD Operations for Products
// function addProduct(event) {
//     event.preventDefault();
//     const products = JSON.parse(localStorage.getItem('products')) || [];
    
//     const newProduct = {
//         name: document.getElementById('product-name').value,
//         price: parseFloat(document.getElementById('product-price').value).toFixed(2),
//         image: document.getElementById('product-image').value || '/api/placeholder/50/50',
//         description: document.getElementById('product-description').value,
//         stock: 100,
//         createdAt: new Date().toISOString()
//     };

//     // Validate the input
//     if (!newProduct.name || !newProduct.price || isNaN(newProduct.price)) {
//         alert('Please fill in all required fields correctly');
//         return;
//     }

//     products.push(newProduct);
//     localStorage.setItem('products', JSON.stringify(products));
    
//     // Show success message
//     alert('Product added successfully!');
    
//     // Clear form and update display
//     hideAddProductModal();
//     updateDashboard();
//     event.target.reset();
    
//     // Switch to products tab to show the new product
//     showTab('products');
// }

// // Initialize the dashboard
// document.addEventListener('DOMContentLoaded', () => {
//     initializeCharts();
//     updateDashboard();
//     showTab('dashboard');
    
//     // Add event listener for the product form
//     const addProductForm = document.getElementById('add-product-form');
//     if (addProductForm) {
//         addProductForm.addEventListener('submit', addProduct);
//     }
// });

// // Make sure all necessary functions are available globally
// window.showTab = showTab;
// window.viewOrderDetails = viewOrderDetails;
// window.closeOrderDetailsModal = closeOrderDetailsModal;
// window.deleteOrder = deleteOrder;
// window.viewProduct = viewProduct;
// window.editProduct = editProduct;
// window.deleteProduct = deleteProduct;
// window.viewUserDetails = viewUserDetails;
// window.deleteUser = deleteUser;