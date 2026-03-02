# Python Environment Setup for Space Mission System

The script `scripts/db_analytics.py` requires `python-dotenv` and `SQLAlchemy`. These are already installed in your system's global `Python 3.14` environment, but you need to ensure your IDE is using the correct interpreter.

## How to fix the "Could not find import" error in VS Code

1.  **Open the Command Palette**: Press `Ctrl+Shift+P` (Windows).
2.  **Select Interpreter**: Type `Python: Select Interpreter` and select it.
3.  **Choose the correct environment**: Select the interpreter that says `Python 3.14.2` (or the one that includes your global site-packages).
4.  **Wait for Pylance to refresh**: The red squiggles under `import dotenv` should disappear.

## Recommended: Use a Virtual Environment

To avoid environment issues in the future, it is highly recommended to use a virtual environment for this project.

### 1. Create a virtual environment
Run this in your terminal:
```powershell
python -m venv venv
```

### 2. Activate it
```powershell
.\venv\Scripts\Activate
```

### 3. Install dependencies
```powershell
pip install python-dotenv sqlalchemy psycopg2-binary
```

### 4. Select this environment in VS Code
After creating it, use the `Python: Select Interpreter` command again and select the one inside the `venv` folder.
