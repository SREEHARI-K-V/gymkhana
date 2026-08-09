 To run the frontend of the Gymkhana project, follow these step-by-step instructions:
  ──────
  ### Step 1: Open a Terminal & Navigate to the Frontend Directory

  Open your command prompt, PowerShell, or terminal and navigate into the frontend folder:

    cd D:\mini\Gymkhana\frontend
    ──────
  ### Step 2: Install Dependencies (If not already installed)

  Run the following command to install the required Node.js dependencies listed in package.json:

    npm install
    ──────
  ### Step 3: Start the Vite Development Server

  Run the development script:

    npm run dev
    
  Once started, Vite will display a local server URL in the terminal (by default):
  👉 http://localhost:5173

  Open that link in your web browser to view the application.
  ──────
  ### 💡 Note: Running the Backend (Required for API / Login)

  For authentication and data features to work, ensure the backend API server is also running in a separate terminal:

    # In project root D:\mini\Gymkhana
    venv\Scripts\activate
    python backend/run.py
    
  (Backend runs at http://127.0.0.1:5000)
  ──────
  ### 🔑 Demo Accounts (Quick Login)

  You can use the one-click demo login buttons on the login screen or enter these credentials:

Resume with -c (or command below):
agy --conversation=e1a0e1f5-f514-4139-b31d-84d42ce319db


  • Admin: admin@gymkhana.com / admin123
  • Trainer: alex.trainer@gymkhana.com / trainer123
  • Member: john@gmail.com / member123

  For full project documentation and schema setup, refer to README.md.