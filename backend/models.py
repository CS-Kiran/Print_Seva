import sqlite3


def create_tables():
    conn = sqlite3.connect('print_seva.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            profile_image TEXT,
            contact TEXT UNIQUE,
            address TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS shopkeeper (
            shopkeeper_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            shop_name TEXT NOT NULL,
            address TEXT NOT NULL,
            contact TEXT UNIQUE,
            shop_image TEXT,
            cost_single_side FLOAT,
            cost_both_sides FLOAT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_roles (
            email TEXT NOT NULL UNIQUE,
            role TEXT NOT NULL,
            user_id INTEGER,
            shopkeeper_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (shopkeeper_id) REFERENCES shopkeepers(shopkeeper_id)
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_request (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_pages INTEGER,
            print_type TEXT,
            print_side TEXT,
            page_size TEXT,
            copies INTEGER,
            shop TEXT,
            file_name TEXT,
            email TEXT UNIQUE,
            status TEXT DEFAULT 'Pending',
            action TEXT DEFAULT 'Pending',
            request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()
