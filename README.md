# 🤖 AI Grammar Helper & Joke Generator

A full-stack web app that uses the **OpenAI ChatGPT SDK** with **FastAPI** and **React** to:

1. ✏️ Correct your grammar and explain the changes
2. 😂 Tell you a random AI-generated joke

Built with ❤️ using **FastAPI**, **OpenAI SDK**, and **React**.

---

## 🚀 Features

- **Grammar Correction** — The backend calls OpenAI’s chat completion endpoint to correct grammar and explain each fix.
- **AI Joke Generator** — Click a button to get a short, funny joke from the model.
- **Responsive Frontend** — Modern React UI with live feedback and loading indicators.
- **Environment-based Configuration** — Uses `.env` for your API key and FastAPI port.
- **CORS-enabled Backend** — Allows smooth frontend–backend communication during development.

---

## 🧩 Tech Stack

| Layer          | Technology        |
| -------------- | ----------------- |
| Frontend       | React + Fetch API |
| Backend        | FastAPI           |
| AI Integration | OpenAI Python SDK |
| Styling        | Plain CSS         |

---

## 📁 Project Structure

project/
├── .env
├── README.md
├── backend/
│ ├── main.py
│ ├── requirements.txt
│ └── ...
└── frontend/
├── src/
│ ├── App.js
│ ├── App.css
│ └── ...
├── package.json
└── ..

## ⚙️ Backend Setup (FastAPI)

### 1. Create and activate a virtual environment

````bash
cd backend
python3 -m venv venv
source venv/bin/activate    # (Mac/Linux)
venv\Scripts\activate       # (Windows)

### 2. Install dependencies
bash
Copy code
pip install -r requirements.txt

### 3. Run the backend
```bash
make start
```

💻 Frontend Setup (React + Webpack)
### 1. Navigate to the frontend directory
```bash
cd ../frontend
````

### 2. Install dependencies

```bash
npm install
```

### 3. Run the frontend

```bash
npm start
```

### 4. Open your browser

Visit `http://localhost:3000` to access the app.
