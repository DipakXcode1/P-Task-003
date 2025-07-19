# Local Store E-commerce Platform - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Option 1: Automated Setup (Recommended)

1. **Start the Backend Server**
   ```bash
   python start_backend.py
   ```
   This will:
   - Install required dependencies
   - Start the Flask API server on http://localhost:5000
   - Create the database with sample products

2. **Start the Frontend Server** (in a new terminal)
   ```bash
   python start_frontend.py
   ```
   This will:
   - Start a local HTTP server on http://localhost:5500
   - Automatically open your browser

### Option 2: Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```bash
   python app.py
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start a local HTTP server:
   ```bash
   python -m http.server 5500
   ```

3. Open your browser and go to: http://localhost:5500

## 📋 Features Overview

### Core Features ✅
- **Product Catalog**: Browse products with images, descriptions, and prices
- **Shopping Cart**: Add/remove items, update quantities
- **Product Search**: Search by name, category, price range
- **Product Filtering**: Filter by category, price, and sort options
- **Product Details**: Detailed product pages with reviews
- **Checkout Process**: Complete order placement
- **Responsive Design**: Works on desktop, tablet, and mobile

### Optional Features ✅
- **User Reviews**: Rate and review products
- **Customer Support Chat**: Live chat widget
- **Order Tracking**: View order status and details
- **Advanced Filters**: Sort by price, rating, name
- **Wishlist**: Save products for later (UI ready)

## 🛠️ Technical Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **API**: RESTful API with JSON responses
- **CORS**: Enabled for frontend communication

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS with ES6+ features
- **Bootstrap 5**: Responsive UI components
- **Font Awesome**: Icons

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/<id>` - Get specific product
- `GET /api/products/search` - Search products with filters

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update cart item quantity
- `POST /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/<id>` - Get order details

### Reviews
- `GET /api/reviews/<product_id>` - Get product reviews
- `POST /api/reviews` - Add product review

## 🗄️ Database Schema

### Products
- id, name, description, price, image_url, category, stock, rating, reviews_count, created_at

### Users
- id, username, email, password, created_at

### Orders
- id, user_id, total_amount, status, shipping_address, created_at

### Order Items
- id, order_id, product_id, quantity, price

### Reviews
- id, product_id, user_id, rating, comment, created_at

## 🎨 Customization

### Adding Products
1. Edit `backend/app.py` and add products to the `sample_products` list
2. Restart the backend server

### Styling
- Modify `frontend/styles.css` for custom styling
- Update CSS variables in `:root` for theme colors

### Features
- Add new API endpoints in `backend/app.py`
- Extend frontend functionality in `frontend/script.js`

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   - Backend: Change port in `backend/app.py` (line 280)
   - Frontend: Use different port: `python -m http.server 8000`

2. **CORS errors**
   - Ensure backend is running on http://localhost:5000
   - Check that `flask-cors` is installed

3. **Database issues**
   - Delete `backend/ecommerce.db` and restart backend
   - Database will be recreated with sample data

4. **Images not loading**
   - Check internet connection (uses Unsplash images)
   - Replace with local images if needed

### Debug Mode
- Backend runs in debug mode by default
- Check terminal for error messages
- Use browser developer tools for frontend debugging

## 📱 Mobile Testing

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Tablet browsers

## 🔒 Security Notes

This is a demo application. For production use:
- Implement proper user authentication
- Add input validation and sanitization
- Use HTTPS
- Implement rate limiting
- Add proper error handling
- Use environment variables for sensitive data

## 📈 Performance

- Images are lazy-loaded for better performance
- API responses are optimized
- Frontend uses efficient DOM manipulation
- Responsive images for different screen sizes

## 🤝 Contributing

To extend the application:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of the Prodigy Infotech Task-03.

---

**Happy Shopping! 🛒** 