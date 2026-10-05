# Personal Finance Intelligence

A full-stack personal finance management application designed to help users manage transactions, budgets, financial goals, recurring expenses, and personal finance information through a clean and professional web interface.

The project combines a **React + TypeScript frontend**, **FastAPI backend**, **PostgreSQL database**, and an **AI-powered Botpress chatbot** for application assistance and general personal-finance FAQs.

---

## Project Overview
 
**Personal Finance Intelligence** is a full-stack web application developed to provide users with a centralized platform for managing their personal finances.

Instead of maintaining financial information across multiple places, users can use the application to organize transactions, categories, budgets, goals, and recurring expenses from a single dashboard.

The application also includes an integrated chatbot that helps users understand the application's features and provides simple educational information about general personal-finance concepts.

The project was developed as a full-stack internship and portfolio project with a focus on:

- Clean and responsive UI
- REST API development
- Authentication and protected routes
- Database integration
- State management
- Modular frontend architecture
- Practical backend development
- AI chatbot integration

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Protected application routes
- Automatic authentication handling
- Logout functionality

### Dashboard

- Personalized dashboard
- Welcome message using the logged-in user's information
- Centralized access to financial modules
- Responsive dashboard layout

### Transactions

- Add financial transactions
- Manage income and expenses
- Search transactions
- Filter transactions by type
- Filter transactions by category
- Organized transaction management

### Categories

- Organize transactions using categories
- Dedicated categories section
- Category-based transaction filtering

### Budgets

- Dedicated budget management section
- Organize financial planning around spending limits

### Financial Goals

- Create and manage financial goals
- Track financial planning objectives

### Recurring Expenses

- Manage recurring financial expenses
- Dedicated recurring-expenses section

### Profile

- View user information
- Manage profile details
- Display user identity using a personalized avatar
- Currency information

### Settings

- Application settings
- Theme customization
- User preference management

### Password & Security

- Dedicated password and security section
- Protected access through authenticated routes

### AI Chatbot

The application includes a **Botpress-powered chatbot** that can help users with:

- Application FAQs
- Dashboard usage
- Transactions
- Categories
- Budgets
- Financial goals
- Recurring expenses
- Profile and settings
- General personal-finance concepts

The chatbot is designed to provide short, beginner-friendly responses.

It does **not** provide professional investment, tax, legal, or financial advice.

---

# Technology Stack

## Frontend

| Technology    | Purpose                             |
| ------------- | ----------------------------------- |
| React         | Building the user interface         |
| TypeScript    | Type-safe JavaScript development    |
| Vite          | Frontend development and build tool |
| Tailwind CSS  | Styling and responsive UI           |
| Redux Toolkit | Managing shared application state   |
| React Redux   | Connecting Redux with React         |
| React Router  | Client-side routing                 |
| Axios         | HTTP requests to the backend        |
| Lucide React  | UI icons                            |

## Backend

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| Python     | Backend programming language    |
| FastAPI    | Building REST APIs              |
| SQLAlchemy | Database ORM                    |
| Pydantic   | Data validation and schemas     |
| Alembic    | Database migrations             |
| Uvicorn    | Running the FastAPI application |

## Database

| Technology | Purpose                 |
| ---------- | ----------------------- |
| PostgreSQL | Relational database     |
| pgAdmin    | Database administration |

## AI / Chatbot

| Technology | Purpose                                |
| ---------- | -------------------------------------- |
| Botpress   | Application chatbot and FAQ assistance |

## Development Tools

* Visual Studio Code
* Git
* GitHub
* PowerShell
* npm
* Python Virtual Environment

---

# Project Architecture

The application follows a frontend-backend architecture.

```
                    ┌──────────────────────┐
                    │        User          │
                    └──────────┬───────────┘
                               │
                               ▼
                 ┌──────────────────────────┐
                 │   React + TypeScript     │
                 │        Frontend          │
                 └────────────┬─────────────┘
                              │
                         Axios / HTTP
                              │
                              ▼
                 ┌──────────────────────────┐
                 │       FastAPI            │
                 │        Backend           │
                 └────────────┬─────────────┘
                              │
                         SQLAlchemy
                              │
                              ▼
                 ┌──────────────────────────┐
                 │       PostgreSQL         │
                 │        Database          │
                 └──────────────────────────┘


                 ┌──────────────────────────┐
                 │       Botpress           │
                 │      AI Chatbot          │
                 └──────────────────────────┘
```

### Frontend Responsibilities

The frontend handles:

* User interface
* Client-side routing
* Protected routes
* Authentication state
* User interactions
* Form handling
* Search and filtering
* Theme management
* API communication

### Backend Responsibilities

The backend handles:

* REST API endpoints
* Authentication
* User management
* Request validation
* Business logic
* Database communication
* Error handling

### Database Responsibilities

PostgreSQL is responsible for persistent storage of application data.

---

# Project Structure

A simplified structure of the project is:

```
Personal-Finance-Intelligence/
│
├── app/
│   ├── ...
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
├── alembic.ini
├── requirements.txt
└── README.md
```

---

# Authentication Flow

The application uses token-based authentication.
The basic authentication flow is:

```
User
 │
 ▼
Login / Register
 │
 ▼
FastAPI Authentication API
 │
 ▼
Access Token
 │
 ▼
Frontend stores authentication state
 │
 ▼
Protected Routes
 │
 ▼
Authenticated Application
```

Unauthenticated users are redirected to the login page when attempting to access protected application pages.

---

# Backend API

The backend is developed using **FastAPI**.
During local development, the API runs at:

