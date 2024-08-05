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
from werkzeug.security import generate_password_hash


# Import create_tables function from models.py to create tables in the database
from models import create_tables

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_print_seva_secret_key'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
app.config['FILE_ALLOWED_EXTENSIONS'] = {'pdf', 'docx', 'txt', 'png', 'jpg', 'jpeg'}
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

# Function to check if the image uploaded is of allowed type or not
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Function to check if the file uploaded is of allowed type or not for user request
def file_allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['FILE_ALLOWED_EXTENSIONS']

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


# Get user details API
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

# Get shopkeeper details API
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



# API to get all shops available
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


def row_to_dict(row):
    return dict(row) if row else {}


@app.route('/api/user/update', methods=['POST'])
@jwt_required()
def update_user():
    current_user = get_jwt_identity()
    email = request.form.get('email', current_user['email'])  # Default to current email if not provided
    name = request.form.get('name')
    contact = request.form.get('contact')
    address = request.form.get('address')
    old_password = request.form.get('old_password')
    new_password = request.form.get('new_password')

    user = query_db('SELECT * FROM user WHERE email = ?', [email], one=True)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update user details
    try:
        if name:
            query_db('UPDATE user SET name = ? WHERE email = ?', [name, email])
        if contact:
            query_db('UPDATE user SET contact = ? WHERE email = ?', [contact, email])
        if address:
            query_db('UPDATE user SET address = ? WHERE email = ?', [address, email])
        if old_password and new_password:
            if bcrypt.check_password_hash(user['password'], old_password):
                hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
                query_db('UPDATE user SET password = ? WHERE email = ?', [hashed_password, email])
            else:
                return jsonify({"error": "Old password is incorrect"}), 400
        if 'profile_image' in request.files:
            profile_image = request.files['profile_image']
            if profile_image and allowed_file(profile_image.filename):
                filename = secure_filename(profile_image.filename)
                profile_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                profile_image.save(profile_image_path)
                os.chmod(profile_image_path, 0o644)
                query_db('UPDATE user SET profile_image = ? WHERE email = ?', [profile_image_path, email])
            else:
                return jsonify({'error': 'Invalid file type for profile image'}), 400

        # Fetch updated user data
        updated_user = query_db('SELECT * FROM user WHERE email = ?', [email], one=True)
        if updated_user:
            user_data = {
                'user_id': updated_user['user_id'],
                'email': updated_user['email'],
                'name': updated_user['name'],
                'profile_image': url_for('uploaded_file', filename=os.path.basename(updated_user['profile_image']), _external=True) if updated_user['profile_image'] else None,
                'contact': updated_user['contact'],
                'address': updated_user['address']
            }
            return jsonify({"message": "User updated successfully", "user": user_data}), 200
    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({"error": "An error occurred while updating user"}), 500

    return jsonify({"message": "User updated successfully"}), 200


@app.route('/api/shopkeeper/update', methods=['POST'])
@jwt_required()
def update_shopkeeper():
    current_user = get_jwt_identity()
    email = request.form.get('email', current_user['email'])  # Default to current email if not provided
    name = request.form.get('name')
    contact = request.form.get('contact')
    address = request.form.get('address')
    shop_name = request.form.get('shop_name')
    cost_single_side = request.form.get('cost_single_side')
    cost_both_sides = request.form.get('cost_both_sides')
    old_password = request.form.get('old_password')
    new_password = request.form.get('new_password')

    shopkeeper = query_db('SELECT * FROM shopkeeper WHERE email = ?', [email], one=True)
    if not shopkeeper:
        return jsonify({"error": "Shopkeeper not found"}), 404

    # Update shopkeeper details
    try:
        if name:
            query_db('UPDATE shopkeeper SET name = ? WHERE email = ?', [name, email])
        if contact:
            query_db('UPDATE shopkeeper SET contact = ? WHERE email = ?', [contact, email])
        if address:
            query_db('UPDATE shopkeeper SET address = ? WHERE email = ?', [address, email])
        if shop_name:
            query_db('UPDATE shopkeeper SET shop_name = ? WHERE email = ?', [shop_name, email])
        if cost_single_side:
            query_db('UPDATE shopkeeper SET cost_single_side = ? WHERE email = ?', [cost_single_side, email])
        if cost_both_sides:
            query_db('UPDATE shopkeeper SET cost_both_sides = ? WHERE email = ?', [cost_both_sides, email])
        if old_password and new_password:
            if bcrypt.check_password_hash(shopkeeper['password'], old_password):
                hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
                query_db('UPDATE shopkeeper SET password = ? WHERE email = ?', [hashed_password, email])
            else:
                return jsonify({"error": "Old password is incorrect"}), 400
        if 'shop_image' in request.files:
            shop_image = request.files['shop_image']
            if shop_image and allowed_file(shop_image.filename):
                filename = secure_filename(shop_image.filename)
                shop_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                shop_image.save(shop_image_path)
                os.chmod(shop_image_path, 0o644)
                query_db('UPDATE shopkeeper SET shop_image = ? WHERE email = ?', [shop_image_path, email])
            else:
                return jsonify({'error': 'Invalid file type for shop image'}), 400

        # Fetch updated shopkeeper data
        updated_shopkeeper = query_db('SELECT * FROM shopkeeper WHERE email = ?', [email], one=True)
        if updated_shopkeeper:
            shopkeeper_data = {
                'shopkeeper_id': updated_shopkeeper['shopkeeper_id'],
                'name': updated_shopkeeper['name'],
                'email': updated_shopkeeper['email'],
                'shop_name': updated_shopkeeper['shop_name'],
                'address': updated_shopkeeper['address'],
                'contact': updated_shopkeeper['contact'],
                'shop_image': url_for('uploaded_file', filename=os.path.basename(updated_shopkeeper['shop_image']), _external=True) if updated_shopkeeper['shop_image'] else None,
                'cost_single_side': updated_shopkeeper['cost_single_side'],
                'cost_both_sides': updated_shopkeeper['cost_both_sides']
            }
            return jsonify({"message": "Shopkeeper updated successfully", "shopkeeper": shopkeeper_data}), 200
    except Exception as e:
        print(f"Error updating shopkeeper: {e}")
        return jsonify({"error": "An error occurred while updating shopkeeper"}), 500

    return jsonify({"message": "Shopkeeper updated successfully"}), 200

