# 💊 AJIVA Pharmacy POS

A **Web-Based Point of Sale System** built for small and growing pharmacy businesses in the Philippines. Designed to work like TGP (The Generics Pharmacy) POS but for privately-owned pharmacies.

> Built by **James Brian Villar** with assistance from Claude AI (Anthropic)

---

## 🌐 Live Demo
Deploy for free on [Netlify](https://netlify.com) or [GitHub Pages](https://pages.github.com)

---

## ✨ Features

### 🏪 Multi-Branch Support
- Add unlimited branches (AJIVA Main, AJIVA BGC, etc.)
- Each branch has its own inventory, sales, and reports
- Branch-restricted login for cashiers

### 💰 Cashiering (POS)
- Product catalog with category tabs
- Add to cart, adjust quantity, apply discounts
- Cash payment with numpad (₱100/200/500/1000)
- Auto-compute change
- Official Receipt with OR number

### 📦 Inventory Management
- Add, edit, delete products
- Stock levels with low stock alerts
- Expiry date tracking
- Printable inventory report

### 📊 Sales Reports
- Sales Summary (7 days / 30 days)
- Daily Sales Report
- Transaction History with date range filter
- All reports are printable

### 🕐 Shift / End of Day (EOD)
- Open shift with opening cash
- Live shift tracker (sales so far, expected cash)
- Close shift with cash count & variance
- Printable Z-Reading / EOD Report

### 🔄 Refund Entry
- Search by OR number
- Select items and quantity to refund
- Automatic stock restoration
- Printable refund receipt

### 🔍 Price Inquiry (PLU)
- Quick product price lookup
- Search by name or generic name
- Big price display for customer-facing use

### 🚚 Incoming Stock
- Record deliveries with supplier info
- Pending / Received / Partial status
- Auto-updates stock on receive

### 🔔 Alerts & Notifications
- Expiry alerts (60 days warning)
- Low stock alerts
- Alert badge counter on nav

### 👥 User Management (Admin)
- Create cashier accounts with username & password
- Assign cashiers to specific branches
- Enable / disable accounts
- Change passwords

### 🚫 Void Transactions
- Void any transaction with reason
- Auto-restores stock quantities

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Structure |
| **CSS3** | Styling & responsive design |
| **Vanilla JavaScript** | Logic & interactivity |
| **Supabase** | Free PostgreSQL database |
| **Tabler Icons** | Icons |

> No frameworks, no build tools — just one HTML file!

---

## 🗄️ Database Schema (Supabase)

```sql
-- Products (per branch)
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

-- Transactions
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

-- Transaction Items
CREATE TABLE transaction_items (
  id bigserial PRIMARY KEY,
  transaction_id bigint REFERENCES transactions(id),
  product_id bigint,
  product_name text,
  price numeric(10,2),
  quantity integer,
  subtotal numeric(10,2)
);

-- Branches
CREATE TABLE branches (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  address text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Users (Cashiers)
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
```

---

## 🚀 Setup Guide

### Step 1 — Supabase (Free Database)
1. Go to [supabase.com](https://supabase.com) → Sign up → Create project
2. Go to **SQL Editor** → paste and run the schema above
3. Go to **Settings → API** → copy your **Project URL** and **anon key**

### Step 2 — Run the POS
1. Download `ajiva_pharmacy_pos.html`
2. Open in any browser (Chrome recommended)
3. Enter your Supabase URL and anon key
4. Click **Connect & Save**

### Step 3 — First Login
- Username: `admin`
- Password: `admin123`
- ⚠️ Change the admin password after first login!

### Step 4 — Deploy Free
- **Netlify**: Drag and drop the HTML file → get a free URL
- **GitHub Pages**: Upload to repo → enable Pages in Settings

---

## 📱 Mobile Support
Fully responsive — works on phones, tablets, and desktops.
- Hamburger menu on mobile
- Bottom navigation bar
- Touch-friendly numpad

---

## 👨‍💻 Developer

**James Brian Villar**
- GitHub: [@ijbry](https://github.com/ijbry)
- Built for: AJIVA Pharmacy, Philippines 🇵🇭

---

## 📄 License
This project is for personal/client use. Feel free to study and learn from the code!
