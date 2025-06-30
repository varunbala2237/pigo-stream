# PigoStream v0.2.0 Final

## ⚠️ Important Notice

> This React application is built with react-scripts@5.0.1, which is the final and currently outdated version of Create React App (CRA).
While it still works reliably for development and deployment, CRA is now in maintenance mode and not recommended for new projects.
>
> If you're starting a new project or planning long-term development, consider migrating to more modern alternatives like:
> - Vite — A fast, lightweight build tool and dev server for modern frontend apps
> - Next.js — A powerful React framework with built-in SSR and API routes
> - Remix — A full-stack web framework with focus on data and routing
>
> That said, this project remains fully functional, and you can continue using it as-is for development, learning, or deployment.
> Migration is optional and can be planned incrementally over time.

## 🧾 Overview

PigoStream is a full-stack streaming platform featuring:

- React frontend deployed on Firebase  
- Node.js/Express backend deployed on Render  
- Firebase for authentication & real-time database  
- Supabase PostgreSQL for session management  
- TMDB API for movies and TV shows metadata
- AniList integration for anime metadata by mapping TMDB titles and release dates

## 🛠️ Backend Service

The backend is a Node.js/Express.js server responsible for:

- Managing user sessions
- Handling recommendations
- Interacting with Firebase and Supabase databases

### ⚙️ How to Set Up and Deploy the Backend

1. Create your own backend project, for example:  
   `server/server.js`

2. Create `package.json` by running:  
   `npm init`
   
4. Install `node_modules` by running:  
   `npm install`

5. Create a `.env` file in the root directory and add your environment variables, for example:  
   ```env
   PORT=3001  
   FIREBASE_CONFIG=your_firebase_config  
   SUPABASE_URL=your_supabase_url    
   TMDB_API_KEY=your_tmdb_api_key    
   ...
   ```

6. Run the backend locally with:  
   `npm start`  
   This will start the server on `http://localhost:3001`.

7. To deploy on Render (or any cloud platform):  
   - Push your backend code to a Git repository.  
   - Create a new Web Service on Render and connect the repository.  
   - Set your environment variables in Render’s dashboard.  
   - Render will automatically build and deploy your backend server.

## 🔁 GitHub Actions & Automated Workflows

Using GitHub Actions to automate key tasks and ensure backend stability.

### ✅ Active Workflows

| Workflow Name                              | Purpose                                                                 |
|--------------------------------------------|-------------------------------------------------------------------------|
| **Keep Server Alive**                     | Periodically pings the live server to prevent cold starts.              |

### ⏲️ Execution Strategy

- **Scheduled**:
  - `Keep Server Alive`: every ~7 minutes
  
> All workflows are defined under `.github/workflows/`.

## 🧱 Full Project Stack

- 📺 React frontend hosted on [Firebase](https://firebase.google.com/)  
- 🌐 Node.js/Express backend hosted on [Render](https://dashboard.render.com/)

## 🔐 Authentication

- Firebase Authentication manages user sign-up and login  
- Email verification is required to activate accounts

## 🌍 APIs Used

- TMDB API provides metadata for movies and TV shows  
- Visit [TMDB](https://www.themoviedb.org/) for more information

## 🗄️ Databases

- Firebase Realtime Database and Firestore for realtime data storage  
- Supabase PostgreSQL used for session pooling

## 🚀 Getting Started with React Frontend

This React app was bootstrapped using [Create React App](https://github.com/facebook/create-react-app).

### ⚡ Quick Start

1. Install frontend dependencies:  
   `npm install`

2. Run the app in development mode:  
   `npm start`  
   Open `http://localhost:3000` in your browser to view it. The app will reload automatically on code changes.

3. Build the app for production:  
   `npm run build`  
   This generates an optimized build in the `build` folder, ready for deployment.

## 📚 Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)  
- [React Official Documentation](https://reactjs.org/)

Feel free to contribute or ask questions.  
Happy streaming! 🚀
