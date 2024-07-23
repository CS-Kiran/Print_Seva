from flask import Flask, request, jsonify, send_from_directory
from flask_bcrypt import Bcrypt

# JWT Manager for handling JWT tokens for user authentication
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import sqlite3
import os

# Secure filename to prevent path traversal attacks
from werkzeug.utils import secure_filename

# Import create_tables function from models.py to create tables in the database
from models import create_tables

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_print_seva_secret_key'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

# Create uploads directory if it doesn't exist
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Create tables if they don't exist in the database, structure is defined in models.py file
create_tables()

# Function to check if the file uploaded is of allowed type or not
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Function to query the database and return the results as a dictionary object or a list of dictionary objects.
def query_db(query, args=(), one=False):
    conn = sqlite3.connect('print_seva.db')
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    conn.commit()
    conn.close()
    return (rv[0] if rv else None) if one else rv

# User Registration API
@app.route('/register/user', methods=['POST'])
def register_user():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')
    
    if not name or not email or not password:
        return jsonify({'error': 'Please fill in all required fields'}), 400

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400
    
    # Hash the password before storing it in the database
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Save profile image if uploaded by user and store the path in the database
    if 'profile_image' in request.files:
        profile_image = request.files['profile_image']
        if profile_image and allowed_file(profile_image.filename):
            filename = secure_filename(profile_image.filename)
            profile_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            profile_image.save(profile_image_path)
            os.chmod(profile_image_path, 0o644)
        else:
            return jsonify({'error': 'Invalid file type for profile image'}), 400
    else:
        profile_image_path = None

    # Check if email already exists in the database and return an error if it does
    try:
        conn = sqlite3.connect('print_seva.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM user_roles WHERE email = ?", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already registered"}), 400

        # Insert user details into the database
        cursor.execute('''
            INSERT INTO user (name, email, password, profile_image)
            VALUES (?, ?, ?, ?)
        ''', (name, email, hashed_password, profile_image_path))
        
        # Get the user_id of the user that was just inserted
        user_id = cursor.lastrowid

        cursor.execute('''
            INSERT INTO user_roles (email, role, user_id)
            VALUES (?, 'user', ?)
        ''', (email, user_id))
        conn.commit()
        conn.close()

    # Return an error if the email is already registered
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already registered"}), 400

    return jsonify({"message": "User registered successfully"}), 201

# Shopkeeper Registration API
@app.route('/register/shopkeeper', methods=['POST'])
def register_shopkeeper():
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirmPassword')
    shop_name = request.form.get('shopName')
    address = request.form.get('shopAddress')
    contact = request.form.get('contact')
    cost_single_side = request.form.get('costSingleSide')
    cost_both_sides = request.form.get('costBothSide')
    
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    # Hash the password before storing it in the database
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Save shop image if uploaded by shopkeeper and store the path in the database
    if 'shop_image' in request.files:
        shop_image = request.files['shop_image']
        if shop_image and allowed_file(shop_image.filename):
            filename = secure_filename(shop_image.filename)
            shop_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            shop_image.save(shop_image_path)
            os.chmod(shop_image_path, 0o644)
        else:
            return jsonify({'error': 'Invalid file type for shop image'}), 400
    else:
        shop_image_path = None

    # Check if email already exists in the database and return an error if it does
    try:
        conn = sqlite3.connect('print_seva.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM user_roles WHERE email = ?", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already registered"}), 400

        # Insert shopkeeper details into the database
        cursor.execute('''
            INSERT INTO shopkeeper (name, email, password, shop_name, address, contact, shop_image, cost_single_side, cost_both_sides)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (name, email, hashed_password, shop_name, address, contact, shop_image_path, cost_single_side, cost_both_sides))
        
        # Get the shopkeeper_id of the shopkeeper that was just inserted
        shopkeeper_id = cursor.lastrowid

        cursor.execute('''
            INSERT INTO user_roles (email, role, shopkeeper_id)
            VALUES (?, 'shopkeeper', ?)
        ''', (email, shopkeeper_id))
        conn.commit()
        conn.close()

    # Return an error if the email is already registered
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already registered"}), 400

    return jsonify({"message": "Shopkeeper registered successfully"}), 201


# User Login API
@app.route('/login/user', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    # Query the database to check if the user exists and the password is correct
    user = query_db('SELECT * FROM user WHERE email = ?', [email], one=True)
    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity={'id': user['user_id'], 'email': user['email']})
        return jsonify({"token": access_token, "message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401


# Shopkeeper Login API
@app.route('/login/shopkeeper', methods=['POST'])
def login_shopkeeper():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    # Query the database to check if the shopkeeper exists and the password is correct
    shopkeeper = query_db('SELECT * FROM shopkeeper WHERE email = ?', [email], one=True)
    if shopkeeper and bcrypt.check_password_hash(shopkeeper['password'], password):
        access_token = create_access_token(identity={'id': shopkeeper['shopkeeper_id'], 'email': shopkeeper['email']})
        return jsonify({"token": access_token, "message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401


# Dashboard API
@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    # Get the current user from the JWT token and return it as a response
    current_user = get_jwt_identity()
    return jsonify({"message": "Welcome to the dashboard", "user": current_user}), 200

# File Upload API
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Run the Flask app on default port 5000 
if __name__ == '__main__':
    app.run(debug=True)