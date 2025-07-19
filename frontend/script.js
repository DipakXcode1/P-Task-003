// Global variables
const API_BASE_URL = 'http://localhost:5000/api';
let currentProducts = [];
let currentView = 'grid';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });

    // Chat input
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Navigation functions
function showHome() {
    hideAllSections();
    document.getElementById('homeSection').classList.add('active');
    updateActiveNav('Home');
}

function showProducts() {
    hideAllSections();
    document.getElementById('productsSection').classList.add('active');
    updateActiveNav('Products');
    loadProducts();
}

function showCart() {
    hideAllSections();
    document.getElementById('cartSection').classList.add('active');
    updateActiveNav('Cart');
    loadCart();
}

function showCheckout() {
    hideAllSections();
    document.getElementById('checkoutSection').classList.add('active');
    updateActiveNav('Checkout');
    loadOrderSummary();
}

function showAbout() {
    hideAllSections();
    document.getElementById('aboutSection').classList.add('active');
    updateActiveNav('About');
}

function showContact() {
    hideAllSections();
    document.getElementById('contactSection').classList.add('active');
    updateActiveNav('Contact');
}

function showLogin() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

function showProductDetail(productId) {
    hideAllSections();
    document.getElementById('productDetailSection').classList.add('active');
    loadProductDetail(productId);
}

function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
}

function updateActiveNav(section) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = Array.from(navLinks).find(link => 
        link.textContent.trim() === section
    );
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Product functions
async function loadProducts() {
    try {
        showLoading('productsGrid');
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();
        currentProducts = products;
        displayProducts(products);
        updateProductsCount(products.length);
    } catch (error) {
        console.error('Error loading products:', error);
        showError('productsGrid', 'Failed to load products');
    }
}

async function searchProducts() {
    const query = document.getElementById('searchInput').value.trim();
    const category = document.getElementById('categoryFilter').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const sortBy = document.getElementById('sortBy').value;

    try {
        showLoading('productsGrid');
        
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (category) params.append('category', category);
        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);
        if (sortBy) params.append('sort_by', sortBy);

        const response = await fetch(`${API_BASE_URL}/products/search?${params}`);
        const products = await response.json();
        currentProducts = products;
        displayProducts(products);
        updateProductsCount(products.length);
    } catch (error) {
        console.error('Error searching products:', error);
        showError('productsGrid', 'Failed to search products');
    }
}

function applyFilters() {
    searchProducts();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortBy').value = 'name';
    loadProducts();
}

function filterByCategory(category) {
    document.getElementById('categoryFilter').value = category;
    showProducts();
    applyFilters();
}

function displayProducts(products) {
    const container = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <h4>No products found</h4>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }

    const productsHTML = products.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image_url}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-rating">
                        ${generateStarRating(product.rating)} 
                        <span class="text-muted">(${product.reviews_count} reviews)</span>
                    </div>
                    <p class="product-description">${product.description.substring(0, 100)}...</p>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-add-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                        </button>
                        <button class="btn btn-outline-primary w-100 mt-2" onclick="showProductDetail(${product.id})">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    container.innerHTML = productsHTML;
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

async function loadProductDetail(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const product = await response.json();
        
        const reviewsResponse = await fetch(`${API_BASE_URL}/reviews/${productId}`);
        const reviews = await reviewsResponse.json();
        
        displayProductDetail(product, reviews);
    } catch (error) {
        console.error('Error loading product detail:', error);
        showError('productDetail', 'Failed to load product details');
    }
}

function displayProductDetail(product, reviews) {
    const container = document.getElementById('productDetail');
    
    const reviewsHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-rating">${generateStarRating(review.rating)}</div>
            <div class="review-comment">${review.comment || 'No comment provided'}</div>
            <small class="text-muted">${new Date(review.created_at).toLocaleDateString()}</small>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="product-detail">
            <div class="row">
                <div class="col-lg-6">
                    <div class="product-detail-image">
                        <img src="${product.image_url}" alt="${product.name}" class="img-fluid">
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="product-detail-info">
                        <h2>${product.name}</h2>
                        <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                        <div class="product-detail-rating">
                            ${generateStarRating(product.rating)} 
                            <span class="text-muted">(${product.reviews_count} reviews)</span>
                        </div>
                        <p class="product-detail-description">${product.description}</p>
                        <div class="mb-3">
                            <strong>Category:</strong> ${product.category}<br>
                            <strong>Stock:</strong> ${product.stock} units available
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary btn-lg" onclick="addToCart(${product.id})">
                                <i class="fas fa-shopping-cart me-2"></i>Add to Cart
                            </button>
                            <button class="btn btn-outline-primary" onclick="showReviewForm(${product.id})">
                                <i class="fas fa-star me-2"></i>Write a Review
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="reviews-section">
                <h4>Customer Reviews</h4>
                ${reviews.length > 0 ? reviewsHTML : '<p>No reviews yet. Be the first to review this product!</p>'}
            </div>
        </div>
    `;
}

// Cart functions
async function addToCart(productId, quantity = 1) {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId, quantity: quantity })
        });
        
        if (response.ok) {
            updateCartCount();
            showSuccess('Item added to cart successfully!');
        } else {
            showError('', 'Failed to add item to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showError('', 'Failed to add item to cart');
    }
}

async function loadCart() {
    try {
        const response = await fetch(`${API_BASE_URL}/cart`);
        const cart = await response.json();
        displayCart(cart);
    } catch (error) {
        console.error('Error loading cart:', error);
        showError('cartItems', 'Failed to load cart');
    }
}

function displayCart(cart) {
    const container = document.getElementById('cartItems');
    
    if (cart.items.length === 0) {
        container.innerHTML = `
            <div class="text-center">
                <h4>Your cart is empty</h4>
                <p>Add some products to get started!</p>
                <button class="btn btn-primary" onclick="showProducts()">Browse Products</button>
            </div>
        `;
        return;
    }

    const itemsHTML = cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image_url}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h6 class="cart-item-title">${item.name}</h6>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateCartItem(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartItem(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-total">
                <strong>$${item.total.toFixed(2)}</strong>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="row">
            <div class="col-lg-8">
                ${itemsHTML}
            </div>
            <div class="col-lg-4">
                <div class="cart-summary">
                    <h5>Cart Summary</h5>
                    <div class="order-item">
                        <span>Subtotal:</span>
                        <span>$${cart.total.toFixed(2)}</span>
                    </div>
                    <div class="order-item">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <div class="order-total">
                        <span>Total:</span>
                        <span>$${cart.total.toFixed(2)}</span>
                    </div>
                    <button class="btn btn-primary w-100 mt-3" onclick="showCheckout()">
                        Proceed to Checkout
                    </button>
                    <button class="btn btn-outline-danger w-100 mt-2" onclick="clearCart()">
                        Clear Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function updateCartItem(productId, quantity) {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId, quantity: quantity })
        });
        
        if (response.ok) {
            updateCartCount();
            loadCart();
        } else {
            showError('', 'Failed to update cart');
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        showError('', 'Failed to update cart');
    }
}

async function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/cart/clear`, {
                method: 'POST'
            });
            
            if (response.ok) {
                updateCartCount();
                loadCart();
                showSuccess('Cart cleared successfully!');
            } else {
                showError('', 'Failed to clear cart');
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            showError('', 'Failed to clear cart');
        }
    }
}

