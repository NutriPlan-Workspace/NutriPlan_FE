# NutriPlan Frontend

<div align="center">

<a href="https://nutriplan.minhtran.tech/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Live%20Demo-Click%20to%20Try-4ADE80?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo Badge" />
</a>

<br/>

<a href="https://nutriplan.minhtran.tech/" target="_blank" rel="noopener noreferrer">
    <img src="https://res.cloudinary.com/dtwrwvffl/image/upload/v1746503177/gordxatzr6puhs6upcfl.png" alt="NutriPlan Live Demo Screenshot" width="60%" style="border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08);" />
</a>

<p>
    <strong>✨ Experience NutriPlan instantly — no signup required!</strong><br/>
    <em>Explore the full feature set and see how intelligent nutrition planning works in real time.</em>
</p>

<br/>

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=20232A)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant_Design-5.24.2-0170FE?style=for-the-badge&logo=antdesign&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux-2.5.1-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-5.67.1-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
</div>

## 📑 Table of Contents

- [NutriPlan Frontend](#nutriplan-frontend)
  - [📑 Table of Contents](#-table-of-contents)
  - [🥗 Introduction](#-introduction)
  - [🏗 System Architecture \& Dependencies](#-system-architecture--dependencies)
  - [💻 Tech Stack Overview](#-tech-stack-overview)
    - [🎨 UI \& UX Layer](#-ui--ux-layer)
    - [🧠 State Management Strategy](#-state-management-strategy)
    - [🛠 Core Tooling](#-core-tooling)
  - [✨ Key Features](#-key-features)
    - [Interactive Meal Planner](#interactive-meal-planner)
    - [Food Browser \& Search](#food-browser--search)
    - [NutriBot AI Assistant](#nutribot-ai-assistant)
  - [🛡️ Admin Functionalities](#️-admin-functionalities)
    - [👥 User Management (`/admin/users`)](#-user-management-adminusers)
    - [🥣 Food \& Recipe Database (`/admin/foods`)](#-food--recipe-database-adminfoods)
    - [📰 Articles \& CMS (`/admin/articles`)](#-articles--cms-adminarticles)
    - [⚙️ System Settings (`/admin/settings`)](#️-system-settings-adminsettings)
  - [🛠 Prerequisites](#-prerequisites)
    - [1. Node.js Environment](#1-nodejs-environment)
    - [2. Package Manager](#2-package-manager)
    - [3. VS Code Recommendations](#3-vs-code-recommendations)
  - [🚀 Getting Started](#-getting-started)
    - [Step 1: Clone the Repo](#step-1-clone-the-repo)
    - [Step 2: Install Dependencies](#step-2-install-dependencies)
    - [Step 3: Set Up Environment Variables](#step-3-set-up-environment-variables)
    - [Step 4: Launch Development Server](#step-4-launch-development-server)
  - [🌍 Environment Configuration](#-environment-configuration)
  - [📂 Project Structure](#-project-structure)
  - [🤖 Scripts \& Tools](#-scripts--tools)
  - [🤝 Contributing](#-contributing)

---

## 🥗 Introduction

**NutriPlan** represents the future of personal nutrition management. In a world where diet tracking is often tedious and disconnected, NutriPlan offers a cohesive, intelligent, and seamless experience.

Built on the cutting-edge **React 19** framework and **Vite 6** build tool, the application delivers instant load times and fluid interactions. Whether you are a fitness enthusiast tracking macros, a busy professional planning weekly meals, or someone with specific dietary restrictions, NutriPlan adapts to your needs.

At its core, NutriPlan integrates a **RAG-based AI Agent (NutriBot)** that acts as your personal nutritionist—answering questions, suggesting swaps, and explaining complex nutritional data in simple terms.

👉 **Live Demo**: [https://nutriplan.minhtran.tech/](https://nutriplan.minhtran.tech/)

<div align="center">
  <img src="https://via.placeholder.com/1000x500?text=Application+Dashboard+Screenshot" alt="NutriPlan Dashboard" width="100%" />
  <p><em>Figure 1: The NutriPlan Main Dashboard providing a daily nutritional overview.</em></p>
</div>

---

## 🏗 System Architecture & Dependencies

This Frontend application acts as the presentation layer in a sophisticated microservices-inspired architecture. It interacts with several key backend components to function correctly.

To run the full stack locally, ensuring the following services are active is crucial:

1.  **Backend API (The Core)**:
    *   **Role**: Orchestrates all business logic, user authentication (JWT), and database interactions.
    *   **Tech**: Python (FastAPI) or Node.js.
    *   **Communication**: REST API.
2.  **Vector Database & LLM Engine (The Brain)**:
    *   **Role**: Processes natural language queries for NutriBot using Vector Search (MongoDB Atlas Vector Search) and generates responses via an LLM server (vLLM with Qwen/Llama).
    *   **Function**: Enables "Talk to your Nutritionist" features.
3.  **Primary Database (Storage)**:
    *   **Role**: Persistence layer for Users, Recipes, Meal Plans.
    *   **Tech**: **MongoDB** (NoSQL goodness for flexible schema).
4.  **Cloud Storage (Assets)**:
    *   **Role**: Holds user-generated content like profile pictures and custom recipe images.
    *   **Tech**: **Cloudinary**.

> ⚠️ **Critical Check**: Verify that your `VITE_API_BASE_URL` in `.env` points to the correctly running Backend Service API gateway.

---

## 💻 Tech Stack Overview

We have carefully selected a "Best-in-Class" technology stack to ensure scalability, maintainability, and developer joy.

### 🎨 UI & UX Layer
*   **React 19**: Utilizing the newest concurrent rendering features for a non-blocking UI.
*   **Ant Design 5 (5.24.2)**: A massive suite of enterprise-grade components (Tables, DatePickers, Modals) customized to match our brand.
*   **TailwindCSS 4 (4.0.0)**: Use for layout, spacing, and bespoke component styling. It allows us to build a unique look without fighting library defaults.
*   **Framer Motion**: Adds polish with buttery smooth layout transitions and micro-interactions.
*   **React-Toastify**: For non-intrusive user notifications.

### 🧠 State Management Strategy
We employ a hybrid state management approach:
*   **Server State**: Managed by **TanStack Query (v5)**. It handles caching, deduplication, invalidation, and background fetching. We almost rarely manually `useEffect` for data fetching.
*   **Client State**: Managed by **Redux Toolkit (v2.5)**. Used for truly global sync synchronous state like "Dark Mode toggle", "User Authentication Session", and "Sidebar State".

### 🛠 Core Tooling
*   **Vite 6 (6.1.0)**: The fastest build tool available. Instant HMR means changes appear in milliseconds.
*   **TypeScript (5.7.3)**: Strict mode is enabled. We don't do `any`.
*   **TanStack Router**: Delivers 100% type-safe routing. If you typo a URL or forget a parameter, the build fails.

<div align="center">
  <img src="https://via.placeholder.com/800x200?text=Tech+Stack+Architecture+Diagram" alt="Tech Stack Diagram" width="100%" />
</div>

---

## ✨ Key Features

### Interactive Meal Planner
The heart of the application. Users can plan their week using a familiar drag-and-drop interface.
*   **Drag & Drop**: Powered by `@atlaskit/pragmatic-drag-and-drop` for high-performance reordering.
*   **Nutrition Totals**: Real-time calculation of daily calories, proteins, carbs, and fats as you add or remove items.
*   **Copy/Paste Days**: Quickly replicate a meal structure from Monday to Tuesday.

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Meal+Planner+Interface" alt="Meal Planner Interface" width="100%" />
</div>

### Food Browser & Search
A Google-like search experience for food.
*   **Filtering**: Drill down results by cuisine, allergy tags (Gluten-Free, Dairy-Free), and diet types (Keto, Vegan).
*   **Recent History**: Remembers what you last searched for.
*   **Favorites**: Pin your go-to foods for quick access.

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Food+Search+Page" alt="Food Search Page" width="100%" />
</div>

### NutriBot AI Assistant
An always-available chatbot that understands your context.
*   **Context Aware**: "How much protein is in my lunch?" - NutriBot knows what's on your plan.
*   **RAG Powered**: Fetches relevant nutritional science to answer "Is Keto safe for me?".
*   **Actionable**: Can execute commands like "Swap my lunch for a chicken salad" directly in the chat.

<div align="center">
  <img src="https://via.placeholder.com/400x600?text=NutriBot+Chat+Interface" alt="NutriBot Chat" width="45%" style="display:inline-block; margin-right: 10px;" />
  <img src="https://via.placeholder.com/400x600?text=NutriBot+Reasoning+Steps" alt="NutriBot Reasoning" width="45%" style="display:inline-block;" />
</div>

---

## 🛡️ Admin Functionalities

Beyond the user-facing application, NutriPlan includes a robust **Admin Dashboard** (`/admin`) for platform management. This secure area allows administrators to oversee the health and content of the system.

### 👥 User Management (`/admin/users`)
*   **View All Users**: Paginated list of all registered users.
*   **Status Control**: Ban/Suspend malicious users or reset passwords.
*   **Role Assignment**: Promote users to Moderators or Admins.

### 🥣 Food & Recipe Database (`/admin/foods`)
*   **Content Moderation**: Review and approve public custom recipes created by users.
*   **Database Entry**: Add new "Official" system foods with verified nutritional data.
*   **Category Management**: Edit food categories (e.g., "Dairy", "Vegetables").

### 📰 Articles & CMS (`/admin/articles`)
*   **Blog Management**: Write and publish nutrition articles for the "Discover" feed.
*   **Rich Text Editor**: Integrated editor for formatting content.

### ⚙️ System Settings (`/admin/settings`)
*   **Global Configurations**: Toggle system-wide announcements or maintenance mode.

<div align="center">
  <img src="https://via.placeholder.com/1000x500?text=Admin+Dashboard+Overview" alt="Admin Dashboard" width="100%" />
</div>

---

## 🛠 Prerequisites

To contribute or run this project, your environment must be set up correctly.

### 1. Node.js Environment
We enforce a specific Node.js version to avoid "It works on my machine" issues.
*   **Required**: `v22.7.0`
*   **Recommended**: Use `nvm` (Node Version Manager).
    ```bash
    nvm install 22.7.0
    nvm use 22.7.0
    ```

### 2. Package Manager
*   **npm**: Comes with Node.js. Yarn or pnpm are also supported but `package-lock.json` is the source of truth.

### 3. VS Code Recommendations
Install these extensions for the best DX:
*   `dbaeumer.vscode-eslint`: Linting.
*   `esbenp.prettier-vscode`: Formatting.
*   `bradlc.vscode-tailwindcss`: Tailwind Autocomplete.
*   `tammie.terrico-vscode`: Styles components for better visual hierarchy.

---

## 🚀 Getting Started

Follow this "Zero-to-Hero" guide to get running in under 5 minutes.

### Step 1: Clone the Repo
```bash
git clone https://github.com/your-username/nutri-plan-fe.git
cd nutri-plan-fe
```

### Step 2: Install Dependencies
This will fetch all libraries listed in `package.json`.
```bash
npm install
# or
npm ci # Clean install for consistency
```

### Step 3: Set Up Environment Variables
We use `dotenv` for configuration.
```bash
cp .env.example .env
```
*Now, open `.env` and fill in your API keys (See Section Below).*

### Step 4: Launch Development Server
```bash
npm run dev
```
The terminal will show:
```
  VITE v6.1.0  ready in 345 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🌍 Environment Configuration

| Variable Key | Required | Format/Example | Description |
| :--- | :---: | :--- | :--- |
| **Backend Connection** |
| `VITE_API_BASE_URL` | ✅ | `http://localhost:8000/api/v1` | The entry point for the Python/Node backend. |
| **Cloudinary (Images)** |
| `VITE_CLOUDINARY_CLOUD_NAME` | ✅ | `nutriplan_assets` | Your cloud name. |
| `VITE_CLOUDINARY_UPLOAD_PRESET`| ✅ | `ml_default` | Unsigned upload preset for avatars. |
| `VITE_CLOUDINARY_UPLOAD_FOLDER`| ❌ | `user_uploads` | Optional folder organization. |
| **NutriBot Avatars** |
| `VITE_NUTRIBOT_HELLO_URL` | ❌ | `https://.../hello.webm` | Video for "Greeting" state. |
| `VITE_NUTRIBOT_THINKING_URL` | ❌ | `https://.../think.webm` | Video for "Processing" state. |

---

## 📂 Project Structure

Experience our **"Feature-Driven"** folder structure. We scale by feature, not by technical type.

```text
src/
├── components/          # 🧩 Atomic UI Building Blocks
│   ├── ui/              # Generic Buttons, Inputs, Cards
│   └── shared/          # App-specific shared components (e.g. UserAvatar)
├── routes/              # 🚦 The Nervous System (TanStack Router)
│   ├── __root.tsx       # The Layout Wrapper (Navbar, Footer context)
│   ├── index.tsx        # Landing Page
│   ├── admin/           # 🔒 Protected Admin Module
│   │   ├── users/       # User Management Page
│   │   └── foods/       # Food Database Management
│   ├── meal-plan/       # 📅 The Planner Module (Complex Logic)
│   └── discover/        # 📰 Articles and Feeds
├── contexts/            # 🌐 Global Logic (Theme, AuthUser)
├── hooks/               # 🎣 Custom Hooks (useDebounce, useClickOutside)
├── services/            # 📡 API Layer (Axios instances, Endpoint definitions)
├── store/               # 📦 Redux Store Slices
└── utils/               # 🔧 Helpers (Date formatters, Math helpers)
```

---

## 🤖 Scripts & Tools

Inside `package.json`, you will find these commands:

*   **`npm run dev`**: Starts Vite dev server.
*   **`npm run build`**: Compiles TypeScript and bundles assets for production.
*   **`npm run preview`**: Simulates the production build locally.
*   **`npm run lint`**: Runs ESLint to catch bugs.
*   **`npm run format`**: Prettifies code.
*   **`npm run prepare`**: Sets up Husky for git hooks.

---

## 🤝 Contributing

We love the community! Steps to help us improve:

1.  **Fork** the project.
2.  **Clone** your fork.
3.  Create a **Feature Branch** (`git checkout -b feature/AmazingUpgrade`).
4.  **Commit** your changes regarding [Conventional Commits](https://www.conventionalcommits.org/).
5.  **Push** to your fork.
6.  Open a **Pull Request**.

---

<div align="center">
  <p>
    Built with ❤️, ☕, and a lot of 🥗 by the <strong>NutriPlan Engineering Team</strong>.
  </p>
  <p>
    © 2026 NutriPlan. All rights reserved.
  </p>
</div>
