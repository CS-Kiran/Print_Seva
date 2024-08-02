import datetime
from flask import Flask, request, jsonify, send_from_directory, url_for
from flask_bcrypt import Bcrypt

# JWT Manager for handling JWT tokens for user authentication
from flask_jwt_extended import JWTManager, create_access_token, get_jwt, jwt_required, get_jwt_identity
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

# In-memory storage for blacklisted tokens
blacklist = set()

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

@app.route('/login/user', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = query_db('SELECT * FROM user WHERE email = ?', [email], one=True)
    
    if user and bcrypt.check_password_hash(user['password'], password):
        token = create_access_token(identity={'email': user['email']})

        user_data = {
            'user_id': user['user_id'],
            'email': user['email'],
            'name': user['name'],
            'profile_image': user['profile_image']
        }

        return jsonify({'message': 'Login successful', 'token': token, 'user': user_data}), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

# login_shopkeeper API
@app.route('/login/shopkeeper', methods=['POST'])
def login_shopkeeper():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    shopkeeper = query_db('SELECT * FROM shopkeeper WHERE email = ?', [email], one=True)
    if shopkeeper and bcrypt.check_password_hash(shopkeeper['password'], password):
        token = create_access_token(identity={'email': shopkeeper['email']})
        
        shopkeeper_data = {
            'shopkeeper_id': shopkeeper['shopkeeper_id'],
            'email': shopkeeper['email'],
            'name': shopkeeper['name'],
            'shop_image': shopkeeper['shop_image']
        }     

        return jsonify({'message': 'Login successful', 'token': token, 'user': shopkeeper_data}), 200
    return jsonify({"error": "Invalid credentials"}), 401


@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user = get_jwt_identity()
    if current_user:
        user = query_db('SELECT * FROM user WHERE email = ?', [current_user['email']], one=True)
        if user:
            user_data = {
                'user_id': user['user_id'],
                'email': user['email'],
                'name': user['name'],
                'profile_image': url_for('uploaded_file', filename=os.path.basename(user['profile_image']), _external=True) if user['profile_image'] else None,
                'contact': user['contact'],
                'address': user['address']
            }
            return jsonify(user_data), 200
    return jsonify({"error": "User not found"}), 404


@app.route('/api/shopkeeper', methods=['GET'])
@jwt_required()
def get_shopkeeper():
    current_user = get_jwt_identity()
    shopkeeper = query_db('SELECT * FROM shopkeeper WHERE email = ?', [current_user['email']], one=True)
    if shopkeeper:
        shopkeeper_data = {
            'shopkeeper_id': shopkeeper['shopkeeper_id'],
            'name': shopkeeper['name'],
            'email': shopkeeper['email'],
            'shop_name': shopkeeper['shop_name'],
            'address': shopkeeper['address'],
            'contact': shopkeeper['contact'],
            'shop_image': url_for('uploaded_file', filename=os.path.basename(shopkeeper['shop_image']), _external=True) if shopkeeper['shop_image'] else None,
            'cost_single_side': shopkeeper['cost_single_side'],
            'cost_both_sides': shopkeeper['cost_both_sides']
        }
        return jsonify(shopkeeper_data), 200
    return jsonify({"error": "Shopkeeper not found"}), 404



# api to view all shops available
@app.route('/api/shops', methods=['GET'])
def get_shops():
    shops = query_db('SELECT * FROM shopkeeper')
    shop_list = []
    
    for shop in shops:
        shop_dict = {
            'shopkeeper_id': shop['shopkeeper_id'],
            'shop_name': shop['shop_name'],
            'address': shop['address'],
            'shop_image': url_for('uploaded_file', filename=os.path.basename(shop['shop_image']), _external=True) if shop['shop_image'] else None,
            'name': shop['name'],
            'cost_single_side': shop['cost_single_side'],
            'cost_both_sides': shop['cost_both_sides']
        }
        shop_list.append(shop_dict)

    return jsonify(shop_list), 200


# Check if a token has been blacklisted
@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in blacklist

# Logout route to blacklist the token
@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"message": "Logout successful"}), 200

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