#API to store user request data
@app.route('/api/user_request', methods=['POST'])
@jwt_required()
def create_user_request():
    current_user = get_jwt_identity()
    
    # Check if a file is included in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file_allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
    else:
        return jsonify({'error': 'File type not allowed'}), 400

    user = query_db('SELECT user_id FROM user WHERE email = ?', [current_user['email']], one=True)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    user_id = user['user_id']
    
    shop_name = request.form.get('shop_name')
    shop = query_db('SELECT shopkeeper_id FROM shopkeeper WHERE shop_name = ?', [shop_name], one=True)
    if not shop:
        return jsonify({'error': 'Shop not found'}), 404
    
    shop_id = shop['shopkeeper_id']

    # Extracting and validating request.form from form
    total_pages = request.form.get('total_pages')
    print_type = request.form.get('print_type')
    print_side = request.form.get('print_side')
    page_size = request.form.get('page_size')
    copies = request.form.get('no_of_copies')
    comments = request.form.get('comments')

    # Check if all required fields are provided
    if not all([total_pages, print_type, print_side, page_size, copies, shop_id, file_path]):
        return jsonify({'error': 'Please provide all required fields'}), 400

    try:
        conn = sqlite3.connect('print_seva.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO user_request (user_id, total_pages, print_type, print_side, page_size, no_of_copies, shop_id, file_path, sender_email, status, request_time, update_time, comments)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?)
        ''', (user_id, total_pages, print_type, print_side, page_size, copies, shop_id, file_path, current_user['email'], datetime.datetime.now(), datetime.datetime.now(), comments))
        conn.commit()
        conn.close()
    except sqlite3.IntegrityError as e:
        return jsonify({"error": "Failed to create request", "details": str(e)}), 400

    return jsonify({"message": "User request created successfully"}), 201


# Get User Requests API
@app.route('/api/user_request', methods=['GET'])
@jwt_required()
def get_user_requests():
    current_user = get_jwt_identity()
    user_id = query_db('SELECT user_id FROM user WHERE email = ?', [current_user['email']], one=True)['user_id']
    
    requests = query_db('SELECT * FROM user_request WHERE user_id = ?', [user_id])
    request_list = []
    
    for req in requests:
        request_list.append({
            'id': req['id'],
            'total_pages': req['total_pages'],
            'print_type': req['print_type'],
            'print_side': req['print_side'],
            'page_size': req['page_size'],
            'copies': req['copies'],
            'shop_id': req['shop_id'],
            'file_path': req['file_path'],
            'email': req['email'],
            'status': req['status'],
            'request_time': req['request_time'],
            'update_time': req['update_time'],
            'comments': req['comments']
        })
    
    return jsonify(request_list), 200

# Update User Request API
@app.route('/api/user_request/<int:request_id>', methods=['PUT'])
@jwt_required()
def update_user_request(request_id):
    data = request.get_json()
    status = data.get('status')
    comments = data.get('comments')

    try:
        conn = sqlite3.connect('print_seva.db')
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE user_request
            SET status = ?, comments = ?, update_time = ?
            WHERE id = ?
        ''', (status, comments, datetime.datetime.now(), request_id))
        conn.commit()
        conn.close()
    except sqlite3.IntegrityError as e:
        return jsonify({"error": "Failed to update request", "details": str(e)}), 400

    return jsonify({"message": "User request updated successfully"}), 200

# Delete User Request API
@app.route('/api/user_request/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_user_request(request_id):
    try:
        conn = sqlite3.connect('print_seva.db')
        cursor = conn.cursor()
        cursor.execute('DELETE FROM user_request WHERE id = ?', [request_id])
        conn.commit()
        conn.close()
    except sqlite3.IntegrityError as e:
        return jsonify({"error": "Failed to delete request", "details": str(e)}), 400

    return jsonify({"message": "User request deleted successfully"}), 200


# File Upload API
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# Run the Flask app on default port 5000 
if __name__ == '__main__':
    app.run(debug=True)