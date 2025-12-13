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

The backend will run on `http://localhost:8000`

You can verify it's working by visiting `http://localhost:8000` in your browser (should show `{"Ping":"Pong"}`)

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

The frontend will automatically open in your browser at `http://localhost:3000`

## Step 3: Using the Application

1. **Create Nodes**: Drag nodes from the toolbar at the top onto the canvas
2. **Connect Nodes**: Click and drag from a node's output handle (right side, green) to another node's input handle (left side, blue)
3. **Text Node Variables**: In a Text node, use `[[variableName]]` syntax to create dynamic input handles
4. **Submit Pipeline**: Click the "Submit Pipeline" button at the bottom to analyze your pipeline

## Troubleshooting

### Backend Issues

- **Port 8000 already in use**: Change the port in the uvicorn command:
  ```bash
  uvicorn main:app --reload --port 8001
  ```
  Then update the frontend `submit.js` to use `http://localhost:8001`

- **Module not found errors**: Make sure you've activated the virtual environment and installed requirements

### Frontend Issues

- **Port 3000 already in use**: React will automatically try the next available port (3001, 3002, etc.)

- **CORS errors**: Make sure the backend is running and the CORS middleware is properly configured

- **Cannot connect to backend**: 
  - Verify backend is running on `http://localhost:8000`
  - Check browser console for errors
  - Ensure no firewall is blocking the connection

### Missing Dependencies

If you see import errors:
- **Frontend**: Run `npm install` again in the frontend directory
- **Backend**: Run `pip install -r requirements.txt` again in the backend directory

## Quick Start (All Commands)

**Terminal 1 (Backend):**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm start
```

## Testing the Features

1. **Node Abstraction**: Try dragging different node types (Input, Output, LLM, Text, Conditional, Transform, Filter, Merge, Split)

2. **Styling**: Notice the modern design with hover effects and consistent styling

3. **Text Node Logic**: 
   - Add a Text node
   - Type text with variables like: `Hello [[name]], your score is [[score]]`
   - Watch handles appear on the left side for each variable
   - The node size adjusts as you type

4. **Backend Integration**:
   - Create a pipeline with multiple nodes and connections
   - Click "Submit Pipeline"
   - See an alert with the number of nodes, edges, and whether it's a DAG

