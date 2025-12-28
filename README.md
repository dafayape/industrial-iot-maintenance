# Industrial IoT Asset Maintenance Log

A professional-grade web application for managing industrial equipment maintenance records in an OEE (Overall Equipment Effectiveness) monitoring context. Built with Clean Architecture principles and designed for factory floor operations.

## Overview

This system enables factory managers to perform comprehensive CRUD operations on industrial asset data, tracking equipment status, maintenance schedules, and operational efficiency metrics in real-time.

## Technical Architecture

### Technology Stack

- **Runtime Environment:** Node.js (ES6+ Modules)
- **Package Manager:** pnpm
- **Database:** MySQL 8.0 (Containerized with Podman)
- **Backend Framework:** Express.js
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+ Modules)
- **Version Control:** Git (default branch: `main`)

### Design System

- **Color Scheme:** Strict Monochrome (Black, White, Grayscale)
- **Typography:** JetBrains Mono Nerd Font
- **Layout Pattern:** Responsive Grid System
- **Aesthetic:** Industrial Dashboard with High Contrast

## Prerequisites

Ensure the following tools are installed on your system:

- **Node.js:** v18.x or higher
- **pnpm:** v8.x or higher
- **Podman:** v4.x or higher
- **Git:** v2.x or higher

### Installation Commands
```bash
# Install Node.js (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install pnpm
npm install -g pnpm

# Install Podman (Arch Linux)
sudo pacman -S podman
```

## Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd industrial-iot-maintenance
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Database Setup

#### Start MySQL Container
```bash
podman run -d \
  --name industrial-iot-mysql \
  -e MYSQL_ROOT_PASSWORD=industrial_root_pass_2024 \
  -e MYSQL_DATABASE=industrial_iot_db \
  -e MYSQL_USER=iot_admin \
  -e MYSQL_PASSWORD=iot_secure_pass_2024 \
  -p 3306:3306 \
  docker.io/library/mysql:8.0
```

#### Verify Container Status
```bash
podman ps
```

#### Apply Database Schema
```bash
podman exec -i industrial-iot-mysql mysql -uiot_admin -piot_secure_pass_2024 industrial_iot_db < database/schema.sql
```

#### Verify Data Insertion
```bash
podman exec -i industrial-iot-mysql mysql -uiot_admin -piot_secure_pass_2024 industrial_iot_db -e "SELECT serial_number, asset_name, status FROM industrial_assets;"
```

### 4. Environment Configuration