async function updateCartCount() {
    try {
        const response = await fetch(`${API_BASE_URL}/cart`);
        const cart = await response.json();
        const count = cart.items.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Checkout functions
function loadOrderSummary() {
    // This would typically load from the cart
    // For now, we'll show a placeholder
    const container = document.getElementById('orderSummary');
    container.innerHTML = `
        <div class="order-item">
            <span>Subtotal:</span>
            <span>$0.00</span>
        </div>
        <div class="order-item">
            <span>Shipping:</span>
            <span>Free</span>
        </div>
        <div class="order-total">
            <span>Total:</span>
            <span>$0.00</span>
        </div>
    `;
}

async function placeOrder() {
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    const shippingAddress = document.getElementById('shippingAddress').value;

    if (!shippingAddress.trim()) {
        showError('', 'Please provide a shipping address');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shipping_address: shippingAddress })
        });

        if (response.ok) {
            const result = await response.json();
            showSuccess(`Order placed successfully! Order ID: ${result.order_id}`);
            showHome();
        } else {
            const error = await response.json();
            showError('', error.error || 'Failed to place order');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showError('', 'Failed to place order');
    }
}

// Review functions
function showReviewForm(productId) {
    const reviewHTML = `
        <div class="review-form mt-3">
            <h5>Write a Review</h5>
            <div class="mb-3">
                <label class="form-label">Rating</label>
                <select class="form-select" id="reviewRating">
                    <option value="5">5 Stars - Excellent</option>
                    <option value="4">4 Stars - Very Good</option>
                    <option value="3">3 Stars - Good</option>
                    <option value="2">2 Stars - Fair</option>
                    <option value="1">1 Star - Poor</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Comment</label>
                <textarea class="form-control" id="reviewComment" rows="3" placeholder="Share your experience with this product..."></textarea>
            </div>
            <button class="btn btn-primary" onclick="submitReview(${productId})">Submit Review</button>
        </div>
    `;

    const productDetail = document.querySelector('.product-detail-info');
    const existingForm = productDetail.querySelector('.review-form');
    if (existingForm) {
        existingForm.remove();
    }
    
    productDetail.insertAdjacentHTML('beforeend', reviewHTML);
}

async function submitReview(productId) {
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value;

    try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_id: productId,
                rating: rating,
                comment: comment
            })
        });

        if (response.ok) {
            showSuccess('Review submitted successfully!');
            loadProductDetail(productId);
        } else {
            showError('', 'Failed to submit review');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showError('', 'Failed to submit review');
    }
}

// Chat functions
function toggleChat() {
    const chatBody = document.getElementById('chatBody');
    chatBody.classList.toggle('active');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, 'sent');
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const responses = [
                'Thank you for your message! Our support team will get back to you soon.',
                'I understand your concern. Let me help you with that.',
                'That\'s a great question! Here\'s what I can tell you...',
                'I\'m here to help! Could you provide more details?'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'received');
        }, 1000);
    }
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Utility functions
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;
    }
}

function showError(containerId, message) {
    if (containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
        `;
    } else {
        // Show toast notification
        showToast(message, 'danger');
    }
}

function showSuccess(message) {
    showToast(message, 'success');
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed`;
    toast.style.cssText = 'top: 100px; right: 20px; z-index: 1050; min-width: 300px;';
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
        ${message}
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function updateProductsCount(count) {
    const countElement = document.getElementById('productsCount');
    if (countElement) {
        countElement.textContent = `All Products (${count})`;
    }
}

function toggleView(view) {
    currentView = view;
    const container = document.getElementById('productsGrid');
    
    if (view === 'list') {
        container.classList.add('list-view');
    } else {
        container.classList.remove('list-view');
    }
    
    displayProducts(currentProducts);
}

// Initialize the app
showHome(); 