-- ============================================================================
-- Quality Lab: Intentionally Dirty E-Commerce Dataset
-- ============================================================================
-- This dataset is designed for Great Expectations exercises. Every quality
-- issue is intentional and documented so students know what to look for.
--
-- INSTRUCTOR REFERENCE - Planted Quality Issues Summary:
--
-- dirty_customers (35 rows total, 13 dirty + 22 clean):
--   Completeness:  3 NULL emails, 2 NULL first_name
--   Uniqueness:    3 duplicate customer_id pairs (IDs 1, 15, 20)
--   Validity:      2 invalid email format (no @, spaces in email)
--   Accuracy:      2 future registration_date (year 2028)
--   Temporal:      2 last_login before registration_date
--   Format:        2 empty string names ('' vs NULL)
--   Format:        1 extremely long phone number (50+ chars)
--
-- dirty_orders (35 rows total, 14 dirty + 21 clean):
--   Referential:   3 customer_id not in dirty_customers (IDs 900, 901, 902)
--   Temporal:      3 delivery_date before order_date
--   Validity:      2 invalid status values ('INVALID_STATUS', 'xyz')
--   Range:         2 negative total_amount
--   Business rule: 2 zero total_amount
--   Uniqueness:    2 duplicate order_id (IDs 5, 30)
--   Completeness:  2 NULL order_date
--   Accuracy:      2 future order dates (year 2029)
-- ============================================================================

-- ============================================================================
-- TABLE: dirty_customers
-- NO constraints (PK, FK, NOT NULL, CHECK) -- the whole point is that data
-- violates these rules and students must detect violations with GE.
-- ============================================================================
CREATE TABLE dirty_customers (
    customer_id INTEGER,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    registration_date TIMESTAMP,
    last_login TIMESTAMP
);

INSERT INTO dirty_customers (customer_id, email, first_name, last_name, phone, registration_date, last_login) VALUES
-- CLEAN ROWS (22 rows) -- provide contrast for dirty data detection
(1, 'ivan.petrov@datatech.ru', 'Ivan', 'Petrov', '+7-495-123-4567', '2024-01-15 10:00:00', '2024-06-01 14:30:00'),
(2, 'maria.sidorova@example.com', 'Maria', 'Sidorova', '+7-495-234-5678', '2024-02-20 09:15:00', '2024-05-15 11:00:00'),
(3, 'alex.kozlov@example.com', 'Alexei', 'Kozlov', '+7-495-345-6789', '2024-03-10 08:45:00', '2024-07-20 16:00:00'),
(4, 'elena.volkova@example.com', 'Elena', 'Volkova', '+7-495-456-7890', '2024-04-05 12:30:00', '2024-07-20 09:45:00'),
(5, 'dmitry.morozov@example.com', 'Dmitry', 'Morozov', '+7-495-567-8901', '2024-05-12 11:00:00', '2024-08-10 15:20:00'),
(6, 'anna.kuznetsova@example.com', 'Anna', 'Kuznetsova', '+7-495-678-9012', '2024-06-01 10:30:00', '2024-09-01 08:15:00'),
(7, 'sergey.novikov@example.com', 'Sergey', 'Novikov', '+7-495-789-0123', '2024-01-20 14:00:00', '2024-06-15 10:30:00'),
(8, 'olga.fedorova@example.com', 'Olga', 'Fedorova', '+7-495-890-1234', '2024-02-28 09:00:00', '2024-07-05 13:45:00'),
(9, 'nikolai.sokolov@example.com', 'Nikolai', 'Sokolov', '+7-495-901-2345', '2024-03-15 16:00:00', '2024-08-20 11:00:00'),
(10, 'tatiana.popova@example.com', 'Tatiana', 'Popova', '+7-495-012-3456', '2024-04-10 10:15:00', '2024-09-10 14:30:00'),
(11, 'andrei.lebedev@example.com', 'Andrei', 'Lebedev', '+7-495-111-2222', '2024-05-20 08:30:00', '2024-08-15 09:00:00'),
(12, 'ekaterina.smirnova@example.com', 'Ekaterina', 'Smirnova', '+7-495-222-3333', '2024-06-15 11:45:00', '2024-09-20 16:15:00'),
(13, 'viktor.ivanov@example.com', 'Viktor', 'Ivanov', '+7-495-333-4444', '2024-07-01 10:00:00', '2024-09-25 10:30:00'),
(14, 'natalya.orlova@example.com', 'Natalya', 'Orlova', '+7-495-444-5555', '2024-08-10 09:30:00', '2024-10-01 11:45:00'),
(16, 'pavel.grigoriev@example.com', 'Pavel', 'Grigoriev', '+7-495-555-6666', '2024-09-01 14:15:00', '2024-10-15 08:00:00'),
(17, 'svetlana.zaitseva@example.com', 'Svetlana', 'Zaitseva', '+7-495-666-7777', '2024-10-05 10:45:00', '2024-11-20 13:30:00'),
(18, 'roman.vasiliev@example.com', 'Roman', 'Vasiliev', '+7-495-777-8888', '2024-11-12 08:00:00', '2025-01-05 09:15:00'),
(19, 'irina.mikhailova@example.com', 'Irina', 'Mikhailova', '+7-495-888-9999', '2024-12-01 11:30:00', '2025-01-10 14:00:00'),
(21, 'maxim.petrov@example.com', 'Maxim', 'Petrov', '+7-495-999-0000', '2025-01-08 09:00:00', '2025-02-15 10:30:00'),
(22, 'lyudmila.egorova@example.com', 'Lyudmila', 'Egorova', '+7-495-000-1111', '2025-01-20 15:00:00', '2025-02-20 11:00:00'),
(23, 'konstantin.belov@example.com', 'Konstantin', 'Belov', '+7-495-121-3434', '2025-02-05 10:30:00', '2025-03-01 09:45:00'),
(24, 'yulia.danilova@example.com', 'Yulia', 'Danilova', '+7-495-232-4545', '2025-02-15 08:45:00', '2025-03-02 16:30:00'),

