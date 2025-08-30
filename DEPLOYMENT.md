# Deployment Guide

This guide provides step-by-step instructions for deploying the Sombeder Service web application to a production hosting environment that supports Node.js (such as Hostinger, DigitalOcean, AWS, etc.).

## Prerequisites

Before you begin, ensure your hosting environment has the following installed:
- **Node.js** (version 18 or higher)
- **npm** (or another package manager like yarn)
- **Git**
- A **PostgreSQL** database accessible from your server.
- **pm2**: A process manager for Node.js to keep your application running. You can install it globally by running:
  ```bash
  npm install pm2 -g
  ```

---

## Deployment Steps

### 1. Get the Application Code

Clone the repository to your server:
```bash
git clone <your-repository-url>
cd sombeder-service
```

### 2. Install Dependencies

Install the required npm packages.
```bash
npm install
```

### 3. Build the Application

Create a production-ready build of the application. This command will compile the frontend and backend code into a `dist` directory.
```bash
npm run build
```

### 4. Configure Environment Variables

Create a `.env` file in the root of the project. This file will store your secret keys and environment-specific configurations.
```bash
touch .env
```
Open the `.env` file and add the following variables, replacing the placeholder values with your actual production credentials:

```env
# The connection string for your production PostgreSQL database
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST:5432/YOUR_DB_NAME"

# A long, random, and secret string used to sign session cookies
SESSION_SECRET="your-super-long-and-secret-session-key"

# The port your application will run on. Your hosting provider may assign this.
PORT=5000

# Set the environment to production
NODE_ENV=production
```

### 5. Start the Application with PM2

Use `pm2` to start your application. `pm2` will automatically restart the app if it crashes and handle other production needs.

```bash
pm2 start "npm run start" --name "sombeder-service"
```
This command starts the application using the `start` script from `package.json` and gives it the name "sombeder-service".

You can check the status and logs of your application using these commands:
```bash
pm2 status        # See the status of all running applications
pm2 logs sombeder-service # View the logs for your app
```

### 6. Set up a Reverse Proxy (Recommended)

For a production environment, it is highly recommended to run your Node.js application behind a reverse proxy using a web server like **Nginx** or **Apache**.

A reverse proxy can handle tasks like:
- **SSL Termination**: Handling HTTPS requests and encrypting traffic.
- **Load Balancing**: Distributing traffic if you run multiple instances of your app.
- **Serving Static Files**: Efficiently serving the static frontend assets from the `dist/public` directory.

Here is a basic example of an Nginx server block that would proxy requests to your application running on port 5000:

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:5000; # Forward requests to your Node.js app
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
You would need to install Nginx and configure this in your server's Nginx configuration files. Remember to also set up SSL with a tool like Let's Encrypt for HTTPS.

---

After completing these steps, your application should be live and accessible at your domain.
