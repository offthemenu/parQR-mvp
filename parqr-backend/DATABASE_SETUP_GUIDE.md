# parQR Database Setup and Migration Guide

This comprehensive guide walks you through setting up and maintaining the parQR database on a separate machine using MySQL and Alembic migrations.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Database Setup](#initial-database-setup)
3. [Environment Configuration](#environment-configuration)
4. [Python Environment Setup](#python-environment-setup)
5. [Database Initialization](#database-initialization)
6. [Alembic Migration Management](#alembic-migration-management)
7. [Keeping Database Schema Updated](#keeping-database-schema-updated)
8. [Common Operations](#common-operations)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

## Prerequisites

Before starting, ensure you have the following installed on your target machine:

- **Python 3.8+** with pip
- **MySQL Server 8.0+** or access to a MySQL instance
- **Git** (to clone the repository)
- **virtualenv** or **conda** for Python environment management

### System-Specific Prerequisites

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv git mysql-server mysql-client
sudo apt install libmysqlclient-dev pkg-config  # Required for mysqlclient
```

#### CentOS/RHEL/Rocky Linux
```bash
sudo dnf install python3 python3-pip git mysql-server mysql
sudo dnf install mysql-devel pkgconfig  # Required for mysqlclient
```

#### macOS (with Homebrew)
```bash
brew install python3 git mysql
brew install pkg-config mysql-client
```

#### Windows
- Install Python from [python.org](https://python.org)
- Install MySQL from [mysql.com](https://dev.mysql.com/downloads/installer/)
- Install Git from [git-scm.com](https://git-scm.com/)
- Install Microsoft C++ Build Tools for mysqlclient compilation

## Initial Database Setup

### 1. MySQL Server Installation and Configuration

#### Start MySQL Service
```bash
# Ubuntu/Debian
sudo systemctl start mysql
sudo systemctl enable mysql

# CentOS/RHEL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# macOS
brew services start mysql
```

#### Secure MySQL Installation
```bash
sudo mysql_secure_installation
```

Follow the prompts to:
- Set root password
- Remove anonymous users
- Disallow root login remotely
- Remove test database
- Reload privilege tables

### 2. Create Database and User

Connect to MySQL as root:
```bash
mysql -u root -p
```

Create the database and user:
```sql
-- Create database
CREATE DATABASE parqr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create dedicated user (replace 'your_password' with a strong password)
CREATE USER 'parqr_admin'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON parqr_db.* TO 'parqr_admin'@'localhost';

-- If accessing from remote machines, also create:
-- CREATE USER 'parqr_admin'@'%' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON parqr_db.* TO 'parqr_admin'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Verify database creation
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

### 3. Test Database Connection
```bash
mysql -u parqr_admin -p parqr_db
```

## Environment Configuration

### 1. Clone the Repository
```bash
git clone <repository-url>
cd parQR-mvp/parqr-backend
```

### 2. Create Environment Variables File

Create a `.env` file in the `parqr-backend` directory:
```bash
touch .env
```

Add the following configuration to `.env`:
```bash
# Database Configuration
DB_USER=parqr_admin
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=parqr_db

# Constructed automatically by the application
DATABASE_URL=mysql+mysqldb://parqr_admin:your_secure_password@localhost:3306/parqr_db

# Application Configuration (optional)
ENVIRONMENT=development
DEBUG=True
```

**Security Note:** Never commit the `.env` file to version control. Ensure it's listed in `.gitignore`.

### 3. Verify Environment Variables
```bash
# Check if .env file exists and has correct permissions
ls -la .env
chmod 600 .env  # Restrict access to owner only
```

## Python Environment Setup

### 1. Create Virtual Environment
```bash
# Using venv (recommended)
python3 -m venv parqr_env

# Activate virtual environment
# Linux/macOS:
source parqr_env/bin/activate

# Windows:
# parqr_env\Scripts\activate
```

### 2. Install Dependencies
```bash
# Upgrade pip first
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt
```

### 3. Verify Installation
```bash
# Check if all packages are installed correctly
pip list

# Test MySQL connection
python3 -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('DB_USER:', os.getenv('DB_USER'))
print('DB_HOST:', os.getenv('DB_HOST'))
print('DATABASE_URL:', os.getenv('DATABASE_URL'))
"
```

## Database Initialization

### 1. Test Database Connection
```bash
# Test the connection with a simple script
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

### 2. Initialize Alembic (if not already done)
```bash
# Check if alembic is already initialized
ls -la alembic/

# If alembic directory doesn't exist, initialize it:
# alembic init alembic
```

### 3. Verify Alembic Configuration
```bash
# Check alembic configuration
alembic check

# Show current revision
alembic current
```

## Alembic Migration Management

### Understanding the Migration System

The parQR project uses Alembic for database schema versioning. Here's how it works:

- **Migration Files**: Located in `alembic/versions/`
- **Current Migrations**: 
  - `85b89fa95f39_initial_schema_reset.py` - Base schema
  - `86041de9befc_add_longitude_and_latitude_to_parking_.py` - GPS coordinates

### 1. Apply Existing Migrations

#### Check Migration Status
```bash
# Show current database revision
alembic current

# Show migration history
alembic history --verbose

# Show pending migrations
alembic show
```

#### Apply All Migrations
```bash
# Upgrade to latest revision
alembic upgrade head

# Verify tables were created
mysql -u parqr_admin -p parqr_db -e "SHOW TABLES;"
```

#### Verify Database Schema
```bash
# Check table structure
mysql -u parqr_admin -p parqr_db -e "
DESCRIBE users;
DESCRIBE cars;
DESCRIBE parking_sessions;
"
```

### 2. Creating New Migrations

When model changes are made on the development machine:

#### Auto-generate Migration
```bash
# Create migration for model changes
alembic revision --autogenerate -m "description of changes"

# Example:
alembic revision --autogenerate -m "add payment_status to parking_sessions"
```

#### Manual Migration Creation
```bash
# Create empty migration file
alembic revision -m "manual schema change"
```

#### Migration File Structure
Each migration file contains:
```python
"""Add payment_status to parking_sessions

Revision ID: abc123def456
Revises: 86041de9befc
Create Date: 2024-01-15 10:30:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'abc123def456'
down_revision = '86041de9befc'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Add new column
    op.add_column('parking_sessions', 
                  sa.Column('payment_status', sa.String(20), nullable=True))

def downgrade() -> None:
    # Remove column
    op.drop_column('parking_sessions', 'payment_status')
```

### 3. Applying New Migrations

#### Get Latest Code
```bash
# Pull latest changes from repository
git pull origin main

# Check for new migration files
ls -la alembic/versions/
```

#### Apply New Migrations
```bash
# Check what migrations will be applied
alembic show

# Apply migrations step by step (recommended for production)
alembic upgrade +1  # Apply next migration
alembic current     # Verify current state

# Or apply all at once
alembic upgrade head
```

#### Verify Changes
```bash
# Check database schema
mysql -u parqr_admin -p parqr_db -e "DESCRIBE parking_sessions;"

# Verify data integrity
python3 -c "
from app.db.session import SessionLocal
from app.models.parking_session import ParkingSession
db = SessionLocal()
count = db.query(ParkingSession).count()
print(f'Total parking sessions: {count}')
db.close()
"
```

## Keeping Database Schema Updated

### Daily/Regular Maintenance

#### 1. Check for Updates
```bash
# Navigate to project directory
cd /path/to/parQR-mvp/parqr-backend

# Activate virtual environment
source parqr_env/bin/activate

# Pull latest changes
git pull origin main

# Check for new requirements
pip install -r requirements.txt --upgrade
```

#### 2. Apply Schema Updates
```bash
# Check migration status
alembic current
alembic history --verbose

# Apply pending migrations
alembic upgrade head

# Verify database state
alembic current
```

#### 3. Backup Before Major Changes
```bash
# Create backup before applying migrations
mysqldump -u parqr_admin -p parqr_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Apply migrations
alembic upgrade head

# If issues occur, restore from backup:
# mysql -u parqr_admin -p parqr_db < backup_20240115_103000.sql
```

### Automated Update Script

Create a script `update_database.sh`:
```bash
#!/bin/bash

set -e  # Exit on any error

echo "🔄 Starting parQR database update..."

# Navigate to project directory
cd "$(dirname "$0")"

# Activate virtual environment
source parqr_env/bin/activate

# Create backup
echo "📦 Creating database backup..."
mysqldump -u parqr_admin -p$DB_PASSWORD parqr_db > "backups/backup_$(date +%Y%m%d_%H%M%S).sql"

# Pull latest code
echo "⬇️ Pulling latest code..."
git pull origin main

# Update dependencies
echo "📚 Updating dependencies..."
pip install -r requirements.txt --upgrade

# Check migration status
echo "🔍 Checking migration status..."
alembic current

# Apply migrations
echo "🚀 Applying migrations..."
alembic upgrade head

# Verify
echo "✅ Verifying database state..."
alembic current

echo "🎉 Database update completed successfully!"
```

Make it executable:
```bash
chmod +x update_database.sh
```

## Common Operations

### Database Backup and Restore

#### Create Backup
```bash
# Full database backup
mysqldump -u parqr_admin -p parqr_db > parqr_backup_$(date +%Y%m%d).sql

# Schema only backup
mysqldump -u parqr_admin -p --no-data parqr_db > parqr_schema_$(date +%Y%m%d).sql

# Specific table backup
mysqldump -u parqr_admin -p parqr_db parking_sessions > parking_sessions_backup.sql
```

#### Restore from Backup
```bash
# Restore full database
mysql -u parqr_admin -p parqr_db < parqr_backup_20240115.sql

# Restore specific table
mysql -u parqr_admin -p parqr_db < parking_sessions_backup.sql
```

### Migration Rollback

#### Rollback to Previous Version
```bash
# Show migration history
alembic history

# Rollback to specific revision
alembic downgrade 85b89fa95f39

# Rollback one step
alembic downgrade -1

# Rollback to base (empty database)
alembic downgrade base
```

### Data Validation

#### Check Data Integrity
```bash
# Run data validation script
python3 -c "
from app.db.session import SessionLocal
from app.models.user import User
from app.models.car import Car
from app.models.parking_session import ParkingSession

db = SessionLocal()

try:
    users = db.query(User).count()
    cars = db.query(Car).count()
    sessions = db.query(ParkingSession).count()
    
    print(f'Users: {users}')
    print(f'Cars: {cars}')
    print(f'Parking Sessions: {sessions}')
    
    # Check for orphaned records
    orphaned_cars = db.query(Car).filter(~Car.owner_id.in_(
        db.query(User.id)
    )).count()
    
    orphaned_sessions = db.query(ParkingSession).filter(
        ~ParkingSession.user_id.in_(db.query(User.id))
    ).count()
    
    print(f'Orphaned Cars: {orphaned_cars}')
    print(f'Orphaned Sessions: {orphaned_sessions}')
    
finally:
    db.close()
"
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Connection Refused
```bash
# Error: Can't connect to MySQL server
# Solution: Check if MySQL is running
sudo systemctl status mysql
sudo systemctl start mysql
```

#### 2. Authentication Failed
```bash
# Error: Access denied for user
# Solution: Verify credentials and user permissions
mysql -u root -p
# Then check user exists and has proper permissions
```

#### 3. mysqlclient Installation Issues

##### Ubuntu/Debian
```bash
sudo apt install libmysqlclient-dev python3-dev
pip install mysqlclient
```

##### CentOS/RHEL
```bash
sudo dnf install mysql-devel python3-devel
pip install mysqlclient
```

##### macOS
```bash
brew install mysql-client
export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"
pip install mysqlclient
```

#### 4. Alembic Version Conflicts
```bash
# Error: Multiple heads detected
# Solution: Merge migrations
alembic merge heads -m "merge conflicting migrations"
alembic upgrade head
```

#### 5. Migration Fails Partially
```bash
# Check current state
alembic current

# Mark migration as applied without running (DANGER!)
alembic stamp head

# Or rollback and retry
alembic downgrade -1
alembic upgrade head
```

#### 6. Character Set Issues
```sql
-- Fix character set for existing database
ALTER DATABASE parqr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Fix for specific tables
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cars CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE parking_sessions CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Debugging Database Issues

#### Enable SQL Logging
```python
# Add to app/db/session.py for debugging
engine = create_engine(DATABASE_URL, echo=True)  # This will log all SQL
```

#### Check Database Connections
```bash
# Show active connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Show database status
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"
```

#### Validate Migration Scripts
```bash
# Dry run migration (generate SQL without executing)
alembic upgrade head --sql

# Check migration script syntax
python3 -m py_compile alembic/versions/abc123def456_migration_name.py
```

## Best Practices

### Security

1. **Environment Variables**: Never hardcode credentials
2. **File Permissions**: Restrict `.env` file access (`chmod 600 .env`)
3. **Database User**: Use dedicated user with minimal required privileges
4. **Backups**: Encrypt backup files and store securely
5. **Network**: Use SSL/TLS for database connections in production

### Performance

1. **Connection Pooling**: Configure appropriate pool settings
2. **Indexes**: Monitor query performance and add indexes as needed
3. **Maintenance**: Regular `OPTIMIZE TABLE` and `ANALYZE TABLE`

### Monitoring

#### Set up Monitoring Script
```bash
#!/bin/bash
# monitor_db.sh

echo "Database Status Report - $(date)"
echo "=================================="

# Check MySQL status
systemctl is-active mysql
echo "MySQL Status: $?"

# Check disk space
df -h | grep mysql
echo ""

# Check database size
mysql -u parqr_admin -p$DB_PASSWORD -e "
SELECT 
    table_schema 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'parqr_db'
GROUP BY table_schema;
"

# Check migration status
cd /path/to/parqr-backend
source parqr_env/bin/activate
alembic current
```

### Development Workflow

1. **Always backup** before applying migrations in production
2. **Test migrations** in development environment first
3. **Review migration scripts** before applying
4. **Monitor application logs** after migrations
5. **Document** any manual data changes required

### Automation

#### Cron Job for Regular Updates
```bash
# Edit crontab
crontab -e

# Add entry to check for updates daily at 2 AM
0 2 * * * /path/to/parqr-backend/update_database.sh >> /var/log/parqr_update.log 2>&1
```

#### Health Check Script
```python
#!/usr/bin/env python3
# health_check.py

import sys
import os
from datetime import datetime

# Add project root to path
sys.path.append('/path/to/parqr-backend')

try:
    from app.db.session import engine
    from app.models.user import User
    from app.models.car import Car
    from app.models.parking_session import ParkingSession
    
    # Test connection
    connection = engine.connect()
    connection.close()
    
    print(f"✅ Health check passed at {datetime.now()}")
    sys.exit(0)
    
except Exception as e:
    print(f"❌ Health check failed at {datetime.now()}: {e}")
    sys.exit(1)
```

---

This guide provides a comprehensive approach to maintaining the parQR database. For additional help or questions about specific scenarios, refer to the [Alembic documentation](https://alembic.sqlalchemy.org/) or [MySQL documentation](https://dev.mysql.com/doc/).

Remember to always test changes in a development environment before applying them to production databases.