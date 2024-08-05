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
            FOREIGN KEY (user_id) REFERENCES user(user_id),
            FOREIGN KEY (shopkeeper_id) REFERENCES shopkeeper(shopkeeper_id)
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_request (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_pages INTEGER,
            print_type TEXT,
            print_side TEXT,
            page_size TEXT,
            no_of_copies INTEGER,
            shop_id INTEGER,
            file_path TEXT,
            sender_email TEXT,
            status TEXT DEFAULT 'Pending',
            action TEXT DEFAULT 'Pending',
            request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            comments TEXT,
            FOREIGN KEY (user_id) REFERENCES user(user_id),
            FOREIGN KEY (shop_id) REFERENCES shopkeeper(shopkeeper_id)
        )
    ''')

    # Adding indexes for optimization
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_request_user_id ON user_request(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_request_shop_id ON user_request(shop_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_request_status ON user_request(status)')
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    create_tables()
