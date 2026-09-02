#!/bin/bash
set -e

DOMAIN="stathub.yeeshu.dev"
# Frontend app port (inside and outside the container)
APP_PORT="8080"
EMAIL="workwithyeeshu@gmail.com"

echo "Updating packages..."
sudo apt update

echo "Installing nginx and certbot..."
sudo apt install -y nginx certbot python3-certbot-nginx

echo "Creating nginx config..."

sudo tee /etc/nginx/sites-available/stathub > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;

    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;

        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

echo "Enabling nginx site..."

sudo ln -sf \
  /etc/nginx/sites-available/stathub \
  /etc/nginx/sites-enabled/stathub

sudo rm -f /etc/nginx/sites-enabled/default

echo "Testing nginx config..."
sudo nginx -t

echo "Restarting nginx..."
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "Requesting Let's Encrypt certificate..."

sudo certbot --nginx \
  -d "$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --redirect \
  --non-interactive

echo "Testing nginx again..."
sudo nginx -t

echo "Reloading nginx..."
sudo systemctl reload nginx

echo "Testing certificate renewal..."
sudo certbot renew --dry-run

echo "Setup complete."
echo "https://$DOMAIN"
