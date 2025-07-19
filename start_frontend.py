#!/usr/bin/env python3
"""
Startup script for the Local Store E-commerce Frontend
"""

import os
import sys
import subprocess
import webbrowser
import time

def main():
    print("🌐 Starting Local Store E-commerce Frontend...")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('frontend/index.html'):
        print("❌ Error: frontend/index.html not found!")
        print("Please run this script from the project root directory.")
        sys.exit(1)
    
    # Change to frontend directory
    os.chdir('frontend')
    
    print("📁 Serving frontend from: frontend/")
    print("🌐 Frontend will be available at: http://localhost:5500")
    print("📱 Features available:")
    print("   - Product browsing and search")
    print("   - Shopping cart functionality")
    print("   - Product reviews and ratings")
    print("   - Customer support chat")
    print("   - Responsive design")
    print("=" * 50)
    print("Press Ctrl+C to stop the server")
    print()
    
    # Wait a moment then open browser
    time.sleep(2)
    try:
        webbrowser.open('http://localhost:5500')
        print("✅ Browser opened automatically")
    except:
        print("💡 Please open http://localhost:5500 in your browser")
    
    # Start the HTTP server
    subprocess.run([sys.executable, '-m', 'http.server', '5500'])

if __name__ == '__main__':
    main() 