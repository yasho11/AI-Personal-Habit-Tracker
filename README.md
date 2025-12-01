
# Habit Tracker

A full-stack habit tracking application built with **React**, **Zustand**, and **Node.js (Express)** with **MongoDB**.  
Users can create, edit, delete, and track daily habits, with **AI-powered recommendations** for improving habits.

The entire app runs in **Docker** for easy setup and deployment.

---

## Features

- Create, edit, and delete habits
- Mark habits as completed and track streaks
- View stats: total habits, completed habits today, longest streak
- AI-based habit improvement recommendations
- Responsive & modern UI with React + TailwindCSS
- Global state management with Zustand
- JWT-secured API authentication

---

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=5001
JWT_SECRET=7aee72a7f08db0f1dbcdb1d5a15da7fb
MONGO_URI=mongodb://mongo:27017/habitdb
```

> **Important**: In production, use a strong, randomly generated `JWT_SECRET` and never commit it to version control.

---

## Running with Docker

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

### 2. Build the Docker image

```bash
docker build -t habit-tracker .
```

### 3. Run the container

```bash
docker run -d -p 5001:5001 --name habit-tracker habit-tracker
```

The backend API will be available at **http://localhost:5001**.

> Make sure a MongoDB instance is reachable at `mongodb://mongo:27017/habitdb` (as defined in `.env`). You can run a separate MongoDB container if needed:

```

```bash
docker run -d --name mongo -p 27017:27017 mongo
```


## API Endpoints
```

| Method | Endpoint                  | Description                       |
|--------|---------------------------|-----------------------------------|
| POST   | `/api/create`             | Create a new habit                |
| GET    | `/api/viewHabit`          | Fetch all habits                  |
| GET    | `/api/getHabit/:id`       | Fetch a single habit              |
| PUT    | `/api/edit/:id`           | Edit a habit                      |
| DELETE | `/api/delete/:id`         | Delete a habit                    |
| PUT    | `/api/upStreak/:id`       | Mark habit as completed (update streak) |
| GET    | `/api/recommend/:id`      | Get AI-based recommendation       |
| GET    | `/api/search?searchTerm=` | Search habits                     |

```
---


## Tech Stack

**Frontend**
- React
- TailwindCSS
- Zustand
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB + Mongoose

**Authentication**
- JWT

**DevOps**
- Docker


---

## Available Scripts (inside the container)
```
```bash
# Development server (hot-reload)
npm run dev

# Build frontend for production
npm run build

# Start production server
npm start
```

---

## Notes

- Ensure Docker is running before starting the application.
- Never expose the `JWT_SECRET` in production environments.
- The MongoDB container/service must be accessible at the URI specified in `.env`.

Enjoy tracking your habits! 