-- QUALITY ISSUE: NULL email -- completeness violation (3 rows)
(25, NULL, 'Oleg', 'Volkov', '+7-495-343-5656', '2024-03-05 10:00:00', '2024-08-01 11:30:00'),
(26, NULL, 'Vera', 'Sokolova', '+7-495-454-6767', '2024-04-18 09:15:00', '2024-09-12 14:00:00'),
(27, NULL, 'Boris', 'Kovalev', '+7-495-565-7878', '2024-06-22 11:00:00', '2024-10-05 10:15:00'),

-- QUALITY ISSUE: NULL first_name -- completeness violation (2 rows)
(28, 'no.firstname1@example.com', NULL, 'Kozlova', '+7-495-676-8989', '2024-07-10 14:30:00', '2024-11-01 09:00:00'),
(29, 'no.firstname2@example.com', NULL, 'Semenov', '+7-495-787-9090', '2024-08-25 10:45:00', '2024-12-10 15:30:00'),

-- QUALITY ISSUE: Duplicate customer_id -- uniqueness violation (3 pairs: IDs 1, 15, 20)
(1, 'ivan.duplicate@example.com', 'Ivan', 'Petrov-Dup', '+7-495-100-0001', '2024-02-01 10:00:00', '2024-07-01 12:00:00'),
(15, 'first.id15@example.com', 'Artem', 'Nikolaev', '+7-495-100-0015', '2024-05-15 09:30:00', '2024-10-20 11:00:00'),
(15, 'second.id15@example.com', 'Artem', 'Nikolaev-Dup', '+7-495-100-0152', '2024-05-20 14:00:00', '2024-10-25 10:30:00'),
(20, 'first.id20@example.com', 'Denis', 'Frolov', '+7-495-100-0020', '2024-09-10 08:30:00', '2025-01-15 09:00:00'),
(20, 'second.id20@example.com', 'Denis', 'Frolov-Dup', '+7-495-100-0202', '2024-09-15 11:00:00', '2025-01-20 14:30:00'),

