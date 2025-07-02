# 🤖 Botpress Community Edition Setup on IONOS VPS

## � **Your VPS Specifications** ✅
- **IP:** 108.175.12.154
- **CPU:** 2 vCore (Perfect for Botpress!)
- **RAM:** 4 GB (Ideal amount!)
- **Storage:** 120 GB NVMe SSD (Plenty of space!)
- **OS:** Alma Linux 9 (Enterprise-grade)
- **User:** root

## �🖥️ **Server Preparation**

### **1. Connect to Your IONOS VPS**
```bash
ssh root@108.175.12.154
```

### **2. Update System (Alma Linux 9)**
```bash
# Update Alma Linux packages
dnf update -y

# Install essential packages
dnf install -y curl wget unzip git
```

### **3. Install Node.js 18+ (Alma Linux)**
```bash
# Enable NodeSource repository for Alma Linux
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
dnf install -y nodejs
node --version  # Should be 18.x or higher
npm --version
```

### **4. Install PostgreSQL (Alma Linux)**
```bash
# Install PostgreSQL 15
dnf install -y postgresql postgresql-server postgresql-contrib
postgresql-setup --initdb
systemctl start postgresql
systemctl enable postgresql

# Create Botpress database
sudo -u postgres psql
CREATE DATABASE botpress;
CREATE USER botpressuser WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE botpress TO botpressuser;
\q
```

### **5. Install Nginx (Alma Linux)**
```bash
dnf install -y nginx
systemctl start nginx
systemctl enable nginx

# Allow HTTP and HTTPS through firewall
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

## 🤖 **Botpress Installation**

### **Method 1: Docker (Recommended for Alma Linux)**
```bash
# Install Docker on Alma Linux 9
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl start docker
systemctl enable docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create Botpress directory
mkdir /opt/botpress
cd /opt/botpress
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  botpress:
    image: botpress/server:latest
    container_name: botpress
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://botpressuser:your_secure_password@db:5432/botpress
      - BP_PRODUCTION=true
      - EXTERNAL_URL=https://bot.108.175.12.154.nip.io
    volumes:
      - ./botpress_data:/botpress/data
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:13
    container_name: botpress_db
    environment:
      - POSTGRES_DB=botpress
      - POSTGRES_USER=botpressuser
      - POSTGRES_PASSWORD=your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### **Method 2: Direct Installation**
```bash
# Create botpress user
useradd -m -s /bin/bash botpress
su - botpress

# Download and install Botpress
wget https://github.com/botpress/botpress/releases/latest/download/bp-linux-x64.zip
unzip bp-linux-x64.zip
chmod +x bp
```

## 🌐 **Nginx Configuration**

Create `/etc/nginx/conf.d/botpress.conf`:
```nginx
server {
    listen 80;
    server_name 108.175.12.154 bot.108.175.12.154.nip.io;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
# Test Nginx configuration
nginx -t
systemctl reload nginx
```

## 🔒 **SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot for Alma Linux
dnf install -y epel-release
dnf install -y certbot python3-certbot-nginx

# Get SSL certificate (use nip.io for easy domain)
certbot --nginx -d bot.108.175.12.154.nip.io
```

## 🚀 **Start Botpress**

### **Using Docker:**
```bash
cd /opt/botpress
docker-compose up -d
```

### **Direct Installation:**
```bash
# Create botpress user
useradd -m -s /bin/bash botpress
su - botpress

# Download and install Botpress
wget https://github.com/botpress/botpress/releases/latest/download/bp-linux-x64.zip
unzip bp-linux-x64.zip
chmod +x bp
exit

# Create systemd service
sudo tee /etc/systemd/system/botpress.service > /dev/null <<EOF
[Unit]
Description=Botpress Server
After=network.target

[Service]
Type=simple
User=botpress
WorkingDirectory=/home/botpress
ExecStart=/home/botpress/bp start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl enable botpress
systemctl start botpress
```

## 🎯 **Access Botpress**

1. Open browser: `https://bot.108.175.12.154.nip.io` or `http://108.175.12.154:3000`
2. Create admin account
3. Start building your hibachi chatbot!

## 🔧 **Monitoring & Maintenance**

### **Check Status:**
```bash
# Docker method
cd /opt/botpress && docker-compose ps

# Direct method
systemctl status botpress
```

### **View Logs:**
```bash
# Docker method
cd /opt/botpress && docker-compose logs -f botpress

# Direct method
journalctl -u botpress -f
```

### **Backup:**
```bash
# Backup database
pg_dump -h localhost -U botpressuser botpress > botpress_backup_$(date +%Y%m%d).sql

# Backup bot data (Docker method)
tar -czf botpress_data_backup_$(date +%Y%m%d).tar.gz ./botpress_data/
```

## 🚨 **Security Recommendations**

1. **Firewall Setup (Alma Linux):**
```bash
# Configure firewall
systemctl start firewalld
systemctl enable firewalld
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --reload
```

2. **Database Security:**
```bash
# Edit PostgreSQL config
nano /var/lib/pgsql/data/postgresql.conf
# Set: listen_addresses = 'localhost'

# Edit auth config
nano /var/lib/pgsql/data/pg_hba.conf
# Ensure local connections use md5 authentication
systemctl restart postgresql
```

3. **Regular Updates:**
```bash
# Update system monthly
dnf update -y

# Update Botpress (check releases)
# Docker: cd /opt/botpress && docker-compose pull && docker-compose up -d
```

## 📊 **Resource Monitoring**

Monitor your VPS resources:
```bash
# Install monitoring tools
dnf install -y htop iotop nethogs

# Check resource usage
htop
df -h
free -h
```

---

## 🎉 **Your Setup Summary**

After installation, you'll have:
- ✅ Production-ready Botpress on **108.175.12.154**
- ✅ SSL-secured domain: `https://bot.108.175.12.154.nip.io`
- ✅ Database backup system
- ✅ Monitoring capabilities
- ✅ Auto-restart on failures
- ✅ **4GB RAM** - Perfect for hibachi chatbot!
- ✅ **120GB SSD** - Plenty of storage for logs and data

**Access URLs:**
- **Main Access:** `https://bot.108.175.12.154.nip.io`
- **Direct IP:** `http://108.175.12.154:3000` (during setup)
- **Admin Panel:** Same URLs + `/admin`

Ready to build your advanced hibachi chatbot! 🍽️🤖
