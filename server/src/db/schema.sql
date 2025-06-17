CREATE TABLE IF NOT EXISTS users (
    handle_id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sentiments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    handle_id TEXT,
    sentiment TEXT CHECK(sentiment IN ('GREAT', 'MEH', 'UGH')),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (handle_id) REFERENCES users(handle_id)
); 