```
http://127.0.0.1:8000
```

FastAPI also provides interactive API documentation during development.
Common backend functionality includes:

* User registration
* User authentication
* Current-user information
* User profile management
* Database operations
* Protected API access

---

# Database

The application uses **PostgreSQL** as its relational database.
The backend uses **SQLAlchemy** to communicate with PostgreSQL and **Alembic** to manage database schema migrations.

The database contains application data such as:
* Users
* Categories
* Transactions
* Other financial information

Database credentials and sensitive configuration values are stored using environment variables.
Sensitive `.env` files are excluded from Git using `.gitignore`.
---

# Database Migrations

Alembic is used to manage database schema changes.
To apply available migrations:

```bash
alembic upgrade head
```

This allows the database schema to be updated in a controlled and versioned way.

---

# AI Chatbot

The application integrates **Botpress** as an AI-powered assistant.
The chatbot is designed primarily for application assistance and frequently asked questions.

### Example questions

Users can ask:

```
What can I do on the dashboard?
```

```
How do I add a transaction?
```

```
What is a budget?
```

```
What are financial goals?
```

```
What are recurring transactions?
```

```
What can I change in Settings?
```

The chatbot also provides basic educational explanations of concepts such as:

* Income
* Expenses
* Budgeting
* Saving
* Spending habits

### Safety

The chatbot does not act as a professional financial advisor.
It should not be used for:
* Investment decisions
* Tax advice
* Legal advice
* Professional financial advice

---

# UI & UX

The frontend focuses on providing a clean and professional user experience.
The interface includes:
* Responsive layout
* Sidebar navigation
* Dashboard navigation
* Protected application pages
* Responsive mobile/tablet navigation
* Consistent spacing and typography
* Theme customization
* Interactive forms
* Search and filtering
* Modal-based transaction creation
* Icon-based UI elements using Lucide React

---

# Responsive Design

The application is designed to work across different screen sizes.
The frontend provides responsive layouts for:

* Desktop
* Laptop
* Tablet
* Mobile

The sidebar and navigation behavior adapt according to the available screen size.

---

# Installation & Setup

## Prerequisites
Make sure the following are installed:

* Python
* Node.js
* npm
* PostgreSQL
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/Harshi2415/Personal-Finance-Intelligence.git
```

Move into the project directory:

```bash
cd Personal-Finance-Intelligence
```

> Replace `Harshi2415` with your GitHub username.

---

# Backend Setup

## 2. Create a Virtual Environment

From the project root:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```
---

## 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```
---

## 4. Configure Environment Variables

Create a `.env` file in the appropriate backend location and add the required configuration values.
Example:

```env
DATABASE_URL=your_database_connection_string
SECRET_KEY=your_secret_key
```

Do not commit your actual `.env` file to GitHub.
---

## 5. Configure PostgreSQL
Make sure PostgreSQL is installed and running.
Create the required database and configure the connection details in your environment variables.
---

## 6. Run Database Migrations

```bash
alembic upgrade head
```
---

## 7. Start the Backend
Run:
```bash
python -m uvicorn app.main:app --reload
```
The backend will be available at:

```
http://127.0.0.1:8000
```
FastAPI documentation can be accessed through the local API documentation endpoint provided by FastAPI.

---

# Frontend Setup
Open another terminal.
Move into the frontend:

```powershell
cd frontend
```
Install dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

Vite will provide the local frontend URL in the terminal.

---

# Environment & Security

Sensitive information should never be committed to the repository.

The following should remain private:

* Database passwords
* Secret keys
* API keys
* Access tokens
* Personal credentials
* Private environment variables

The project uses `.gitignore` to prevent sensitive and unnecessary files from being uploaded.

---

# Development

During development, the application can be run using two terminals.

### Terminal 1 — Backend

```powershell
python -m uvicorn app.main:app --reload
```

### Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

The frontend communicates with the FastAPI backend through HTTP API requests.

---

# Key Concepts Demonstrated

This project demonstrates practical understanding of:

* Full-stack web development
* REST API development
* React component architecture
* TypeScript
* Client-side routing
* Protected routes
* Authentication
* JWT-based authorization
* Redux Toolkit
* Axios
* HTTP requests
* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* Database migrations
* Alembic
* Environment variables
* Responsive UI design
* Tailwind CSS
* Git and GitHub
* AI chatbot integration

---

# Future Improvements

Possible future improvements include:
* Advanced financial analytics
* Interactive charts and visual reports
* Automated monthly financial summaries
* Spending pattern analysis
* More advanced AI-powered financial insights
* Transaction export functionality
* PDF financial reports
* More detailed notification and reminder features
* Improved chatbot capabilities
* Mobile application
* Additional financial planning tools

---

# Project Goals

The main goals of the project are:

1. Provide users with a centralized personal finance management platform.
2. Demonstrate practical full-stack development skills.
3. Implement secure authentication and protected routes.
4. Connect a React frontend with a FastAPI backend.
5. Store application data using PostgreSQL.
6. Demonstrate database migrations using Alembic.
7. Provide a responsive and professional user interface.
8. Integrate an AI chatbot for application assistance.
9. Build a project that demonstrates practical skills relevant to real-world software development.

---

# Author
## Harshita
**BCA — Computer Applications**
Full-Stack Development | React | TypeScript | Python | FastAPI | PostgreSQL
This project was developed as a full-stack internship and portfolio project.

---

# License
This project is intended primarily for educational, internship, and portfolio purposes.
---

If you find this project interesting, feel free to explore the repository and its implementation.