# Habit Tracker Application

This is a full-stack habit tracker application built with **React** for the frontend and **Node.js** with **Express** for the backend. The application uses **MongoDB** as the database and integrates with **Mistral API** for habit recommendations. The project also includes user authentication, habit management, and a points system to track user progress.

## Features

- **User Authentication**: Users can register, log in, and manage their profiles.
- **Habit Management**: Users can create, update, and delete habits.
- **Habit Tracking**: Users can mark habits as "Done" and track their streaks.
- **Points System**: Users earn points based on their habit streaks.
- **Recommendations**: The app provides AI-based recommendations for improving habits using the Mistral API.
- **Responsive Design**: The frontend is designed to be responsive and user-friendly.

## Technologies Used

- **Frontend**: React, TypeScript, CSS Modules
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **AI Integration**: Mistral API for habit recommendations
- **Cron Jobs**: Node-cron for resetting habit statuses daily

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running locally
- Mistral API running locally (optional for recommendations)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/habit-tracker.git

2. Navigate to the backend directory:
    ````bash


    cd habit-tracker/backend

3. Install dependencies:
    ```bash
    npm install

4. Create a .env file in the root of the backend directory and add the following:
    ```env

    JWT_SECRET=your_jwt_secret
    MONGO_URI=mongodb://127.0.0.1:27017/HabitTracker

5. Start the backend server:
    ```bash
   
    npm start

###Frontend Setup

1. Navigate to the frontend directory:
    ```bash

    cd habit-tracker/frontend

2. Install dependencies:
    ```bash


    npm install

3. Start the frontend development server:
    ```bash


    npm run dev

Running the Application

    The backend will run on http://localhost:5000.

    The frontend will run on http://localhost:5173.
