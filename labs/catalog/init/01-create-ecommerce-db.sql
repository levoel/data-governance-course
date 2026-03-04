-- =============================================================================
-- Catalog Lab: E-Commerce Sample Database
-- =============================================================================
-- Creates a realistic e-commerce schema with 50+ rows per table for
-- OpenMetadata catalog exercises: metadata discovery, column profiling,
-- tagging, classification, and lineage exploration.
--
-- This script runs automatically on first 'docker compose up' via the
-- PostgreSQL /docker-entrypoint-initdb.d convention.
--
-- Tables: customers, products, orders, order_items
-- Data: Clean, realistic records (this is the catalog lab, not the quality lab)
-- =============================================================================

-- Create the ecommerce database and lab user
-- The OM custom image already creates openmetadata_db; this is separate.
CREATE DATABASE ecommerce;
CREATE USER lab WITH PASSWORD 'lab_password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO lab;

-- Connect to the ecommerce database
\c ecommerce

-- Grant schema permissions to lab user
GRANT ALL ON SCHEMA public TO lab;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lab;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lab;

-- =============================================================================
-- Table: customers
-- =============================================================================
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE customers IS 'Registered e-commerce platform customers with contact information';
COMMENT ON COLUMN customers.customer_id IS 'Auto-incremented unique customer identifier';
COMMENT ON COLUMN customers.email IS 'Unique email address used for account login and notifications';
COMMENT ON COLUMN customers.first_name IS 'Customer first name';
COMMENT ON COLUMN customers.last_name IS 'Customer last name';
COMMENT ON COLUMN customers.phone IS 'Optional phone number in international format';
COMMENT ON COLUMN customers.created_at IS 'Account creation timestamp';
COMMENT ON COLUMN customers.updated_at IS 'Last profile update timestamp';

-- =============================================================================
-- Table: products
-- =============================================================================
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE products IS 'Product catalog with pricing and inventory tracking';
COMMENT ON COLUMN products.product_id IS 'Auto-incremented unique product identifier';
COMMENT ON COLUMN products.name IS 'Product display name';
COMMENT ON COLUMN products.category IS 'Product category (electronics, clothing, books, home, sports)';
COMMENT ON COLUMN products.price IS 'Current retail price in USD, must be positive';
COMMENT ON COLUMN products.stock_quantity IS 'Current units available in warehouse';

-- =============================================================================
-- Table: orders
-- =============================================================================
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount DECIMAL(12, 2) NOT NULL,
    shipping_address TEXT
);

COMMENT ON TABLE orders IS 'Customer purchase orders with status tracking and shipping details';
COMMENT ON COLUMN orders.order_id IS 'Auto-incremented unique order identifier';
COMMENT ON COLUMN orders.customer_id IS 'Foreign key to customers table';
COMMENT ON COLUMN orders.order_date IS 'Timestamp when order was placed';
COMMENT ON COLUMN orders.status IS 'Order lifecycle status: pending, processing, shipped, delivered, cancelled';
COMMENT ON COLUMN orders.total_amount IS 'Total order value in USD including all items';
COMMENT ON COLUMN orders.shipping_address IS 'Delivery address provided by customer';

-- =============================================================================
-- Table: order_items
-- =============================================================================
CREATE TABLE order_items (
    item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id),
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL
);

COMMENT ON TABLE order_items IS 'Individual line items within each order, linking orders to products';
COMMENT ON COLUMN order_items.item_id IS 'Auto-incremented unique line item identifier';
COMMENT ON COLUMN order_items.order_id IS 'Foreign key to orders table';
COMMENT ON COLUMN order_items.product_id IS 'Foreign key to products table';
COMMENT ON COLUMN order_items.quantity IS 'Number of units ordered, must be positive';
COMMENT ON COLUMN order_items.unit_price IS 'Price per unit at time of purchase (may differ from current product price)';

-- =============================================================================
-- Indexes
-- =============================================================================
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_customers_email ON customers(email);

