# 🔄 Project LOOP

## AI Customer Feedback Intelligence Platform

> **“Close the loop on customer feedback.”**

**Project LOOP** is a full-stack AI-powered customer feedback intelligence platform designed to help teams collect, organize, analyze, and understand customer feedback.

It combines **feedback management, sentiment analysis, recurring theme detection, analytics, and Ask LOOP AI** to transform customer feedback into actionable business insights.

---

## 🚀 Features

- 🔐 **User Authentication**
  - User Registration
  - User Login
  - JWT-based Authentication
  - Protected Routes

- 💬 **Customer Feedback Management**
  - Add Customer Feedback
  - Store Feedback in MongoDB
  - View Feedback
  - Feedback Library

- 📊 **Analytics Dashboard**
  - Total Feedback
  - Positive Feedback
  - Negative Feedback
  - Neutral Feedback
  - Sentiment Distribution
  - Recent Feedback
  - Customer Themes
  - LOOP Intelligence

- 😊 **AI Sentiment Analysis**
  - Positive Sentiment
  - Negative Sentiment
  - Neutral Sentiment

- 🧩 **Customer Theme Detection**
  - Detect recurring customer topics
  - Identify customer concerns
  - Discover satisfaction patterns
  - Highlight important feedback themes

- 🤖 **Ask LOOP AI**
  - Feedback-grounded AI Q&A
  - Customer feedback summaries
  - Main complaint identification
  - Customer satisfaction insights
  - Recurring theme analysis
  - AI-generated recommendations

- 🗃️ **MongoDB Data Persistence**

- 🛡️ **Admin Functionality**

- 📱 **Responsive User Interface**
  - Desktop
  - Laptop
  - Tablet
  - Mobile

---

## 🧠 What is Project LOOP?

**Project LOOP** is an AI Customer Feedback Intelligence Platform that helps transform raw customer feedback into meaningful business intelligence.

Instead of manually reading every feedback entry, LOOP helps users understand:

- What customers are saying
- Whether feedback is positive, negative, or neutral
- What customers are complaining about
- What customers are satisfied with
- Which themes appear repeatedly
- What actions could improve customer satisfaction

The platform combines traditional analytics with AI-powered feedback intelligence.

---

## 🔄 How Project LOOP Works

```text
Customer Feedback
        ↓
React + Vite Frontend
        ↓
Node.js / Express Backend
        ↓
MongoDB Database
        ↓
Sentiment & Theme Analysis
        ↓
Google Gemini AI
        ↓
Dashboard + Ask LOOP Insights
```

Customer feedback is submitted through the application and stored in MongoDB.

The platform analyzes the feedback to identify sentiment and recurring customer themes.

The dashboard presents this information visually, while **Ask LOOP AI** allows users to ask questions about customer feedback and receive useful AI-generated business insights.

---

# 🛠️ Tech Stack

## 💻 Frontend

- React
- Vite
- JavaScript
- CSS
- Responsive Web Design
- Recharts
- React Icons

## ⚙️ Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt
- Mongoose

## 🗃️ Database

- MongoDB

## 🤖 Artificial Intelligence

- Google Gemini API
- AI Sentiment Analysis
- Customer Theme Analysis
- Feedback-grounded AI Q&A
- AI-generated Business Insights

---

# 📂 Project Structure

```text
Project-LOOP/
│
├── BackEnd/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── FrontEnd/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the:

```text
BackEnd/
```

directory.

Example:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/project_loop

JWT_SECRET=your_secure_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ Never upload your real `.env`, Gemini API key, JWT secret, database credentials, or other private credentials to GitHub.

The `.env` file should remain excluded through `.gitignore`.

---

# 🚀 Run Project Locally

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB
- Git
- Visual Studio Code

MongoDB should be running before starting the backend.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/ainulhaqsde/Project-LOOP.git
```

Then:

```bash
cd Project-LOOP
```

---

## 2️⃣ Run the Backend

Open a terminal and run:

```bash
cd BackEnd
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

A successful startup should confirm that:

```text
Server is running
MongoDB connected successfully
```

---

## 3️⃣ Run the Frontend

Open another terminal.

Run:

```bash
cd FrontEnd
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Open this address in your browser.

> ⚠️ Do not use VS Code Live Server or port `5500` for this project. The React/Vite frontend should be started using `npm run dev`.

---

# 🔐 Authentication

Project LOOP provides authentication functionality including:

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Authenticated Application Access

Authentication is handled through the backend rather than exposing sensitive authentication logic in the frontend.

---

# 💬 Customer Feedback Management

Users can add and manage customer feedback.

Feedback can include information such as:

- Customer Name
- Customer Email
- Feedback Source
- Customer Feedback Message

Submitted feedback is stored in **MongoDB**.

The stored feedback is then used by:

- Feedback Library
- Dashboard
- Sentiment Analysis
- Customer Theme Analysis
- Analytics
- Ask LOOP AI

---

# 📊 Analytics Dashboard

Project LOOP provides a modern feedback intelligence dashboard.

The dashboard includes:

- Total Feedback
- Positive Feedback
- Negative Feedback
- Neutral Feedback
- Sentiment Distribution
- Sentiment Breakdown
- Customer Themes
- Recent Feedback
- LOOP Intelligence
- Quick Actions

