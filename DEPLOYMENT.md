# Deploying Backend to Render

Follow these steps to deploy your Node.js/Express backend to Render.com.

## 1. Create a New Web Service
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.

## 2. Configure the Service
Fill in the following details:

| Field | Value |
|-------|-------|
| **Name** | `tic-tac-toe-backend` (or your preference) |
| **Region** | Choose the one closest to you |
| **Branch** | `main` (or your default branch) |
| **Root Directory** | `backend` (Important: Since your backend is in a subdirectory) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |

## 3. Environment Variables
Scroll down to the **Environment Variables** section and add the following keys. You can copy the values from your local `backend/.env` file.

| Key | Value Description |
|-----|-------------------|
| `MONGO_URI` | Your MongoDB connection string (e.g., from MongoDB Atlas). |
| `GROQ_API_KEY` | Your Groq API Key. |
| `JWT_SECRET` | A secure random string for signing tokens. |

> **Note:** Render automatically sets the `PORT` variable, so you don't need to add it manually. Your code `process.env.PORT || 5000` handles this correctly.

## 4. Deploy
Click **Create Web Service**. Render will start building and deploying your backend. Watch the logs for "Server running on port..." to confirm success.

## 5. Update Frontend
Once deployed, Render will give you a URL (e.g., `https://tic-tac-toe-backend.onrender.com`).
You must update your Frontend API calls to point to this new URL instead of `http://localhost:5000`.

**File to Update:** `src/context/AuthContext.jsx`, `src/pages/Game.jsx`, `src/pages/Leaderboard.jsx`, `src/pages/History.jsx`
**Change:** Replace `http://localhost:5000` with your new Render URL.
