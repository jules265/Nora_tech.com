
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