-- =============================================================================
-- Sample Data: customers (60 rows)
-- =============================================================================
INSERT INTO customers (email, first_name, last_name, phone) VALUES
    ('ivan.petrov@example.com', 'Ivan', 'Petrov', '+7-495-100-0001'),
    ('maria.sidorova@example.com', 'Maria', 'Sidorova', '+7-495-100-0002'),
    ('alex.kozlov@example.com', 'Alexander', 'Kozlov', '+7-495-100-0003'),
    ('elena.volkova@example.com', 'Elena', 'Volkova', '+7-495-100-0004'),
    ('dmitry.morozov@example.com', 'Dmitry', 'Morozov', '+7-495-100-0005'),
    ('anna.kuznetsova@example.com', 'Anna', 'Kuznetsova', '+7-495-100-0006'),
    ('sergey.novikov@example.com', 'Sergey', 'Novikov', '+7-495-100-0007'),
    ('olga.fedorova@example.com', 'Olga', 'Fedorova', '+7-495-100-0008'),
    ('andrey.sokolov@example.com', 'Andrey', 'Sokolov', '+7-495-100-0009'),
    ('natalia.popova@example.com', 'Natalia', 'Popova', '+7-495-100-0010'),
    ('mikhail.lebedev@example.com', 'Mikhail', 'Lebedev', '+7-812-200-0011'),
    ('tatiana.smirnova@example.com', 'Tatiana', 'Smirnova', '+7-812-200-0012'),
    ('pavel.ivanov@example.com', 'Pavel', 'Ivanov', '+7-812-200-0013'),
    ('ekaterina.vasileva@example.com', 'Ekaterina', 'Vasileva', '+7-812-200-0014'),
    ('nikolai.petrov@example.com', 'Nikolai', 'Petrov', '+7-812-200-0015'),
    ('yulia.andreeva@example.com', 'Yulia', 'Andreeva', '+7-812-200-0016'),
    ('vladimir.karpov@example.com', 'Vladimir', 'Karpov', '+7-812-200-0017'),
    ('svetlana.orlova@example.com', 'Svetlana', 'Orlova', '+7-812-200-0018'),
    ('roman.makarov@example.com', 'Roman', 'Makarov', '+7-383-300-0019'),
    ('irina.egorova@example.com', 'Irina', 'Egorova', '+7-383-300-0020'),
    ('konstantin.zaytsev@example.com', 'Konstantin', 'Zaytsev', '+7-383-300-0021'),
    ('marina.pavlova@example.com', 'Marina', 'Pavlova', '+7-383-300-0022'),
    ('oleg.semenov@example.com', 'Oleg', 'Semenov', '+7-343-400-0023'),
    ('daria.golubeva@example.com', 'Daria', 'Golubeva', '+7-343-400-0024'),
    ('artem.vinogradov@example.com', 'Artem', 'Vinogradov', '+7-343-400-0025'),
    ('anastasia.bogdanova@example.com', 'Anastasia', 'Bogdanova', '+7-343-400-0026'),
    ('denis.kiselev@example.com', 'Denis', 'Kiselev', '+7-846-500-0027'),
    ('polina.medvedeva@example.com', 'Polina', 'Medvedeva', '+7-846-500-0028'),
    ('evgeny.nikolaev@example.com', 'Evgeny', 'Nikolaev', '+7-846-500-0029'),
    ('vera.stepanova@example.com', 'Vera', 'Stepanova', '+7-846-500-0030'),
    ('maxim.frolov@example.com', 'Maxim', 'Frolov', '+7-861-600-0031'),
    ('alina.tarasova@example.com', 'Alina', 'Tarasova', '+7-861-600-0032'),
    ('georgy.belov@example.com', 'Georgy', 'Belov', '+7-861-600-0033'),
    ('kseniya.guseva@example.com', 'Kseniya', 'Guseva', '+7-861-600-0034'),
    ('ilya.romanov@example.com', 'Ilya', 'Romanov', '+7-831-700-0035'),
    ('valeria.komarova@example.com', 'Valeria', 'Komarova', '+7-831-700-0036'),
    ('timur.kovalev@example.com', 'Timur', 'Kovalev', '+7-831-700-0037'),
    ('lyudmila.shcherbakova@example.com', 'Lyudmila', 'Shcherbakova', '+7-831-700-0038'),
    ('viktor.baranov@example.com', 'Viktor', 'Baranov', '+7-863-800-0039'),
    ('kristina.alekseeva@example.com', 'Kristina', 'Alekseeva', '+7-863-800-0040'),
    ('stanislav.sorokin@example.com', 'Stanislav', 'Sorokin', '+7-863-800-0041'),
    ('yana.kudryavtseva@example.com', 'Yana', 'Kudryavtseva', '+7-863-800-0042'),
    ('boris.grigoriev@example.com', 'Boris', 'Grigoriev', '+7-351-900-0043'),
    ('nadezhda.lazareva@example.com', 'Nadezhda', 'Lazareva', '+7-351-900-0044'),
    ('fedor.titov@example.com', 'Fedor', 'Titov', '+7-351-900-0045'),
    ('larisa.nikonova@example.com', 'Larisa', 'Nikonova', '+7-351-900-0046'),
    ('grigory.davydov@example.com', 'Grigory', 'Davydov', '+7-473-110-0047'),
    ('zoya.koroleva@example.com', 'Zoya', 'Koroleva', '+7-473-110-0048'),
    ('leonid.sukhorukov@example.com', 'Leonid', 'Sukhorukov', '+7-473-110-0049'),
    ('galina.voronova@example.com', 'Galina', 'Voronova', '+7-473-110-0050'),
    ('vadim.efimov@example.com', 'Vadim', 'Efimov', '+7-342-120-0051'),
    ('raisa.mironova@example.com', 'Raisa', 'Mironova', '+7-342-120-0052'),
    ('anton.zakharov@example.com', 'Anton', 'Zakharov', '+7-342-120-0053'),
    ('tamara.borisova@example.com', 'Tamara', 'Borisova', '+7-342-120-0054'),
    ('kirill.gerasimov@example.com', 'Kirill', 'Gerasimov', '+7-391-130-0055'),
    ('lyubov.nikiforova@example.com', 'Lyubov', 'Nikiforova', '+7-391-130-0056'),
    ('ruslan.shestakov@example.com', 'Ruslan', 'Shestakov', '+7-391-130-0057'),
    ('sofia.bychkova@example.com', 'Sofia', 'Bychkova', '+7-391-130-0058'),
    ('yaroslav.kulikov@example.com', 'Yaroslav', 'Kulikov', '+7-843-140-0059'),
    ('diana.safonova@example.com', 'Diana', 'Safonova', '+7-843-140-0060');

