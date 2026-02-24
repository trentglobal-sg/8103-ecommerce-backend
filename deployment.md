# Deploy to Render (Backend)

 ## 1) Prerequisites

 - **Git repo**
   - Push this backend to GitHub/GitLab so Render can pull it.

 - **MySQL database**
   - Render does not provide a managed MySQL database.
   - Use an external MySQL provider (or your own hosted MySQL) and ensure you have:
     - Hostname
     - Username
     - Password
     - Database name
     - Port
     - SSL requirement (most managed DBs require SSL)

 ## 2) Create the Render Web Service

 1. Go to Render Dashboard
 2. New +
 3. Web Service
 4. Connect your repository
 5. Configure:
    - **Environment**: Node
    - **Branch**: your deployment branch
    - **Build Command**:
      - `npm install`
    - **Start Command**:
      - `node index.js`

 Notes:
 - Your server listens on `process.env.PORT || 3000`. Render sets `PORT` automatically.
 - This repo does not define `npm start`, so use `node index.js` as the start command.

 ## 3) Set Render Environment Variables

 In the Render service:
 - Settings
 - Environment
 - Add the following variables:

 ### Database

 - `DB_HOST`
 - `DB_USER`
 - `DB_PASSWORD`
 - `DB_NAME`
 - `DB_PORT`

 ### Auth

 - `JWT_SECRET`

 ### Stripe (if you are using Stripe endpoints)

 - `STRIPE_SECRET_KEY`
 - `STRIPE_WEBHOOK_SECRET`

 ## 4) Database SSL

 `database.js` is already configured to connect with SSL enabled and:
 - `rejectUnauthorized: false`

 This is commonly required for managed DBs that provide SSL without a custom CA bundle.

 ## 5) Deploy

 1. Click **Create Web Service**
 2. Wait for the first build and deploy to complete
 3. Open the service URL and verify the health route:
    - `GET /` should return:
      - `{ "message": "It's alive" }`

 ## 6) Stripe webhook setup (optional)

 If you want Stripe webhook events to work in production:
 - Your endpoint path is:
   - `POST /api/stripe/webhook`
 - In Stripe Dashboard:
   - Developers
   - Webhooks
   - Add endpoint
   - Set the URL to:
     - `https://<your-render-service>.onrender.com/api/stripe/webhook`
   - Copy the signing secret into Render as `STRIPE_WEBHOOK_SECRET`

 ## 7) Common issues

 - **App crashes immediately**
   - Confirm all required env vars are set in Render (especially `JWT_SECRET` and DB values).

 - **DB connection fails**
   - Confirm `DB_PORT` is set correctly.
   - Confirm the DB provider allows inbound connections from Render.
   - Confirm SSL is required/allowed by your DB provider.
