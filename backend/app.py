from flask import Flask, request, jsonify, send_from_directory
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import sqlite3
import os
from werkzeug.utils import secure_filename
from models import create_tables

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_print_seva_secret_key'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

create_tables()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def query_db(query, args=(), one=False):
    conn = sqlite3.connect('print_seva.db')  # Ensure the database file is correctly referenced
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    conn.commit()
    conn.close()
    return (rv[0] if rv else None) if one else rv

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

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    if 'profile_image' in request.files:
        profile_image = request.files['profile_image']
        if profile_image and allowed_file(profile_image.filename):
            filename = secure_filename(profile_image.filename)
            profile_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            profile_image.save(profile_image_path)
            os.chmod(profile_image_path, 0o644)  # Set correct permissions
        else:
            return jsonify({'error': 'Invalid file type for profile image'}), 400
    else:
        profile_image_path = None

    try:
        query_db(
            'INSERT INTO user (name, email, password, profile_image) VALUES (?, ?, ?, ?)', 
            (name, email, hashed_password, profile_image_path)
        )
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already registered"}), 400

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/register/shopkeeper', methods=['POST'])
def register_shopkeeper():
    data = request.form
    name = request.form.get('name')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')
    shop_name = request.form.get('shopName')
    address = request.form.get('shopAddress')
    contact = request.form.get('contact')
    cost_single_side = request.form.get('costSingleSide')
    cost_both_sides = request.form.get('costBothSide')
    
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    if 'shop_image' in request.files:
        shop_image = request.files['shop_image']
        if shop_image and allowed_file(shop_image.filename):
            filename = secure_filename(shop_image.filename)
            shop_image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            shop_image.save(shop_image_path)
            os.chmod(shop_image_path, 0o644)  # Set correct permissions
        else:
            return jsonify({'error': 'Invalid file type for shop image'}), 400
    else:
        shop_image_path = None

    try:
        query_db(
            'INSERT INTO shopkeeper (name, email, password, shop_name, address, contact, shop_image, cost_single_side, cost_both_sides) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            (name, email, hashed_password, shop_name, address, contact, shop_image_path, cost_single_side, cost_both_sides)
        )
    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already registered"}), 400

    return jsonify({"message": "Shopkeeper registered successfully"}), 201


@app.route('/login/user', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    user = query_db('SELECT * FROM user WHERE email = ?', [email], one=True)
    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity={'id': user['id'], 'email': user['email']})
        return jsonify({"token": access_token, "message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/login/shopkeeper', methods=['POST'])
def login_shopkeeper():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    shopkeeper = query_db('SELECT * FROM shopkeeper WHERE email = ?', [email], one=True)
    if shopkeeper and bcrypt.check_password_hash(shopkeeper['password'], password):
        access_token = create_access_token(identity={'id': shopkeeper['id'], 'email': shopkeeper['email']})
        return jsonify({"token": access_token, "message": "Login successful"}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    return jsonify({"message": "Welcome to the dashboard", "user": current_user}), 200

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
