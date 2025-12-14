# How to Run the VectorShift Assessment Application

This guide will help you set up and run both the frontend and backend components.

## Prerequisites

- **Node.js** (v14 or higher) and **npm**
- **Python** (v3.8 or higher) and **pip**

## Step 1: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
```

3. Activate the virtual environment:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Start the backend server:
```bash
uvicorn main:app --reload
```

## Step 2: Frontend Setup

1. Open a **new terminal window** (keep the backend running)

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Start the frontend development server:
```bash
npm start
```


