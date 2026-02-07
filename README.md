# DEV-GPT: AI Developer Instructor 🚀

![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-green)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-orange)

An interactive AI chat application designed to teach software development and DevOps concepts. The AI adopts a "Strict Instructor" persona—polite for relevant questions, but roast-heavy for off-topic inquiries.

## ✨ Features

-   **Cyberpunk/Developer UI**: A modern, dark-themed interface built with **React** and **Tailwind CSS**.
-   **Real-time Animations**: Smooth message transitions powered by **Framer Motion**.
-   **FastAPI Backend**: A robust Python backend serving the Google Gemini AI.
-   **Context-Aware**: Maintains conversation history for coherent discussions.
-   **Strict Persona**: Dedicated system instructions ensure the AI stays in character.

## 🛠️ Tech Stack

### Frontend (`/frontend`)
-   **React 19**
-   **Vite** (Build Tool)
-   **Tailwind CSS v4** (Styling)
-   **Framer Motion** (Animations)
-   **Axios** (API Requests)
-   **Lucide React** (Icons)

### Backend (`/backend`)
-   **FastAPI** (Web Framework)
-   **Uvicorn** (ASGI Server)
-   **Google GenAI SDK** (AI Model Integration)
-   **Pydantic** (Data Validation)

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   Python (v3.9+)
-   A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/dev-gpt.git
    cd dev-gpt
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```
    *Create a `.env` file in the `backend` or root folder:*
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```

### Running the App

You need to run **two** terminals.

**Terminal 1: Backend**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2: Frontend**
```bash
cd frontend
# If on PowerShell:
cmd /c "npm run dev"
# If on Bash/CMD:
npm run dev
```

Open your browser to: **http://localhost:5173**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