This allows users to understand overall customer sentiment without manually analyzing every feedback entry.

---

# 😊 Sentiment Analysis

Project LOOP analyzes customer feedback and categorizes sentiment into:

```text
Positive
Negative
Neutral
```

Sentiment results are used throughout the analytics dashboard to provide a quick understanding of overall customer satisfaction.

---

# 🧩 Customer Themes

Project LOOP identifies recurring themes and patterns from customer feedback.

Themes can help identify areas such as:

```text
Customer Support
Website Performance
User Experience
Product Features
Login Experience
Search
Customer Satisfaction
```

Theme analysis helps teams understand which topics appear repeatedly across customer feedback.

---

# 🤖 Ask LOOP AI

**Ask LOOP** is the AI-powered intelligence feature of Project LOOP.

It allows users to ask questions about their customer feedback.

Example questions:

```text
Summarize all customer feedback.
```

```text
What are the main customer complaints?
```

```text
What are customers most satisfied with?
```

```text
What are the top recurring themes?
```

```text
Give me 3 recommendations to improve customer satisfaction.
```

Ask LOOP uses available customer feedback context to generate useful business intelligence.

It can help identify:

- Major customer concerns
- Customer satisfaction areas
- Recurring themes
- Product issues
- Service issues
- Improvement opportunities
- Recommended business actions

---

# 🧠 LOOP Intelligence

LOOP Intelligence helps transform customer feedback into understandable insights.

Instead of displaying only raw feedback, the platform helps users understand:

```text
What happened?
Why does it matter?
What are customers saying?
What should we improve?
```

This helps convert customer feedback into actionable information.

---

# 🔐 Security

Project LOOP follows important security practices.

- JWT-based authentication
- Protected application routes
- Password handling through the backend
- Sensitive credentials stored in environment variables
- `.env` excluded from Git
- Gemini API integration handled through the backend
- MongoDB connection details kept outside frontend code

Never place secrets directly inside frontend source files.

Sensitive information such as:

```text
GEMINI_API_KEY
JWT_SECRET
MONGO_URI
DATABASE_PASSWORD
```

must never be committed to a public GitHub repository.

---

# 📱 Responsive Design

Project LOOP provides a responsive user interface designed for:

- 🖥️ Desktop
- 💻 Laptop
- 📱 Tablet
- 📲 Mobile

Responsive design is implemented across:

- Landing Page
- Navigation
- Registration
- Login
- Dashboard
- Feedback Pages
- Analytics
- Customer Themes
- Ask LOOP AI

---

# 🧪 Tested Project Flow

The main Project LOOP workflow has been tested.

- [x] User Registration
- [x] User Login
- [x] User Logout
- [x] JWT Authentication
- [x] Protected Routes
- [x] Dashboard
- [x] Add Customer Feedback
- [x] MongoDB Feedback Persistence
- [x] Positive Sentiment
- [x] Negative Sentiment
- [x] Neutral Sentiment
- [x] Customer Theme Detection
- [x] Analytics Dashboard
- [x] Ask LOOP AI
- [x] Gemini AI Integration
- [x] AI Feedback Summary
- [x] AI Recommendations
- [x] Responsive Interface
- [x] Production Frontend Build

---

# 🏗️ Production Build

To create the frontend production build:

```bash
cd FrontEnd
```

Then:

```bash
npm run build
```

Vite creates the optimized production files inside:

```text
FrontEnd/dist/
```

---

# 🌐 Deployment

Project LOOP production deployment consists of three main parts:

```text
MongoDB Database
       ↓
Node.js / Express Backend
       ↓
React / Vite Frontend
```

Production environment variables must be configured securely through the selected hosting platform.

### Live Application

```text
Coming Soon
```

The live deployment URL will be added after deployment.

---

# 📌 GitHub Topics

Recommended GitHub repository topics:

```text
ai
customer-feedback
sentiment-analysis
full-stack
analytics-dashboard
react
vite
nodejs
express
mongodb
gemini-ai
jwt
```

---

# 🚀 Future Improvements

Potential future improvements include:

- CSV Feedback Import
- Advanced Feedback Search & Filters
- Advanced Role-Based Access
- Voice-of-Customer Report Generation
- Exportable Reports
- Advanced Trend Detection
- Real-Time Feedback Updates
- Advanced AI Insights
- Automated Testing
- CI/CD Integration
- Production Monitoring

---

# 📋 Project Details

**Project Name:** `Project LOOP`

**Full Name:** `Project LOOP — AI Customer Feedback Intelligence Platform`

**GitHub Repository:** `Project-LOOP`

**Deployment Slug:** `project-loop`

**Short Description:**

> AI-powered customer feedback intelligence platform that analyzes feedback, detects sentiment and themes, tracks customer insights, and generates actionable recommendations.

---

# 🎯 Project Goal

The goal of Project LOOP is to help teams move from **raw customer feedback to actionable intelligence**.

```text
Listen → Analyze → Understand → Improve
```

---

# ⭐ Support

If you find **Project LOOP** useful, consider giving the repository a ⭐.

Feedback, suggestions, and contributions are welcome.

---

### 🔄 Project LOOP

**AI Customer Feedback Intelligence Platform**

### “Close the loop on customer feedback.”

**Transforming customer feedback into actionable intelligence.**