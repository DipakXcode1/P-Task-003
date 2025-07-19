#!/usr/bin/env python3
"""
Startup script for the Local Store E-commerce Backend
"""

import os
import sys
import subprocess

def main():
    print("🚀 Starting Local Store E-commerce Backend...")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('backend/app.py'):
        print("❌ Error: backend/app.py not found!")
        print("Please run this script from the project root directory.")
        sys.exit(1)
    
    # Change to backend directory
    os.chdir('backend')
    
    # Check if requirements are installed
    try:
        import flask
        import flask_cors
        import flask_sqlalchemy
        print("✅ Dependencies are installed")
    except ImportError:
        print("📦 Installing dependencies...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
    
    print("🌐 Starting Flask server on http://localhost:5000")
    print("📊 API Documentation:")
    print("   - GET  /api/products - Get all products")
    print("   - GET  /api/products/<id> - Get specific product")
    print("   - GET  /api/products/search - Search products")
    print("   - GET  /api/cart - Get cart items")
    print("   - POST /api/cart/add - Add item to cart")
    print("   - POST /api/orders - Create new order")
    print("   - GET  /api/reviews/<id> - Get product reviews")
    print("=" * 50)
    print("Press Ctrl+C to stop the server")
    print()
    
    # Start the Flask app
    subprocess.run([sys.executable, 'app.py'])

if __name__ == '__main__':
    main() 