INSERT INTO user (user_name, user_password, token, is_active, created_by, created_at)
VALUES
  ('admin@example.com', 'hashed_admin', 'token_admin', 1, 1, NOW());