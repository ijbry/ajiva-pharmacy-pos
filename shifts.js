-- ================================================
-- AJIVA Pharmacy POS - Database Schema
-- Author: James Brian Villar
-- Database: Supabase (PostgreSQL)
-- Run this in Supabase SQL Editor
-- ================================================

-- Products table (per branch)
CREATE TABLE products (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  generic text,
  category text,
  price numeric(10,2) DEFAULT 0,
  stock integer DEFAULT 0,
  low_stock_alert integer DEFAULT 10,
  expiry_date date,
  branch_id bigint,
  branch_name text,
  created_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE transactions (
  id bigserial PRIMARY KEY,
  or_number text UNIQUE,
  cashier text,
  subtotal numeric(10,2),
  discount numeric(10,2) DEFAULT 0,
  total numeric(10,2),
  tendered numeric(10,2),
  change_amount numeric(10,2),
  branch_id bigint,
  branch_name text,
  created_at timestamptz DEFAULT now()
);

-- Transaction items table
CREATE TABLE transaction_items (
  id bigserial PRIMARY KEY,
  transaction_id bigint REFERENCES transactions(id),
  product_id bigint,
  product_name text,
  price numeric(10,2),
  quantity integer,
  subtotal numeric(10,2)
);

-- Branches table
CREATE TABLE branches (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  address text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- POS Users table (cashiers)
CREATE TABLE pos_users (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'cashier',
  branch_id bigint,
  branch_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now - use anon key)
CREATE POLICY "public_all_products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_tx_items" ON transaction_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_branches" ON branches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_pos_users" ON pos_users FOR ALL USING (true) WITH CHECK (true);

-- Insert default main branch
INSERT INTO branches (name, code, address, is_active)
VALUES ('AJIVA Main Branch', 'MAIN', '', true);
