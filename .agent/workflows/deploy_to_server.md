---
description: How to build and run the application on a server
---

To run this React application in a production environment on your server, follow these steps:

1. **Build the Application**
   Create an optimized production build. This generates a `build` folder containing static files.
   ```bash
   npm run build
   ```

2. **Install a Static File Server**
   You need a lightweight server to serve the static files. `serve` is a popular choice.
   ```bash
   // turbo
   sudo npm install -g serve
   ```

3. **Run the Application**
   Serve the content of the `build` folder.
   - `-s`: Single-page application mode (rewrites 404s to index.html)
   - `-l 3000`: Listen on port 3000 (optional, default is 3000)
   ```bash
   serve -s build -l 3000
   ```

   **Alternative: Using PM2 (for keeping it alive)**
   If you want the app to stay running even if you close the terminal:
   ```bash
   // turbo
   sudo npm install -g pm2
   pm2 start serve --name "booking-ui" -- -s build -l 3000
   pm2 save
   ```

## Other Options
- **Docker**: Create a Dockerfile to containerize the app.
- **Nginx**: Configure Nginx to serve the `build` directory directly.