-- QUALITY ISSUE: Invalid email format -- validity violation (2 rows)
(30, 'not-an-email', 'Galina', 'Belova', '+7-495-200-0001', '2024-10-01 10:00:00', '2025-01-05 11:30:00'),
(31, 'spaces in email@bad.com', 'Timur', 'Sergeev', '+7-495-200-0002', '2024-11-15 09:45:00', '2025-02-10 13:00:00'),

-- QUALITY ISSUE: Future registration_date -- accuracy/temporal violation (2 rows)
(32, 'future.reg1@example.com', 'Larisa', 'Makarova', '+7-495-300-0001', '2028-06-15 10:00:00', '2028-07-01 14:30:00'),
(33, 'future.reg2@example.com', 'Valery', 'Zhukov', '+7-495-300-0002', '2028-12-25 08:00:00', '2029-01-10 10:00:00'),

-- QUALITY ISSUE: last_login BEFORE registration_date -- temporal consistency violation (2 rows)
(34, 'time.traveler1@example.com', 'Georgy', 'Tikhonov', '+7-495-400-0001', '2024-08-01 10:00:00', '2024-01-15 09:30:00'),
(35, 'time.traveler2@example.com', 'Polina', 'Baranova', '+7-495-400-0002', '2024-10-20 11:00:00', '2024-03-05 14:00:00'),

-- QUALITY ISSUE: Empty string names ('' vs NULL) -- validity violation (2 rows)
(36, 'empty.name1@example.com', '', 'Kiselev', '+7-495-500-0001', '2024-11-01 10:30:00', '2025-02-01 09:00:00'),
(37, 'empty.name2@example.com', 'Oksana', '', '+7-495-500-0002', '2024-12-10 14:00:00', '2025-02-15 11:30:00'),

-- QUALITY ISSUE: Extremely long phone number -- format violation (1 row)
(38, 'long.phone@example.com', 'Ruslan', 'Fedotov', '+7-495-600-0001-ext-12345-dept-67890-bldg-A-floor-3', '2025-01-05 09:00:00', '2025-02-20 10:00:00');


-- ============================================================================
-- TABLE: dirty_orders
-- NO constraints (PK, FK, NOT NULL, CHECK) -- allows all dirty patterns.
-- ============================================================================
CREATE TABLE dirty_orders (
    order_id INTEGER,
    customer_id INTEGER,
    order_date TIMESTAMP,
    delivery_date TIMESTAMP,
    status VARCHAR(50),
    total_amount DECIMAL(12, 2)
);

INSERT INTO dirty_orders (order_id, customer_id, order_date, delivery_date, status, total_amount) VALUES
-- CLEAN ROWS (21 rows) -- provide contrast for dirty data detection
(1, 1, '2024-03-15 10:30:00', '2024-03-20 14:00:00', 'delivered', 1500.00),
(2, 2, '2024-03-18 09:00:00', '2024-03-25 11:30:00', 'delivered', 2300.50),
(3, 3, '2024-04-01 14:15:00', '2024-04-08 10:00:00', 'delivered', 890.00),
(4, 4, '2024-04-10 11:00:00', '2024-04-17 15:30:00', 'delivered', 3450.75),
(6, 5, '2024-05-05 08:45:00', '2024-05-12 09:30:00', 'delivered', 1200.00),
(7, 6, '2024-05-20 10:30:00', '2024-05-28 14:00:00', 'delivered', 750.50),
(8, 7, '2024-06-01 11:15:00', '2024-06-08 10:45:00', 'delivered', 4200.00),
(9, 8, '2024-06-15 09:00:00', '2024-06-22 16:00:00', 'shipped', 1850.25),
(10, 9, '2024-07-01 14:30:00', '2024-07-09 11:00:00', 'shipped', 560.00),
(11, 10, '2024-07-20 10:00:00', NULL, 'processing', 2100.00),
(12, 11, '2024-08-05 08:30:00', NULL, 'pending', 975.50),
(13, 12, '2024-08-18 11:45:00', '2024-08-25 09:00:00', 'delivered', 3300.00),
(14, 13, '2024-09-01 10:15:00', '2024-09-08 14:30:00', 'delivered', 1450.75),
(15, 14, '2024-09-15 09:30:00', NULL, 'processing', 2750.00),
(16, 16, '2024-10-01 12:00:00', '2024-10-08 10:00:00', 'delivered', 680.25),
(17, 17, '2024-10-20 08:45:00', '2024-10-28 15:30:00', 'delivered', 4100.00),
(18, 18, '2024-11-05 11:00:00', NULL, 'shipped', 1920.50),
(19, 19, '2024-11-18 14:30:00', '2024-11-25 09:15:00', 'delivered', 850.00),
(20, 21, '2024-12-01 10:00:00', NULL, 'pending', 3650.75),
(21, 22, '2025-01-10 09:15:00', '2025-01-17 11:30:00', 'delivered', 1100.00),
(22, 23, '2025-01-25 11:30:00', NULL, 'processing', 2450.00),

