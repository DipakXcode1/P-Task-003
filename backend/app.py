from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db = SQLAlchemy(app)

# Database Models
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    stock = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0.0)
    reviews_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    shipping_address = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Initialize database
with app.app_context():
    db.create_all()
    
    # Add sample products if database is empty
    if not Product.query.first():
        sample_products = [
            {
                'name': 'Wireless Bluetooth Headphones',
                'description': 'High-quality wireless headphones with noise cancellation',
                'price': 89.99,
                'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
                'category': 'Electronics',
                'stock': 50,
                'rating': 4.5,
                'reviews_count': 120
            },
            {
                'name': 'Organic Cotton T-Shirt',
                'description': 'Comfortable organic cotton t-shirt in various colors',
                'price': 24.99,
                'image_url': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
                'category': 'Clothing',
                'stock': 100,
                'rating': 4.2,
                'reviews_count': 85
            },
            {
                'name': 'Smartphone Case',
                'description': 'Durable protective case for smartphones',
                'price': 19.99,
                'image_url': 'https://images.unsplash.com/photo-1603314585442-ee3b3c16fbcf?w=400',
                'category': 'Accessories',
                'stock': 75,
                'rating': 4.0,
                'reviews_count': 65
            },
            {
                'name': 'Coffee Maker',
                'description': 'Automatic coffee maker with programmable timer',
                'price': 149.99,
                'image_url': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
                'category': 'Home & Kitchen',
                'stock': 30,
                'rating': 4.7,
                'reviews_count': 95
            },
            {
                'name': 'Running Shoes',
                'description': 'Comfortable running shoes with excellent cushioning',
                'price': 79.99,
                'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
                'category': 'Sports',
                'stock': 40,
                'rating': 4.3,
                'reviews_count': 110
            },
            {
                'name': 'Laptop Stand',
                'description': 'Adjustable laptop stand for better ergonomics',
                'price': 39.99,
                'image_url': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
                'category': 'Electronics',
                'stock': 60,
                'rating': 4.1,
                'reviews_count': 45
            }
        ]
        
        for product_data in sample_products:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()

# Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'image_url': p.image_url,
        'category': p.category,
        'stock': p.stock,
        'rating': p.rating,
        'reviews_count': p.reviews_count
    } for p in products])

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'image_url': product.image_url,
        'category': product.category,
        'stock': product.stock,
        'rating': product.rating,
        'reviews_count': product.reviews_count
    })

@app.route('/api/products/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '')
    category = request.args.get('category', '')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    sort_by = request.args.get('sort_by', 'name')
    
    products_query = Product.query
    
    if query:
        products_query = products_query.filter(Product.name.contains(query))
    if category:
        products_query = products_query.filter(Product.category == category)
    if min_price is not None:
        products_query = products_query.filter(Product.price >= min_price)
    if max_price is not None:
        products_query = products_query.filter(Product.price <= max_price)
    
    if sort_by == 'price_low':
        products_query = products_query.order_by(Product.price.asc())
    elif sort_by == 'price_high':
        products_query = products_query.order_by(Product.price.desc())
    elif sort_by == 'rating':
        products_query = products_query.order_by(Product.rating.desc())
    else:
        products_query = products_query.order_by(Product.name.asc())
    
    products = products_query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'image_url': p.image_url,
        'category': p.category,
        'stock': p.stock,
        'rating': p.rating,
        'reviews_count': p.reviews_count
    } for p in products])

@app.route('/api/cart', methods=['GET'])
def get_cart():
    cart = session.get('cart', {})
    cart_items = []
    total = 0
    
    for product_id, quantity in cart.items():
        product = Product.query.get(product_id)
        if product:
            item_total = product.price * quantity
            cart_items.append({
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'image_url': product.image_url,
                'quantity': quantity,
                'total': item_total
            })
            total += item_total
    
    return jsonify({
        'items': cart_items,
        'total': total
    })

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    product_id = str(data.get('product_id'))
    quantity = data.get('quantity', 1)
    
    cart = session.get('cart', {})
    cart[product_id] = cart.get(product_id, 0) + quantity
    session['cart'] = cart
    
    return jsonify({'message': 'Item added to cart', 'cart': cart})

@app.route('/api/cart/update', methods=['POST'])
def update_cart():
    data = request.get_json()
    product_id = str(data.get('product_id'))
    quantity = data.get('quantity', 0)
    
    cart = session.get('cart', {})
    
    if quantity <= 0:
        cart.pop(product_id, None)
    else:
        cart[product_id] = quantity
    
    session['cart'] = cart
    return jsonify({'message': 'Cart updated', 'cart': cart})

@app.route('/api/cart/clear', methods=['POST'])
def clear_cart():
    session['cart'] = {}
    return jsonify({'message': 'Cart cleared'})

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    cart = session.get('cart', {})
    
    if not cart:
        return jsonify({'error': 'Cart is empty'}), 400
    
    # Calculate total
    total = 0
    order_items = []
    
    for product_id, quantity in cart.items():
        product = Product.query.get(product_id)
        if product and product.stock >= quantity:
            item_total = product.price * quantity
            total += item_total
            order_items.append({
                'product_id': product_id,
                'quantity': quantity,
                'price': product.price
            })
            # Update stock
            product.stock -= quantity
        else:
            return jsonify({'error': f'Insufficient stock for {product.name}'}), 400
    
    # Create order (in a real app, you'd get user_id from authentication)
    order = Order(
        user_id=1,  # Default user for demo
        total_amount=total,
        shipping_address=data.get('shipping_address', '')
    )
    db.session.add(order)
    db.session.flush()  # Get the order ID
    
    # Create order items
    for item_data in order_items:
        order_item = OrderItem(
            order_id=order.id,
            **item_data
        )
        db.session.add(order_item)
    
    db.session.commit()
    
    # Clear cart
    session['cart'] = {}
    
    return jsonify({
        'message': 'Order created successfully',
        'order_id': order.id,
        'total': total
    })

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get_or_404(order_id)
    order_items = OrderItem.query.filter_by(order_id=order_id).all()
    
    items = []
    for item in order_items:
        product = Product.query.get(item.product_id)
        items.append({
            'product_name': product.name,
            'quantity': item.quantity,
            'price': item.price,
            'total': item.quantity * item.price
        })
    
    return jsonify({
        'id': order.id,
        'total_amount': order.total_amount,
        'status': order.status,
        'shipping_address': order.shipping_address,
        'created_at': order.created_at.isoformat(),
        'items': items
    })

@app.route('/api/reviews/<int:product_id>', methods=['GET'])
def get_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).all()
    return jsonify([{
        'id': r.id,
        'rating': r.rating,
        'comment': r.comment,
        'created_at': r.created_at.isoformat()
    } for r in reviews])

@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.get_json()
    review = Review(
        product_id=data.get('product_id'),
        user_id=1,  # Default user for demo
        rating=data.get('rating'),
        comment=data.get('comment', '')
    )
    db.session.add(review)
    
    # Update product rating
    product = Product.query.get(data.get('product_id'))
    if product:
        all_reviews = Review.query.filter_by(product_id=data.get('product_id')).all()
        total_rating = sum(r.rating for r in all_reviews) + data.get('rating')
        product.rating = total_rating / (len(all_reviews) + 1)
        product.reviews_count = len(all_reviews) + 1
    
    db.session.commit()
    return jsonify({'message': 'Review added successfully'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 