Create `.env` file in project root:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=iot_admin
DB_PASSWORD=iot_secure_pass_2024
DB_NAME=industrial_iot_db
```

### 5. Start Application

#### Development Mode (with auto-reload)
```bash
pnpm run dev
```

#### Production Mode
```bash
pnpm start
```

### 6. Access Application

- **Frontend Dashboard:** http://localhost:3000
- **API Endpoint:** http://localhost:3000/api/assets
- **Health Check:** http://localhost:3000/health

## Project Structure
```
industrial-iot-maintenance/
├── src/
│   ├── config/
│   │   └── database.js              # Database connection pool configuration
│   ├── models/
│   │   └── industrial-asset.js      # Data access layer (Repository pattern)
│   ├── controllers/
│   │   └── asset-controller.js      # Business logic and request handling
│   ├── routes/
│   │   └── asset-routes.js          # RESTful API route definitions
│   └── server.js                    # Application entry point
├── public/
│   ├── css/
│   │   └── style.css                # Monochrome design system
│   ├── js/
│   │   ├── api.js                   # HTTP client wrapper
│   │   ├── ui.js                    # DOM manipulation and rendering
│   │   └── main.js                  # Application initialization
│   └── index.html                   # Single-page application shell
├── database/
│   └── schema.sql                   # Database schema and seed data
├── .env                             # Environment variables (not tracked)
├── .gitignore                       # Git ignore patterns
├── package.json                     # Project metadata and dependencies
└── README.md                        # Project documentation
```

## API Reference

### Base URL
```
http://localhost:3000/api/assets
```

### Endpoints

#### Get All Assets
```http
GET /api/assets
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-string",
      "asset_name": "CNC Milling Machine Alpha",
      "serial_number": "CNC-A-001",
      "status": "RUNNING",
      "last_maintenance_date": "2024-12-15",
      "oee_score": 87.50,
      "created_at": "2024-12-28T10:00:00.000Z",
      "updated_at": "2024-12-28T10:00:00.000Z"
    }
  ],
  "total": 1
}
```

#### Get Single Asset
```http
GET /api/assets/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "asset_name": "CNC Milling Machine Alpha",
    "serial_number": "CNC-A-001",
    "status": "RUNNING",
    "last_maintenance_date": "2024-12-15",
    "oee_score": 87.50
  }
}
```

#### Create New Asset
```http
POST /api/assets
Content-Type: application/json
```

**Request Body:**
```json
{
  "asset_name": "Laser Cutting System",
  "serial_number": "LCS-E-005",
  "status": "RUNNING",
  "last_maintenance_date": "2024-12-20",
  "oee_score": 91.25
}
```

**Response:**
```json
{
  "success": true,
  "message": "Asset created successfully",
  "data": { /* created asset object */ }
}
```

#### Update Existing Asset
```http
PUT /api/assets/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "asset_name": "Laser Cutting System Pro",
  "serial_number": "LCS-E-005",
  "status": "MAINTENANCE",
  "last_maintenance_date": "2024-12-28",
  "oee_score": 93.50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Asset updated successfully",
  "data": { /* updated asset object */ }
}
```

#### Delete Asset
```http
DELETE /api/assets/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Asset deleted successfully"
}
```

### Status Values

- `RUNNING` - Asset is operational
- `MAINTENANCE` - Asset is under maintenance
- `DOWN` - Asset is non-operational

### OEE Score

- Decimal value between 0.00 and 100.00
- Represents Overall Equipment Effectiveness percentage

## Database Schema

### Table: `industrial_assets`

| Column                  | Type            | Constraints                    |
|-------------------------|-----------------|--------------------------------|
| id                      | VARCHAR(36)     | PRIMARY KEY                    |
| asset_name              | VARCHAR(255)    | NOT NULL                       |
| serial_number           | VARCHAR(100)    | NOT NULL, UNIQUE               |
| status                  | ENUM            | NOT NULL, DEFAULT 'RUNNING'    |
| last_maintenance_date   | DATE            | NOT NULL                       |
| oee_score               | DECIMAL(5,2)    | NOT NULL, CHECK (0-100)        |
| created_at              | TIMESTAMP       | DEFAULT CURRENT_TIMESTAMP      |
| updated_at              | TIMESTAMP       | ON UPDATE CURRENT_TIMESTAMP    |

### Indexes

- `idx_status` on `status` column
- `idx_serial_number` on `serial_number` column

## Development Guidelines

### Architecture Layers

1. **Configuration Layer:** Database and environment setup
2. **Model Layer:** Data access and business entities (Repository pattern)
3. **Controller Layer:** Request handling and business logic orchestration
4. **Route Layer:** HTTP endpoint definitions
5. **Presentation Layer:** Frontend UI components

## Maintenance Operations

### Stop Application
```bash
# Press Ctrl+C in terminal where server is running
```

### Stop Database Container
```bash
podman stop industrial-iot-mysql
```

### Start Existing Container
```bash
podman start industrial-iot-mysql
```

### Remove Container (Destructive)
```bash
podman stop industrial-iot-mysql
podman rm industrial-iot-mysql
```

### View Container Logs
```bash
podman logs industrial-iot-mysql
```

### Database Backup
```bash
podman exec industrial-iot-mysql mysqldump -uiot_admin -piot_secure_pass_2024 industrial_iot_db > backup_$(date +%Y%m%d).sql
```

### Database Restore
```bash
podman exec -i industrial-iot-mysql mysql -uiot_admin -piot_secure_pass_2024 industrial_iot_db < backup_20241228.sql
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3306
sudo lsof -i :3306

# Kill the process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check container status
podman ps -a

# Restart container
podman restart industrial-iot-mysql

# Check logs for errors
podman logs industrial-iot-mysql
```

### Frontend Not Loading
```bash
# Verify server is running
curl http://localhost:3000/health

# Check browser console for errors
# Verify static files are in public/ directory
```

## Security Considerations

### Production Deployment

- Change default database credentials
- Use environment variables for sensitive data
- Implement authentication and authorization
- Enable HTTPS/TLS encryption
- Set up firewall rules
- Regular security updates
- Database backup automation
- Implement rate limiting
- Add request validation middleware

### Environment Variables

Never commit `.env` file to version control. Use `.env.example` as template:
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=your-db-name
```

## Contributing

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/asset-analytics

# Make changes and commit
git add .
git commit -m "feat: add OEE analytics dashboard"

# Push to remote
git push origin feature/asset-analytics

# Create pull request on GitHub/GitLab
```

### Commit Message Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

## License

- MIT License - See LICENSE file for details
- Copyright © 2025 Daffa Jaya Perkasa. All Rights Reserved.

## Support

For issues, questions, or contributions, please open an issue on the project repository.

---

**Built with industrial-grade architecture for real-world manufacturing environments.**
