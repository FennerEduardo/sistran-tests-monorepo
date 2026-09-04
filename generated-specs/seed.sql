-- Generated Seed SQL Fixtures for PostgreSQL / MySQL
-- Feature: User Authentication & Token Issuance

INSERT INTO user_authentication___token_issuance (id, email, password, a, message)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479', 'test', 'test', 'test', 'test'
) ON CONFLICT (id) DO NOTHING;
