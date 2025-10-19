-- Add missing first_name and last_name columns to users table
ALTER TABLE users ADD COLUMN first_name text;
ALTER TABLE users ADD COLUMN last_name text;