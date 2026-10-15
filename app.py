import os
import sys

# Ensure root directory and streamlit_app are on sys.path
root_dir = os.path.dirname(os.path.abspath(__file__))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

app_dir = os.path.join(root_dir, "streamlit_app")
if app_dir not in sys.path:
    sys.path.insert(0, app_dir)

# Forward execution directly to streamlit_app/app.py
app_file = os.path.join(app_dir, "app.py")
with open(app_file, "r", encoding="utf-8") as f:
    code = compile(f.read(), app_file, 'exec')
    exec(code, globals())
