# parQR Database Setup Guide for macOS

This guide provides a streamlined approach to setting up the parQR database on macOS machines using MySQL. This setup is designed for easy reinitialization across multiple Mac devices - simply follow this guide and run `alembic upgrade head` to get up and running quickly.

## Table of Contents

1. [Quick Setup for Multiple Macs](#quick-setup-for-multiple-macs)
2. [Prerequisites](#prerequisites)
3. [MySQL Installation and Setup](#mysql-installation-and-setup)
4. [Database and User Creation](#database-and-user-creation)
5. [Project Setup](#project-setup)
6. [Environment Configuration](#environment-configuration)
7. [Python Environment and Dependencies](#python-environment-and-dependencies)
8. [Database Schema Migration](#database-schema-migration)
9. [Verification](#verification)
10. [Troubleshooting](#troubleshooting)

## Quick Setup for Multiple Macs

If you're setting up parQR on a new Mac and have already configured it on another machine, here's the streamlined workflow:

1. **Install prerequisites** (see below)
2. **Set up MySQL** with the same database name, user, and password as your other machines
3. **Clone the repository and configure environment**
4. **Install Python dependencies**
5. **Run `alembic upgrade head`** to apply all migrations

This approach ensures all configurations, models, and schemas are consistent across your Mac devices.

## Prerequisites

**Required Software:**
- **Homebrew** (macOS package manager)
- **Python 3.8+** 
- **MySQL 8.0+**
- **Git**

**Install Homebrew** (if not already installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Install all prerequisites:**
```bash
# Install core dependencies
brew install python3 git mysql pkg-config mysql-client

# Add MySQL client to PATH (add this to your ~/.zshrc or ~/.bash_profile)
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## MySQL Installation and Setup

### 1. Start MySQL Service
```bash
# Start MySQL service
brew services start mysql

# Verify MySQL is running
brew services list | grep mysql
```

### 2. Secure MySQL Installation
```bash
mysql_secure_installation
```

Follow the prompts:
- **Set root password** (choose a strong password)
- **Remove anonymous users** → Yes
- **Disallow root login remotely** → Yes  
- **Remove test database** → Yes
- **Reload privilege tables** → Yes

## Database and User Creation

**Important:** Use the same database credentials across all your Mac devices for consistency.

Connect to MySQL as root:
```bash
mysql -u root -p
```

Create the database and user:
```sql
-- Create database with proper character set
CREATE DATABASE parqr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user (use the same password across all your Mac devices)
CREATE USER 'parqr_admin'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant all privileges
GRANT ALL PRIVILEGES ON parqr_db.* TO 'parqr_admin'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify database was created
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

**Test the connection:**
```bash
mysql -u parqr_admin -p parqr_db
```
Type `EXIT;` to quit once you confirm the connection works.

## Project Setup

### 1. Clone the Repository
```bash
# Clone to your preferred location
git clone <repository-url>
cd parQR-mvp/parqr-backend
```

## Environment Configuration

**Important:** Use the exact same `.env` configuration across all your Mac devices.

### 1. Create Environment File
```bash
# Create .env file
touch .env

# Set secure permissions
chmod 600 .env
```

### 2. Configure Environment Variables

Add this configuration to `.env` (replace `your_secure_password` with your actual password):

```bash
# Database Configuration
DB_USER=parqr_admin
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=parqr_db

# Database URL (automatically constructed)
DATABASE_URL=mysql+mysqldb://parqr_admin:your_secure_password@localhost:3306/parqr_db

# Application Settings
ENVIRONMENT=development
DEBUG=True
```

**Note:** The `.env` file is already in `.gitignore` and won't be committed to version control.

## Python Environment and Dependencies

### 1. Create and Activate Virtual Environment
```bash
# Create virtual environment
python3 -m venv parqr_env

# Activate it
source parqr_env/bin/activate

# Your terminal prompt should now show (parqr_env)
```

### 2. Install Dependencies
```bash
# Upgrade pip
pip install --upgrade pip

# Install all project dependencies
pip install -r requirements.txt
```

### 3. Verify Setup
```bash
# Test environment configuration
python3 -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('✅ DB_USER:', os.getenv('DB_USER'))
print('✅ DB_HOST:', os.getenv('DB_HOST'))
print('✅ Environment loaded successfully')
"
```

## Database Schema Migration

This is the key step that makes working across multiple Macs simple - Alembic will automatically create all tables and apply all schema updates.

### 1. Test Database Connection
```bash
# Verify connection to your database
python3 -c "
from app.db.session import engine
try:
    connection = engine.connect()
    print('✅ Database connection successful!')
    connection.close()
except Exception as e:
    print('❌ Database connection failed:', e)
"
```

### 2. Apply All Migrations
This single command will create all tables and apply all schema changes:

```bash
# Apply all migrations to bring database up to current schema
alembic upgrade head
```

You should see output like:
```
INFO  [alembic.runtime.migration] Context impl MySQLImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 85b89fa95f39, Initial schema reset
INFO  [alembic.runtime.migration] Running upgrade 85b89fa95f39 -> 86041de9befc, Add longitude and latitude to parking sessions
```

### 3. Verify Migration Status
```bash
# Check current database revision
alembic current

# Should show the latest migration ID
```

## Verification

### 1. Check Database Tables
```bash
# Verify all tables were created
mysql -u parqr_admin -p parqr_db -e "SHOW TABLES;"
```

You should see:
```
+------------------+
| Tables_in_parqr_db |
+------------------+
| alembic_version   |
| cars             |
| parking_sessions |
| users            |
+------------------+
```

### 2. Verify Table Structure
```bash
# Check key table structures
mysql -u parqr_admin -p parqr_db -e "
DESCRIBE users;
DESCRIBE cars; 
DESCRIBE parking_sessions;
"
```

### 3. Test Application Connection
```bash
# Test that the application can connect to the database
python3 -c "
from app.db.session import SessionLocal
from app.models.user import User
from app.models.car import Car
from app.models.parking_session import ParkingSession

db = SessionLocal()
try:
    user_count = db.query(User).count()
    car_count = db.query(Car).count()
    session_count = db.query(ParkingSession).count()
    print(f'✅ Database connection successful!')
    print(f'Users: {user_count}, Cars: {car_count}, Sessions: {session_count}')
finally:
    db.close()
"
```

## Working with Multiple Mac Devices

### Adding a New Mac Device

When you want to work on parQR from a new Mac:

1. **Follow this guide** from the beginning
2. **Use identical credentials** (same DB_USER, DB_PASSWORD, DB_NAME)
3. **Run `alembic upgrade head`** to get the latest schema
4. **You're ready to go!**

### Keeping Devices in Sync

When you pull new code with database changes:

```bash
# Pull latest code
git pull origin main

# Apply any new migrations
alembic upgrade head

# Verify current state
alembic current
```


## Troubleshooting

### Common macOS Issues

#### 1. MySQL Won't Start
```bash
# Check if MySQL is running
brew services list | grep mysql

# Start MySQL if not running
brew services start mysql

# If still having issues, try restarting
brew services restart mysql
```

#### 2. Can't Connect to MySQL
```bash
# Verify MySQL is listening on port 3306
lsof -i :3306

# Test connection manually
mysql -u parqr_admin -p parqr_db

# If access denied, check user permissions:
mysql -u root -p -e "SELECT User, Host FROM mysql.user WHERE User='parqr_admin';"
```

#### 3. mysqlclient Installation Problems
```bash
# Make sure MySQL client is in PATH
export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"

# Reinstall mysqlclient if needed
pip uninstall mysqlclient
pip install mysqlclient

# If still failing, try:
brew install pkg-config mysql-client
pip install mysqlclient
```

#### 4. Alembic Upgrade Fails
```bash
# Check current migration state
alembic current

# If database is empty but alembic thinks it's migrated:
alembic stamp base
alembic upgrade head

# If migrations conflict:
alembic history
# Then manually resolve in alembic/versions/
```

#### 5. Virtual Environment Issues
```bash
# Deactivate and recreate if having Python issues
deactivate
rm -rf parqr_env
python3 -m venv parqr_env
source parqr_env/bin/activate
pip install -r requirements.txt
```

#### 6. Permission Denied Errors
```bash
# Fix .env file permissions
chmod 600 .env

# Fix MySQL data directory permissions (if needed)
sudo chown -R $(whoami) /opt/homebrew/var/mysql
```

### Quick Recovery Commands

If something goes wrong, here are the fastest recovery steps:

```bash
# 1. Recreate database from scratch
mysql -u root -p -e "DROP DATABASE IF EXISTS parqr_db; CREATE DATABASE parqr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Reset alembic and apply all migrations
alembic stamp base
alembic upgrade head

# 3. Verify everything is working
python3 -c "from app.db.session import SessionLocal; print('✅ Database ready!')"
```

---

**That's it!** This streamlined setup ensures you can quickly get parQR running on any Mac device. The key is using consistent credentials and letting Alembic handle all the schema management with `alembic upgrade head`.