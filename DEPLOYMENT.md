# Deployment Guide

## CI/CD Setup for Portfolio

This project uses GitHub Actions to automatically deploy to your server whenever you push to the main branch.

## Prerequisites

1. **GitHub Repository**: Push this project to GitHub
2. **SSH Access**: Ensure SSH key authentication is set up for the deploy user

## GitHub Secrets Configuration

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### 1. `SERVER_HOST`
```
68.66.251.79
```

### 2. `SERVER_USER`
```
deploy
```

### 3. `SERVER_PORT`
```
7822
```

### 4. `SERVER_SSH_KEY`
Your private SSH key that can authenticate as the `deploy` user. 

**To get your SSH key:**
```bash
# On your local machine
cat ~/.ssh/id_rsa
# or
cat ~/.ssh/id_ed25519
```

Copy the **entire** private key including:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

## Server Preparation

### 1. Clean the portfolio directory (One-time setup)

```bash
ssh -p 7822 deploy@68.66.251.79
cd /var/www/portfolio
rm -rf *
rm -rf .eslintrc.json .git .github .gitignore .hintrc .stylelintrc.json
```

### 2. Set proper permissions

```bash
sudo chown -R deploy:www-data /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio
```

### 3. Configure web server

#### For Nginx:
```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Add/update:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Update with your domain
    
    root /var/www/portfolio;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## How to Deploy

### Automatic Deployment (Recommended)
Simply push to your main branch:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

GitHub Actions will automatically:
1. Build your React app
2. Deploy to `/var/www/portfolio`
3. Your site will be live!

### Manual Deployment (Alternative)

If you need to deploy manually:

```bash
# Build locally
npm run build

# Deploy via SCP
scp -P 7822 -r dist/* deploy@68.66.251.79:/var/www/portfolio/
```

## Troubleshooting

### Check deployment logs
- Go to GitHub repository → Actions tab
- Click on the latest workflow run
- Check each step for errors

### SSH Connection Issues
```bash
# Test SSH connection
ssh -p 7822 deploy@68.66.251.79 "echo 'Connection successful'"
```

### Permission Issues
```bash
# On server
sudo chown -R deploy:www-data /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio
```

### Build Issues
```bash
# Test build locally first
npm run build
```

## Environment Variables

If you need environment variables in production:

1. Create `.env.production` in your project root:
```env
VITE_API_URL=https://your-api.com
```

2. Use in your code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Rollback

To rollback to a previous version:
1. Go to GitHub Actions → Workflows
2. Find the previous successful deployment
3. Click "Re-run jobs"

## Post-Deployment Checks

After deployment, verify:
- [ ] Site loads: http://your-domain.com
- [ ] All routes work (refresh on different pages)
- [ ] Assets load (images, CSS, JS)
- [ ] API calls work (if applicable)
- [ ] Check browser console for errors

## Security Notes

- Never commit secrets to your repository
- Keep SSH keys secure
- Use HTTPS in production (add SSL certificate)
- Consider setting up fail2ban for SSH protection
