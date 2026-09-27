# Deployment Guide for Household OS on Hostinger VPS

## 1. Prerequisites on Hostinger VPS
Ensure you have SSH access to your Hostinger VPS:
```bash
ssh root@YOUR_HOSTINGER_VPS_IP
```

Check that Node.js, Docker/MongoDB, and NGINX are present:
```bash
# Update repositories
apt update && apt upgrade -y

# Install Node.js (LTS) & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx
npm install -g pm2
```

## 2. Shared MongoDB Configuration
If MongoDB is already running on the VPS, create a dedicated database and user for Household OS:
```bash
mongosh
```
Inside the `mongosh` shell:
```javascript
use household_os
db.createUser({
  user: "household_user",
  pwd: "StrongHouseholdPasswordHere",
  roles: [ { role: "readWrite", db: "household_os" } ]
})
```

## 3. Deploying the Backend API
Clone or copy the `server` directory to `/var/www/household-os-api`:
```bash
mkdir -p /var/www/household-os-api
cd /var/www/household-os-api
```
Create `.env`:
```env
PORT=4000
MONGODB_URI=mongodb://household_user:StrongHouseholdPasswordHere@127.0.0.1:27017/household_os?authSource=household_os
JWT_SECRET=your_super_secret_jwt_key
EXPO_ACCESS_TOKEN=your_expo_token
```

Install and start with PM2:
```bash
npm install
npm run build
pm2 start dist/server.js --name "household-os-api"
pm2 save
pm2 startup
```

## 4. NGINX Reverse Proxy with SSL (Domain / Subdomain)
Configure `/etc/nginx/sites-available/household-api.conf`:
```nginx
server {
    server_name api.yourhouseholddomain.com;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable and obtain SSL certificate:
```bash
ln -s /etc/nginx/sites-available/household-api.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
certbot --nginx -d api.yourhouseholddomain.com
```

## 5. Mobile App Configuration
In `household-os/src/services/api.ts`:
Set `API_BASE_URL = 'https://api.yourhouseholddomain.com/api'` or your VPS IP with HTTPS.
