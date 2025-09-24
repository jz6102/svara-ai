# SvaraAI - Task & Project Management System

A full-stack task and project management application built for the SvaraAI Full Stack Developer internship assignment. The application features a secure, token-based authentication system, project organization, and an intuitive drag-and-drop Kanban board for task management, all wrapped in a clean, modern, and responsive user interface.

## 🚀 Live Demo & Video

-   **Live Site:** **[svara-ai-task-manager](https://svara-ai-frontend-fjsjhs845-jaikanna-bs-projects.vercel.app/)**
-   **Demo Video:** **[Watch the Walkthrough](https://drive.google.com/file/d/13rbNdIyYMT8HEH0OFizO04DrSabVVrcw/view?usp=sharing)**
---

## ✨ Features

-   **Secure Authentication:** Full user authentication (Signup, Login, Logout) with JSON Web Tokens (JWT).
-   **Project Management:** Users can create, list, and delete their projects.
-   **Interactive Kanban Board:** A board is generated for each project with "To Do", "In Progress", and "Done" columns.
-   **Drag & Drop Functionality:** Seamlessly update task statuses by dragging and dropping cards between columns.
-   **Task Operations:** Create, edit, and delete tasks within a project through an intuitive modal form.
-   **Visual Priorities:** Tasks are color-coded (High, Medium, Low) for quick visual identification.
-   **Dynamic Dashboard:** A summary dashboard provides at-a-glance statistics on total projects and tasks.
-   **Data Visualization:** A bar chart on the dashboard visualizes the current distribution of tasks by status.
-   **Responsive Design:** The UI is fully responsive and provides a great user experience on all screen sizes.

---

## 🛠️ Tech Stack

| Area       | Technologies                                                                                                 |
| :--------- | :----------------------------------------------------------------------------------------------------------- |
| **Frontend** | Next.js 15, React.js, Tailwind CSS, Recharts, dnd-kit, Axios, Sonner (for notifications)                      |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt.js, CORS                                               |
| **Testing** | Jest, Supertest                                                                                            |
| **Deployment**| Vercel (Frontend), Render (Backend)                                                                          |

---

## 🏗️ Architecture & Folder Structure

The project is organized as a monorepo with separate directories for the `frontend` and `backend`, ensuring a clear separation of concerns.

### Project root

```text
/svara-ai-assignment
├── backend/                     # Backend (Node.js, Express, MongoDB)
│   └── src/
│       ├── controllers/         # Handles HTTP requests and responses
│       ├── services/            # Core business logic (called by controllers)
│       ├── models/              # Mongoose schemas (Users, Projects, Tasks)
│       ├── routes/              # API route definitions
│       ├── middlewares/         # Middleware (JWT verification, auth checks)
│       └── config/              # Database connection & environment setup
│
├── frontend/                    # Frontend (Next.js 15, React, Tailwind)
│   └── src/
│       ├── app/                 # Next.js App Router, pages, and layouts
│       ├── components/          # Reusable React components (Buttons, Modals, Cards)
│       ├── context/             # Global state management (AuthContext)
│       └── lib/                 # Helper functions (API service wrapper)
│
├── .gitignore                   # Git ignore file
├── package.json                 # Root dependencies & scripts (if using workspaces)
├── README.md                    # Project documentation
└── LICENSE                      # Open-source license (MIT)
```

---

## 📂 Backend (Expanded)

The backend follows a modular, three-tier architecture to promote maintainability and scalability, adhering to SOLID principles.

- **Controllers:** Handle incoming HTTP requests and outgoing responses. They are responsible for the request/response cycle and input validation.
- **Services:** Contain the core business logic. They are called by controllers and interact with the repository layer.
- **Models:** Define the Mongoose schemas and data structures for the application (Users, Projects, Tasks).

```text
/backend
└── src
    ├── controllers/     # authController.js, projectController.js, taskController.js
    ├── services/        # authService.js, projectService.js, taskService.js
    ├── models/          # User.js, Project.js, Task.js (Mongoose schemas)
    ├── routes/          # auth.routes.js, project.routes.js, task.routes.js
    ├── middlewares/     # auth.middleware.js (JWT verification)
    └── config/          # db.js, index.js, env.js
```

## 🎨 Frontend (Expanded)

The frontend uses Next.js 15's App Router for file-based routing and organization. Reusable components and a global context for authentication promote DRY principles.

```text
/frontend
└── src
    ├── app/             # layout.tsx, page.tsx, dashboard/, projects/, auth/
    ├── components/      # Button.tsx, Modal.tsx, KanbanBoard/, TaskCard.tsx
    ├── context/         # AuthContext.tsx, useAuth.ts
    └── lib/             # api.ts (Axios wrapper), helpers.ts
```


---

## ⚙️ Setup and Installation (For Local Development)

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   A free MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/svara-ai-assignment.git
cd svara-ai-assignment
```

### 2. Setup the Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the /backend root and add your variables
# (See the Environment Variables section below)

# Start the server
npm start
```

The backend server will be running on http://localhost:5001.

### 3. Setup the Frontend

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at http://localhost:3000.

### 🔒 Environment Variables
For the backend to connect to the database and manage authentication, you need to create a .env file in the /backend directory with the following variables:

```env
# Your MongoDB connection string from Atlas
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/yourDatabaseName?retryWrites=true&w=majority"

# A long, random, and secret string for signing JWTs
JWT_SECRET="your_super_secret_jwt_key"
```

### 🔌 API Endpoints
The backend provides the following RESTful API endpoints:

| Method | Endpoint | Protected | Description |
| ------ | -------- | --------- | ----------- |
| POST | /api/auth/signup | No | Register a new user. |
| POST | /api/auth/login | No | Log in a user and get a token. |
| POST | /api/projects | Yes | Create a new project. |
| GET | /api/projects | Yes | Get all projects for the user. |
| DELETE | /api/projects/:id | Yes | Delete a project. |
| POST | /api/tasks | Yes | Create a new task. |
| GET | /api/tasks/project/:id | Yes | Get all tasks for a project. |
| PUT | /api/tasks/:id | Yes | Update a task (e.g., status). |
| DELETE | /api/tasks/:id | Yes | Delete a task. |

## 📄 License
This project is licensed under the MIT License.
