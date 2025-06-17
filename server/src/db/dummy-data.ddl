-- Schema (from README)
-- users(handle_id TEXT PRIMARY KEY,
--       company_name TEXT NOT NULL,
--       ip_address TEXT NOT NULL,
--       registered_at DATETIME DEFAULT CURRENT_TIMESTAMP)
-- sentiments(id INTEGER PRIMARY KEY AUTOINCREMENT,
--            handle_id TEXT REFERENCES users(handle_id),
--            sentiment TEXT CHECK(sentiment IN ('GREAT','MEH','UGH')),
--            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)

BEGIN TRANSACTION;

-- Clear existing sentiment data
DELETE FROM sentiments;

-- Sample handles
WITH handles(handle_id, company_name, ip_address) AS (
    VALUES
    ('Oleksandr-UA','TechCorp','192.168.1.1'),
    ('Daria-UA','InnovateX','192.168.1.2'),
    ('Vasyl-UA','GlobalSoft','192.168.1.3'),
    ('Kateryna-UA','FutureSolutions','192.168.1.4'),
    ('Petro-UA','AlphaGroup','192.168.1.5'),
    ('Iryna-UA','TechCorp','192.168.1.6'),
    ('Andriy-UA','InnovateX','192.168.1.7'),
    ('Natalia-UA','GlobalSoft','192.168.1.8'),
    ('Svitlana-UA','FutureSolutions','192.168.1.9'),
    ('Mykola-UA','AlphaGroup','192.168.1.10'),
    ('Arjun-IN','TechCorp','192.168.1.11'),
    ('Priya-IN','InnovateX','192.168.1.12'),
    ('Rohan-IN','GlobalSoft','192.168.1.13'),
    ('Aisha-IN','FutureSolutions','192.168.1.14'),
    ('Rahul-IN','AlphaGroup','192.168.1.15'),
    ('Kavya-IN','TechCorp','192.168.1.16'),
    ('Vijay-IN','InnovateX','192.168.1.17'),
    ('Sneha-IN','GlobalSoft','192.168.1.18'),
    ('Sanjay-IN','FutureSolutions','192.168.1.19'),
    ('Pooja-IN','AlphaGroup','192.168.1.20'),
    ('John-US','TechCorp','192.168.1.21'),
    ('Emily-US','InnovateX','192.168.1.22'),
    ('Michael-US','GlobalSoft','192.168.1.23'),
    ('Sarah-US','FutureSolutions','192.168.1.24'),
    ('David-US','AlphaGroup','192.168.1.25'),
    ('Jessica-US','TechCorp','192.168.1.26'),
    ('William-US','InnovateX','192.168.1.27'),
    ('Ashley-US','GlobalSoft','192.168.1.28'),
    ('James-US','FutureSolutions','192.168.1.29'),
    ('Samantha-US','AlphaGroup','192.168.1.30'),
    ('Oliver-UK','TechCorp','192.168.1.31'),
    ('Amelia-UK','InnovateX','192.168.1.32'),
    ('Lukas-DE','GlobalSoft','192.168.1.33'),
    ('Emma-DE','FutureSolutions','192.168.1.34'),
    ('Hugo-FR','AlphaGroup','192.168.1.35'),
    ('Chloe-FR','TechCorp','192.168.1.36'),
    ('Marco-IT','InnovateX','192.168.1.37'),
    ('Sofia-IT','GlobalSoft','192.168.1.38'),
    ('Carlos-ES','FutureSolutions','192.168.1.39'),
    ('Lucia-ES','AlphaGroup','192.168.1.40'),
    ('Erik-SE','TechCorp','192.168.1.41'),
    ('Ingrid-SE','InnovateX','192.168.1.42'),
    ('Bartosz-PL','GlobalSoft','192.168.1.43'),
    ('Zuzanna-PL','FutureSolutions','192.168.1.44'),
    ('Jonas-NO','AlphaGroup','192.168.1.45'),
    ('Anna-NO','TechCorp','192.168.1.46'),
    ('Jean-BE','InnovateX','192.168.1.47'),
    ('Elise-BE','GlobalSoft','192.168.1.48'),
    ('Felix-AT','FutureSolutions','192.168.1.49'),
    ('Lara-AT','AlphaGroup','192.168.1.50')
)
INSERT OR IGNORE INTO users(handle_id, company_name, ip_address)
SELECT handle_id, company_name, ip_address FROM handles;

WITH RECURSIVE seq(x) AS (
    SELECT 1
    UNION ALL
    SELECT x+1 FROM seq WHERE x < 50
), handles(handle_id) AS (
    VALUES
    ('Oleksandr-UA'),('Daria-UA'),('Vasyl-UA'),('Kateryna-UA'),('Petro-UA'),
    ('Iryna-UA'),('Andriy-UA'),('Natalia-UA'),('Svitlana-UA'),('Mykola-UA'),
    ('Arjun-IN'),('Priya-IN'),('Rohan-IN'),('Aisha-IN'),('Rahul-IN'),('Kavya-IN'),
    ('Vijay-IN'),('Sneha-IN'),('Sanjay-IN'),('Pooja-IN'),
    ('John-US'),('Emily-US'),('Michael-US'),('Sarah-US'),('David-US'),('Jessica-US'),
    ('William-US'),('Ashley-US'),('James-US'),('Samantha-US'),
    ('Oliver-UK'),('Amelia-UK'),('Lukas-DE'),('Emma-DE'),('Hugo-FR'),('Chloe-FR'),
    ('Marco-IT'),('Sofia-IT'),('Carlos-ES'),('Lucia-ES'),
    ('Erik-SE'),('Ingrid-SE'),('Bartosz-PL'),('Zuzanna-PL'),('Jonas-NO'),('Anna-NO'),
    ('Jean-BE'),('Elise-BE'),('Felix-AT'),('Lara-AT')
)
INSERT INTO sentiments(handle_id, sentiment, timestamp)
SELECT h.handle_id,
       CASE abs(random()) % 3 WHEN 0 THEN 'GREAT' WHEN 1 THEN 'MEH' ELSE 'UGH' END,
       datetime('now', '-' || (abs(random()) % 180) || ' days', '-' || (abs(random()) % 86400) || ' seconds')
FROM handles h, seq;

COMMIT;
