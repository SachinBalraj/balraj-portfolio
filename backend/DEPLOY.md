# Deployment Guide (Render)

## 1. Push to GitHub

```bash
cd backend
git init
git add .
git commit -m "Initial backend setup"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

## 2. Deploy on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:

   | Field           | Value                    |
   |-----------------|--------------------------|
   | Name            | balraj-portfolio-api     |
   | Runtime         | Node                     |
   | Build Command   | `npm install`            |
   | Start Command   | `npm start`              |
   | Plan            | Free                     |

5. Add Environment Variables:

   | Variable    | Value                        |
   |-------------|------------------------------|
   | PORT        | 5000                         |
   | MONGO_URI   | Your MongoDB Atlas URI       |
   | EMAIL_USER  | your@gmail.com               |
   | EMAIL_PASS  | Gmail App Password           |
   | CLIENT_URL  | https://your-frontend.com    |
   | NODE_ENV    | production                   |

6. Click **Deploy Web Service**

## 3. Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**
3. Go to **App passwords** (https://myaccount.google.com/apppasswords)
4. Select app: **Mail**, device: **Other** → name it "Balraj Portfolio"
5. Copy the 16-character password
6. Use it as `EMAIL_PASS` in Render env vars

## 4. MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create a free cluster (M0)
3. Click **Connect** → **Connect your application**
4. Copy connection string: `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/balraj-portfolio?retryWrites=true&w=majority`
5. Replace `<user>` and `<password>` with your credentials
6. Use it as `MONGO_URI` in Render env vars

## 5. Update Frontend

In your React app's `.env` (or Render env vars):

```env
VITE_API_URL=https://balraj-portfolio-api.onrender.com
```