-- QUALITY ISSUE: customer_id not in dirty_customers -- referential integrity violation (3 rows)
(23, 900, '2024-04-15 10:00:00', '2024-04-22 14:30:00', 'delivered', 1750.00),
(24, 901, '2024-06-10 09:30:00', '2024-06-17 11:00:00', 'shipped', 2200.50),
(25, 902, '2024-08-20 14:00:00', NULL, 'pending', 950.75),

-- QUALITY ISSUE: delivery_date BEFORE order_date -- temporal violation (3 rows)
(26, 1, '2024-05-15 10:30:00', '2024-05-10 14:00:00', 'delivered', 800.00),
(27, 3, '2024-07-20 09:00:00', '2024-07-15 11:30:00', 'delivered', 1350.25),
(28, 6, '2024-09-10 11:45:00', '2024-09-05 09:00:00', 'delivered', 2900.00),

-- QUALITY ISSUE: Invalid status values -- validity violation (2 rows)
(29, 7, '2024-10-05 10:15:00', NULL, 'INVALID_STATUS', 1500.00),
(31, 9, '2024-11-01 08:30:00', NULL, 'xyz', 3200.75),

-- QUALITY ISSUE: Negative total_amount -- range violation (2 rows)
(32, 10, '2024-11-15 11:00:00', '2024-11-22 14:30:00', 'delivered', -50.00),
(33, 11, '2024-12-01 09:45:00', '2024-12-08 10:00:00', 'delivered', -1250.50),

-- QUALITY ISSUE: Zero total_amount -- business rule violation (2 rows)
(34, 12, '2024-12-10 14:00:00', '2024-12-17 09:30:00', 'delivered', 0.00),
(35, 13, '2025-01-05 10:30:00', '2025-01-12 11:45:00', 'delivered', 0.00),

-- QUALITY ISSUE: Duplicate order_id -- uniqueness violation (2 pairs: IDs 5, 30)
(5, 2, '2024-04-25 09:00:00', '2024-05-02 15:00:00', 'delivered', 1600.00),
(30, 8, '2024-10-15 12:30:00', '2024-10-22 10:00:00', 'delivered', 2800.50),
(30, 14, '2024-10-18 08:00:00', NULL, 'processing', 1950.25),

-- QUALITY ISSUE: NULL order_date -- completeness violation (2 rows)
(36, 16, NULL, '2024-11-20 14:00:00', 'delivered', 1400.00),
(37, 17, NULL, NULL, 'pending', 750.50),

-- QUALITY ISSUE: Future order dates -- accuracy violation (2 rows)
(38, 18, '2029-06-15 10:00:00', '2029-06-22 14:30:00', 'delivered', 3100.00),
(39, 19, '2029-12-01 09:30:00', NULL, 'pending', 2250.75);
