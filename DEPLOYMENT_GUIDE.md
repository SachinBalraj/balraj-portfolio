# Deployment Guide — Balraj Portfolio

---

## 1. MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create a ** free M0 cluster** (or any tier)
3. Under **Security** → **Database Access**, create a database user with read/write privileges
4. Under **Security** → **Network Access**, add `0.0.0.0/0` (allow all) for production, or your Render IP
5. Click **Connect** → **Connect your application**
6. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/balrajPortfolio?retryWrites=true&w=majority&appName=<cluster-name>
   ```
7. Replace `<username>`, `<password>`, `<cluster>`, `<cluster-name>` with your values

---

## 2. Backend — Deploy on Render

### Prerequisites
- Push backend/ to a GitHub repository

### Steps

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Configure:

   | Field           | Value                    |
   |-----------------|--------------------------|
   | Name            | balraj-portfolio-api     |
   | Runtime         | Node                     |
   | Build Command   | `npm install`            |
   | Start Command   | `npm start`              |
   | Root Directory  | `backend`                |

5. Add Environment Variables:

   | Variable     | Value                              |
   |--------------|------------------------------------|
   | PORT         | `5000`                             |
   | MONGO_URI    | Your MongoDB Atlas connection string |
   | EMAIL_USER   | (optional) Gmail address           |
   | EMAIL_PASS   | (optional) Gmail app password      |
   | CLIENT_URL   | Your Vercel frontend URL           |
   | NODE_ENV     | `production`                       |

6. Click **Deploy Web Service**

### Gmail App Password (for email notifications)

1. Enable 2-Step Verification on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an app password for **Mail**
4. Use it as `EMAIL_PASS` in Render env vars

---

## 3. Frontend — Deploy on Vercel

### Prerequisites
- Push businessman-portfolio/ to a GitHub repository

### Steps

1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Import your GitHub repo
4. Set **Root Directory** to `businessman-portfolio`
5. Add Environment Variable:

   | Variable       | Value                                        |
   |----------------|----------------------------------------------|
   | VITE_API_URL   | `https://balraj-portfolio-api.onrender.com`  |

6. Click **Deploy**

### Build Settings (Vercel auto-detects Vite)

| Field          | Value            |
|----------------|------------------|
| Framework      | Vite             |
| Build Command  | `npm run build`  |
| Output Dir     | `dist`           |

---

## 4. Environment Variables Summary

### Backend (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/balrajPortfolio?retryWrites=true&w=majority
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Frontend (`businessman-portfolio/.env`)

```
VITE_API_URL=https://balraj-portfolio-api.onrender.com
```

---

## 5. Production URLs

| Service  | URL                                                |
|----------|----------------------------------------------------|
| Backend  | `https://balraj-portfolio-api.onrender.com`        |
| Frontend | `https://your-vercel-app.vercel.app`               |
| MongoDB  | `mongodb+srv://...` (Atlas cluster)                |

---

## 6. Verify Deployment

After deploying:

```bash
# Health check
curl https://balraj-portfolio-api.onrender.com

# Contact API
curl https://balraj-portfolio-api.onrender.com/api/contact

# Consultation API
curl https://balraj-portfolio-api.onrender.com/api/consultation

# Test POST
curl -X POST https://balraj-portfolio-api.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"1234567890","subject":"Test","message":"Hello"}'
```

---

## 7. API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/`                         | Health check             |
| GET    | `/api/contact`              | Contact API test         |
| POST   | `/api/contact`              | Submit contact form      |
| GET    | `/api/consultation`         | Consultation API test    |
| POST   | `/api/consultation`         | Submit consultation form |
| GET    | `/api/health`               | Server health            |

---

## 8. MongoDB Collections

Once forms are submitted, the following collections are auto-created in your Atlas cluster:

- `contacts` — Contact form submissions
- `consultations` — Consultation booking submissions

Each document includes `createdAt` and `updatedAt` timestamps.
