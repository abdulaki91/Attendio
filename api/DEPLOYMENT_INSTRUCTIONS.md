# Deployment Instructions for cPanel

## Current Issue

Your Node.js application is not running properly on production. The web server is serving static files instead of proxying to Node.js.

## Step-by-Step Fix

### 1. Install Dependencies on Production

In cPanel Terminal or SSH:

```bash
cd /home/abdikoue/repositories/Attendio/api
npm install
```

Or use cPanel Node.js interface "Run NPM Install" button.

### 2. Configure Node.js App in cPanel

Go to cPanel → Software → Node.js

**Application Settings:**

- **Application Root**: `/home/abdikoue/repositories/Attendio/api`
- **Application URL**: `https://attendio-backend.abdiko.com`
- **Application Startup File**: `server.js` (use the CommonJS version)
- **Node.js Version**: 18.x or higher (latest available)

**Environment Variables** (Add these):

```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
PORT=8000
```

### 3. Check the Port Number

In cPanel Node.js interface, note the port number assigned to your app (usually shown in the interface).

If it's different from 8000, update the `.htaccess` file:

```apache
RewriteRule ^(.*)$ http://127.0.0.1:YOUR_PORT/$1 [P,L]
```

### 4. Upload Files

Upload these files to production:

- `api/.htaccess` (with correct port)
- `api/server.js` (CommonJS version)
- `api/.env` (with your credentials)
- `api/package.json`

### 5. Start the Application

In cPanel Node.js interface:

- Click "Stop" if running
- Click "Start"
- Check status shows "Running"

### 6. Test the Endpoints

Test these URLs in your browser:

- `https://attendio-backend.abdiko.com/ping` - Should return JSON
- `https://attendio-backend.abdiko.com/api/users/login` - Should accept POST requests

### 7. Check Logs

In cPanel Node.js interface, check the logs for any errors.

## Common Issues

### Issue 1: "Cannot find module"

**Solution**: Run `npm install` in the application directory

### Issue 2: "Port already in use"

**Solution**: Stop other Node.js apps or change the port

### Issue 3: "Static files being served"

**Solution**: Check `.htaccess` is properly configured and uploaded

### Issue 4: "CORS errors persist"

**Solution**: Ensure Node.js app is actually running (check logs)

## Verification

Once working, you should see:

1. Node.js status: "Running" in cPanel
2. `https://attendio-backend.abdiko.com/ping` returns JSON (not HTML/JS code)
3. No CORS errors in browser console
4. Login endpoint accepts requests

## Alternative: Use Passenger

If the above doesn't work, cPanel might be using Passenger. Create a `passenger_wsgi.py` or configure Passenger to run Node.js apps.

## Need Help?

Check these in cPanel:

1. Node.js interface - Is the app running?
2. Error logs - Any startup errors?
3. Port number - What port is assigned?
4. File permissions - Are files readable?