-- =============================================================================
-- Sample Data: products (55 rows across 5 categories)
-- =============================================================================
INSERT INTO products (name, category, price, stock_quantity) VALUES
    -- Electronics (12 products)
    ('Wireless Bluetooth Headphones', 'electronics', 79.99, 150),
    ('USB-C Hub 7-in-1', 'electronics', 45.99, 200),
    ('Mechanical Keyboard RGB', 'electronics', 129.99, 80),
    ('27-inch 4K Monitor', 'electronics', 449.99, 35),
    ('Wireless Mouse Ergonomic', 'electronics', 34.99, 300),
    ('Portable SSD 1TB', 'electronics', 89.99, 120),
    ('Webcam 1080p HD', 'electronics', 59.99, 95),
    ('Noise-Cancelling Earbuds', 'electronics', 149.99, 60),
    ('Smart Power Strip', 'electronics', 29.99, 180),
    ('Laptop Stand Adjustable', 'electronics', 39.99, 140),
    ('USB Microphone Condenser', 'electronics', 69.99, 75),
    ('Wireless Charging Pad', 'electronics', 24.99, 250),
    -- Clothing (11 products)
    ('Cotton T-Shirt Classic', 'clothing', 19.99, 500),
    ('Denim Jeans Slim Fit', 'clothing', 49.99, 200),
    ('Wool Sweater Crew Neck', 'clothing', 59.99, 120),
    ('Running Shoes Lightweight', 'clothing', 89.99, 90),
    ('Waterproof Jacket', 'clothing', 129.99, 60),
    ('Leather Belt Classic', 'clothing', 29.99, 300),
    ('Cashmere Scarf', 'clothing', 79.99, 45),
    ('Sports Shorts Quick-Dry', 'clothing', 24.99, 350),
    ('Winter Boots Insulated', 'clothing', 119.99, 55),
    ('Silk Tie Business', 'clothing', 39.99, 180),
    ('Hiking Socks Merino Wool', 'clothing', 14.99, 400),
    -- Books (11 products)
    ('Data Governance Handbook', 'books', 49.99, 100),
    ('SQL Performance Explained', 'books', 39.99, 85),
    ('Designing Data-Intensive Applications', 'books', 44.99, 70),
    ('The Art of Statistics', 'books', 24.99, 150),
    ('Clean Code', 'books', 34.99, 130),
    ('Database Internals', 'books', 42.99, 65),
    ('Fundamentals of Data Engineering', 'books', 54.99, 90),
    ('Python for Data Analysis', 'books', 39.99, 110),
    ('The Data Warehouse Toolkit', 'books', 59.99, 50),
    ('Streaming Systems', 'books', 47.99, 40),
    ('Data Quality Fundamentals', 'books', 44.99, 75),
    -- Home (11 products)
    ('Stainless Steel Water Bottle', 'home', 19.99, 400),
    ('Ceramic Coffee Mug Set', 'home', 24.99, 250),
    ('Bamboo Cutting Board', 'home', 29.99, 180),
    ('LED Desk Lamp Dimmable', 'home', 34.99, 160),
    ('Cast Iron Skillet', 'home', 39.99, 100),
    ('Glass Food Storage Set', 'home', 44.99, 90),
    ('Stainless Steel Knife Set', 'home', 79.99, 70),
    ('Cotton Bath Towel Set', 'home', 34.99, 200),
    ('Silicone Baking Mat Set', 'home', 14.99, 300),
    ('French Press Coffee Maker', 'home', 29.99, 150),
    ('Wooden Spice Rack', 'home', 24.99, 120),
    -- Sports (10 products)
    ('Yoga Mat Premium', 'sports', 29.99, 200),
    ('Resistance Bands Set', 'sports', 19.99, 350),
    ('Jump Rope Speed', 'sports', 12.99, 400),
    ('Foam Roller Recovery', 'sports', 24.99, 180),
    ('Kettlebell Adjustable 20kg', 'sports', 89.99, 50),
    ('Water Bottle Sports 750ml', 'sports', 14.99, 500),
    ('Fitness Tracker Band', 'sports', 49.99, 120),
    ('Tennis Racket Pro', 'sports', 129.99, 40),
    ('Swimming Goggles Anti-Fog', 'sports', 19.99, 250),
    ('Bicycle Helmet Safety', 'sports', 59.99, 80);

