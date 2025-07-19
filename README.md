# Local Store E-commerce Platform

A complete e-commerce solution for local stores with both frontend and backend components.

## Features

### Core Features
- Product listings with images, descriptions, and prices
- Shopping cart functionality
- User authentication and registration
- Order management and tracking
- Product search and filtering
- Responsive design for all devices

### Optional Features
- User reviews and ratings
- Customer support chat
- Product sorting and advanced filters
- Order history
- Wishlist functionality

## Project Structure

```
├── frontend/          # HTML/CSS/JS frontend
├── backend/           # Python Flask backend
├── database/          # SQLite database
└── assets/           # Images and static files
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory
2. Install Python dependencies: `pip install -r requirements.txt`
3. Run the Flask server: `python app.py`

### Frontend Setup
1. Navigate to the frontend directory
2. Open `index.html` in a browser or run: `python -m http.server 5500`
3. Access the site at `http://localhost:5500`

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Python Flask
- **Database**: SQLite
- **Styling**: Bootstrap 5, Custom CSS
- **Icons**: Font Awesome

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/<id>` - Get specific product
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart items
- `POST /api/orders` - Create new order
- `GET /api/orders/<id>` - Get order details # P-Task-003
