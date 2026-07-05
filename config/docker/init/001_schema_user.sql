CREATE TABLE IF NOT EXISTS user(
    id_user INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    token TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_by INT,
    deleted_at TIMESTAMP
);