-- =============================================================================
-- Sample Data: orders (65 rows across various statuses)
-- =============================================================================
INSERT INTO orders (customer_id, order_date, status, total_amount, shipping_address) VALUES
    (1, '2025-01-15 10:30:00', 'delivered', 125.98, 'ul. Tverskaya 15, Moscow 125009'),
    (2, '2025-01-18 14:20:00', 'delivered', 49.99, 'ul. Nevsky pr. 28, St. Petersburg 191186'),
    (3, '2025-01-22 09:15:00', 'delivered', 259.97, 'ul. Lenina 42, Novosibirsk 630099'),
    (4, '2025-02-01 16:45:00', 'delivered', 79.99, 'ul. Pushkina 7, Yekaterinburg 620014'),
    (5, '2025-02-05 11:00:00', 'delivered', 89.99, 'ul. Gagarina 33, Samara 443010'),
    (6, '2025-02-10 13:30:00', 'delivered', 174.97, 'ul. Mira 56, Krasnodar 350000'),
    (7, '2025-02-14 08:45:00', 'delivered', 39.99, 'ul. Sovetskaya 19, Nizhny Novgorod 603155'),
    (8, '2025-02-20 15:10:00', 'delivered', 449.99, 'ul. Kirova 88, Rostov-on-Don 344019'),
    (9, '2025-02-25 10:00:00', 'delivered', 94.98, 'ul. Chelyuskintsev 12, Chelyabinsk 454091'),
    (10, '2025-03-01 12:20:00', 'delivered', 129.99, 'ul. Voroshilova 3, Voronezh 394018'),
    (11, '2025-03-05 09:30:00', 'delivered', 69.98, 'ul. Komsomolskaya 45, Perm 614000'),
    (12, '2025-03-10 14:00:00', 'delivered', 54.98, 'ul. Krasnoyarskaya 21, Krasnoyarsk 660049'),
    (13, '2025-03-15 16:30:00', 'delivered', 199.98, 'ul. Universitetskaya 9, Kazan 420008'),
    (1, '2025-03-20 11:15:00', 'delivered', 89.99, 'ul. Tverskaya 15, Moscow 125009'),
    (14, '2025-03-25 08:00:00', 'delivered', 34.99, 'ul. Bolshaya Morskaya 18, St. Petersburg 190000'),
    (15, '2025-04-01 10:45:00', 'delivered', 159.98, 'ul. Oktyabrskaya 64, St. Petersburg 193231'),
    (16, '2025-04-05 13:20:00', 'delivered', 24.99, 'ul. Lenina 100, Novosibirsk 630004'),
    (17, '2025-04-10 15:00:00', 'delivered', 79.99, 'ul. Malysheva 36, Yekaterinburg 620075'),
    (18, '2025-04-15 09:30:00', 'delivered', 44.99, 'ul. Moskovskaya 22, Samara 443100'),
    (19, '2025-04-20 12:00:00', 'delivered', 134.97, 'ul. Severnaya 11, Krasnodar 350020'),
    (20, '2025-05-01 10:15:00', 'shipped', 269.97, 'ul. Bolshaya Pokrovskaya 8, Nizhny Novgorod 603005'),
    (21, '2025-05-05 14:30:00', 'shipped', 49.99, 'ul. Sadovaya 17, Rostov-on-Don 344006'),
    (22, '2025-05-10 08:45:00', 'shipped', 89.98, 'ul. Sverdlova 30, Chelyabinsk 454080'),
    (23, '2025-05-15 11:00:00', 'shipped', 119.99, 'ul. Plekhanovskaya 47, Voronezh 394006'),
    (24, '2025-05-18 16:20:00', 'shipped', 174.98, 'ul. Kuibysheva 52, Perm 614016'),
    (25, '2025-05-20 09:00:00', 'shipped', 59.99, 'ul. Karla Marksa 93, Krasnoyarsk 660017'),
    (2, '2025-05-22 13:45:00', 'shipped', 44.99, 'ul. Nevsky pr. 28, St. Petersburg 191186'),
    (26, '2025-05-25 10:30:00', 'shipped', 129.99, 'ul. Baumana 68, Kazan 420111'),
    (27, '2025-05-28 15:15:00', 'shipped', 34.98, 'ul. Molodogvardeyskaya 14, Samara 443099'),
    (28, '2025-06-01 08:00:00', 'shipped', 94.98, 'ul. Krasnaya 35, Krasnodar 350004'),
    (29, '2025-06-03 12:30:00', 'processing', 199.98, 'ul. Rozhdestvenskaya 6, Nizhny Novgorod 603001'),
    (30, '2025-06-05 14:00:00', 'processing', 79.99, 'ul. Bolshaya Sadovaya 71, Rostov-on-Don 344002'),
    (3, '2025-06-07 09:15:00', 'processing', 129.99, 'ul. Lenina 42, Novosibirsk 630099'),
    (31, '2025-06-08 11:30:00', 'processing', 54.98, 'ul. Revolyutsii 58, Chelyabinsk 454000'),
    (32, '2025-06-09 16:00:00', 'processing', 89.99, 'ul. Koltsovskaya 9, Voronezh 394000'),
    (33, '2025-06-10 10:45:00', 'processing', 224.97, 'ul. Sibirskaya 23, Perm 614990'),
    (34, '2025-06-11 13:00:00', 'processing', 39.99, 'ul. Lenina 57, Krasnoyarsk 660049'),
    (35, '2025-06-12 08:30:00', 'processing', 149.98, 'ul. Pushkina 44, Kazan 420015'),
    (36, '2025-06-13 15:45:00', 'processing', 69.99, 'ul. Frunze 96, Samara 443010'),
    (37, '2025-06-14 10:00:00', 'processing', 264.97, 'ul. Stavropolskaya 107, Krasnodar 350058'),
    (38, '2025-06-15 12:15:00', 'pending', 159.98, 'ul. Minina 10, Nizhny Novgorod 603155'),
    (39, '2025-06-15 14:30:00', 'pending', 44.99, 'ul. Pushkinskaya 83, Rostov-on-Don 344006'),
    (40, '2025-06-16 09:00:00', 'pending', 89.98, 'ul. Kirova 130, Chelyabinsk 454092'),
    (41, '2025-06-16 11:45:00', 'pending', 74.98, 'ul. Lizyukova 48, Voronezh 394036'),
    (42, '2025-06-17 08:15:00', 'pending', 199.98, 'ul. Kompros 50, Perm 614990'),
    (43, '2025-06-17 10:30:00', 'pending', 129.99, 'ul. Prospekt Mira 78, Krasnoyarsk 660049'),
    (44, '2025-06-18 13:00:00', 'pending', 34.99, 'ul. Kremlevskaya 18, Kazan 420008'),
    (45, '2025-06-18 15:30:00', 'pending', 249.97, 'ul. Tverskaya 15, Moscow 125009'),
    (4, '2025-06-19 09:45:00', 'pending', 59.99, 'ul. Pushkina 7, Yekaterinburg 620014'),
    (46, '2025-06-19 12:00:00', 'pending', 94.98, 'ul. Oktyabrskaya 64, St. Petersburg 193231'),
    (5, '2025-03-12 10:30:00', 'cancelled', 129.99, 'ul. Gagarina 33, Samara 443010'),
    (10, '2025-04-08 14:15:00', 'cancelled', 49.99, 'ul. Voroshilova 3, Voronezh 394018'),
    (15, '2025-04-22 09:00:00', 'cancelled', 89.99, 'ul. Oktyabrskaya 64, St. Petersburg 193231'),
    (20, '2025-05-03 16:30:00', 'cancelled', 174.97, 'ul. Bolshaya Pokrovskaya 8, Nizhny Novgorod 603005'),
    (25, '2025-05-15 11:45:00', 'cancelled', 34.99, 'ul. Karla Marksa 93, Krasnoyarsk 660017'),
    (47, '2025-06-20 08:00:00', 'pending', 79.99, 'ul. Sovetskaya 77, Samara 443041'),
    (48, '2025-06-20 10:15:00', 'pending', 224.97, 'ul. Krasnaya 122, Krasnodar 350063'),
    (49, '2025-06-20 13:30:00', 'pending', 44.99, 'ul. Varvarskaya 32, Nizhny Novgorod 603005'),
    (50, '2025-06-21 09:00:00', 'pending', 159.98, 'ul. Chekhova 55, Rostov-on-Don 344000'),
    (51, '2025-06-21 11:30:00', 'pending', 89.99, 'ul. Truda 27, Chelyabinsk 454091'),
    (52, '2025-06-21 14:00:00', 'pending', 39.99, 'ul. Koltsovskaya 82, Voronezh 394000'),
    (53, '2025-06-22 08:30:00', 'pending', 174.98, 'ul. Ekaterininskaya 65, Perm 614000'),
    (54, '2025-06-22 10:45:00', 'pending', 129.99, 'ul. Dekabristov 31, Krasnoyarsk 660028'),
    (55, '2025-06-22 13:15:00', 'pending', 94.98, 'ul. Gabdully Tukaya 75, Kazan 420021'),
    (56, '2025-06-23 09:00:00', 'pending', 59.99, 'ul. Moskovskoe shosse 17, Samara 443013');

