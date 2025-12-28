CREATE DATABASE IF NOT EXISTS industrial_iot_db;
USE industrial_iot_db;
CREATE TABLE IF NOT EXISTS industrial_assets (
    id VARCHAR(36) PRIMARY KEY,
    asset_name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('RUNNING', 'MAINTENANCE', 'DOWN') NOT NULL DEFAULT 'RUNNING',
    last_maintenance_date DATE NOT NULL,
    oee_score DECIMAL(5, 2) NOT NULL CHECK (
        oee_score >= 0
        AND oee_score <= 100
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_serial_number (serial_number)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
INSERT INTO industrial_assets (
        id,
        asset_name,
        serial_number,
        status,
        last_maintenance_date,
        oee_score
    )
SELECT *
FROM (
        SELECT UUID() as id,
            'CNC Milling Machine Alpha' as asset_name,
            'CNC-A-001' as serial_number,
            'RUNNING' as status,
            '2024-12-15' as last_maintenance_date,
            87.50 as oee_score
        UNION ALL
        SELECT UUID(),
            'Industrial Robotic Arm Beta',
            'ROB-B-002',
            'MAINTENANCE',
            '2024-12-20',
            92.30
        UNION ALL
        SELECT UUID(),
            'Hydraulic Press Gamma',
            'HYD-G-003',
            'RUNNING',
            '2024-11-28',
            78.90
        UNION ALL
        SELECT UUID(),
            'Conveyor System Delta',
            'CNV-D-004',
            'DOWN',
            '2024-12-10',
            45.60
    ) AS tmp
WHERE NOT EXISTS (
        SELECT 1
        FROM industrial_assets
        WHERE serial_number = tmp.serial_number
    )
LIMIT 4;