# ChatAppMern

A real-time chat application supporting both **WebSocket (ws package)** and **Socket.IO**, built with **React (Vite)**, **TailwindCSS**, **DaisyUI**, **Zustand** for state management, and **Express** for backend.

---

## 🚀 Preview
Live App : https://chatappviren.onrender.com

---

## 📂 Project Structure 

```
root/
│
├── server/ # Backend
| ├── src/
| ├── ├── controllers/ # Controllers for handling API requests
| ├── ├── helpers/
| ├── ├── lib/ # Utility files
| ├── ├── middleware/
| ├── ├── models/ # Mongoose models
| ├── ├── routes/ # Express routes
| ├── ├── index.js # Entry point for backend
│ ├── .env # Environment variables
|
├── client/ # Frontend
│ ├── src/ # React source code
│ │ ├── components/ # UI components
│ │ ├── pages/ # Pages
│ │ ├── store/ # Zustand store
│ │ ├── App.jsx # App entry
│ │ └── main.jsx # Vite entry
│ ├── index.html # HTML template
│ └── vite.config.js # Vite config
│
├── .gitignore
├── package.json # Root package
└── README.md

```


---

## 🛠 Tech Stack

**Frontend**:   
- React (Vite)  
- TailwindCSS  
- DaisyUI  
- Zustand  

**Backend**:  
- Express  
- MongoDB & Mongoose  
- ws package (WebSocket) / Socket.IO  
- Cloudinary (for image uploads)  

---

## ⚙️ How to Run Locally

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd <your-project-folder>
```
### 2️⃣ Backend Setup (server)
```bash
cd server
npm install
```

Create a ```.env``` file inside ```server/``` and add your environment variables:
```
PORT=5001
mongoURI=your_mongo_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```
Start the backend:
```
npm run dev
```
### 3️⃣ Frontend Setup (client)
```
cd ../client
npm install
```
Start the frontend:
```
npm run dev
```

### 4️⃣ Serving Frontend from Backend In Production

If serving React build from backend:
```
cd client
npm run build
cd ../server
npm run start
```
Add this code to your server/index.js file : 
```
// Put this BEFORE your API routes
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}
// Catch-all route (AFTER API routes)
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}
```
The Express server will serve the built React files from ```client/dist```.

## 📜 .gitignore
```
# Node modules
node_modules/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Build output
dist/
build/

# Environment files
.env
.env.local

# IDE settings
.vscode/
.idea/
*.swp

```



---

## 📌 Features

- Real-time chat using ws and Socket.IO
- Private messaging
- Image upload via Cloudinary
- Zustand state management for global store
- Responsive UI with TailwindCSS + DaisyUI
- Serve frontend from Express backend
---