-- =============================================================================
-- Sample Data: order_items (110+ rows linking orders to products)
-- =============================================================================
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
    -- Order 1: headphones + charging pad
    (1, 1, 1, 79.99),
    (1, 9, 1, 29.99),
    (1, 12, 1, 14.99),
    -- Order 2: jeans
    (2, 14, 1, 49.99),
    -- Order 3: monitor + keyboard + mouse
    (3, 4, 1, 449.99),
    (3, 3, 1, 129.99),
    (3, 5, 1, 34.99),
    -- Order 4: cashmere scarf
    (4, 19, 1, 79.99),
    -- Order 5: portable SSD
    (5, 6, 1, 89.99),
    -- Order 6: data governance book + SQL book + clean code
    (6, 23, 1, 49.99),
    (6, 24, 1, 39.99),
    (6, 27, 1, 34.99),
    -- Order 7: silk tie
    (7, 22, 1, 39.99),
    -- Order 8: 4K monitor
    (8, 4, 1, 449.99),
    -- Order 9: yoga mat + resistance bands + jump rope
    (9, 43, 1, 29.99),
    (9, 44, 1, 19.99),
    (9, 45, 1, 12.99),
    -- Order 10: waterproof jacket
    (10, 17, 1, 129.99),
    -- Order 11: desk lamp + water bottle
    (11, 36, 1, 34.99),
    (11, 33, 1, 19.99),
    -- Order 12: designing data-intensive apps + database internals
    (12, 25, 1, 44.99),
    (12, 28, 1, 42.99),
    -- Order 13: mechanical keyboard + earbuds
    (13, 3, 1, 129.99),
    (13, 8, 1, 149.99),
    -- Order 14: running shoes
    (14, 16, 1, 89.99),
    -- Order 15: wireless mouse
    (15, 5, 1, 34.99),
    -- Order 16: winter boots + wool sweater
    (16, 21, 1, 119.99),
    (16, 15, 1, 59.99),
    -- Order 17: stainless water bottle
    (17, 33, 1, 19.99),
    -- Order 18: cashmere scarf
    (18, 19, 1, 79.99),
    -- Order 19: designing data-intensive apps
    (19, 25, 1, 44.99),
    -- Order 20: USB hub + webcam + laptop stand
    (20, 2, 1, 45.99),
    (20, 7, 1, 59.99),
    (20, 10, 1, 39.99),
    -- Order 21: earbuds + keyboard + mouse
    (21, 8, 1, 149.99),
    (21, 3, 1, 129.99),
    (21, 5, 1, 34.99),
    -- Order 22: t-shirt x2 + hiking socks
    (22, 13, 2, 19.99),
    (22, 23, 1, 49.99),
    -- Order 23: running shoes + sports shorts
    (23, 16, 1, 89.99),
    (23, 20, 1, 24.99),
    -- Order 24: winter boots
    (24, 21, 1, 119.99),
    -- Order 25: knife set + cutting board + coffee maker
    (25, 39, 1, 79.99),
    (25, 35, 1, 29.99),
    (25, 42, 1, 29.99),
    -- Order 26: bicycle helmet
    (26, 52, 1, 59.99),
    -- Order 27: python for data analysis
    (27, 30, 1, 39.99),
    -- Order 28: tennis racket
    (28, 50, 1, 129.99),
    -- Order 29: baking mat + coffee mug set
    (29, 41, 1, 14.99),
    (29, 34, 1, 24.99),
    -- Order 30: foam roller + kettlebell
    (30, 46, 1, 24.99),
    (30, 47, 1, 89.99),
    -- Order 31: fundamentals of data engineering + streaming systems
    (31, 29, 1, 54.99),
    (31, 32, 1, 47.99),
    -- Order 32: leather belt + wool sweater
    (32, 18, 1, 29.99),
    (32, 15, 1, 59.99),
    -- Order 33: mechanical keyboard
    (33, 3, 1, 129.99),
    -- Order 34: coffee mug + cutting board
    (34, 34, 1, 24.99),
    (34, 35, 1, 29.99),
    -- Order 35: portable SSD
    (35, 6, 1, 89.99),
    -- Order 36: 4K monitor + USB hub + laptop stand
    (36, 4, 1, 449.99),
    (36, 2, 1, 45.99),
    (36, 10, 1, 39.99),
    -- Order 37: silk tie
    (37, 22, 1, 39.99),
    -- Order 38: earbuds + microphone
    (38, 8, 1, 149.99),
    (38, 11, 1, 69.99),
    -- Order 39: USB microphone
    (39, 11, 1, 69.99),
    -- Order 40: waterproof jacket + running shoes + hiking socks
    (40, 17, 1, 129.99),
    (40, 16, 1, 89.99),
    (40, 23, 1, 49.99),
    -- Order 41: data warehouse toolkit + SQL performance
    (41, 31, 1, 59.99),
    (41, 24, 1, 39.99),
    -- Order 42: designing data-intensive apps
    (42, 25, 1, 44.99),
    -- Order 43: fitness tracker + resistance bands
    (43, 49, 1, 49.99),
    (43, 44, 1, 19.99),
    -- Order 44: glass food storage + cast iron skillet
    (44, 38, 1, 44.99),
    (44, 37, 1, 39.99),
    -- Order 45: keyboard + mouse + charging pad
    (45, 3, 1, 129.99),
    (45, 5, 1, 34.99),
    (45, 12, 1, 24.99),
    -- Order 46: desk lamp + spice rack
    (46, 36, 1, 34.99),
    (46, 43, 1, 24.99),
    -- Order 47: data governance handbook
    (47, 23, 1, 49.99),
    -- Order 48: headphones + earbuds + charging pad
    (48, 1, 1, 79.99),
    (48, 8, 1, 149.99),
    (48, 12, 1, 24.99),
    -- Order 49: swimming goggles + water bottle sport
    (49, 51, 1, 19.99),
    (49, 48, 1, 14.99),
    -- Order 50: webcam + USB hub
    (50, 7, 1, 59.99),
    (50, 2, 1, 45.99),
    -- Cancelled orders (51-55) still have items
    (51, 17, 1, 129.99),
    (52, 14, 1, 49.99),
    (53, 6, 1, 89.99),
    (54, 17, 1, 129.99),
    (54, 15, 1, 59.99),
    (55, 5, 1, 34.99),
    -- Remaining orders (56-65)
    (56, 19, 1, 79.99),
    (57, 4, 1, 449.99),
    (57, 2, 1, 45.99),
    (58, 25, 1, 44.99),
    (59, 3, 1, 129.99),
    (59, 11, 1, 69.99),
    (60, 6, 1, 89.99),
    (61, 22, 1, 39.99),
    (62, 8, 1, 149.99),
    (62, 12, 1, 24.99),
    (63, 49, 1, 49.99),
    (63, 45, 1, 12.99),
    (64, 31, 1, 59.99),
    (64, 32, 1, 47.99),
    (65, 16, 1, 89.99);

-- =============================================================================
-- Verification: row counts
-- =============================================================================
DO $$
DECLARE
    c_count INTEGER;
    p_count INTEGER;
    o_count INTEGER;
    i_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO c_count FROM customers;
    SELECT COUNT(*) INTO p_count FROM products;
    SELECT COUNT(*) INTO o_count FROM orders;
    SELECT COUNT(*) INTO i_count FROM order_items;

    RAISE NOTICE 'Catalog Lab data loaded: % customers, % products, % orders, % order_items',
        c_count, p_count, o_count, i_count;

    -- Verify minimum row counts
    IF c_count < 50 THEN RAISE EXCEPTION 'Expected 50+ customers, got %', c_count; END IF;
    IF p_count < 50 THEN RAISE EXCEPTION 'Expected 50+ products, got %', p_count; END IF;
    IF o_count < 50 THEN RAISE EXCEPTION 'Expected 50+ orders, got %', o_count; END IF;
    IF i_count < 50 THEN RAISE EXCEPTION 'Expected 50+ order_items, got %', i_count; END IF;
END $$;
