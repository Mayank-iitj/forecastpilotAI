import os
from huggingface_hub import HfApi
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    print("Error: HF_TOKEN environment variable is not set.")
    exit(1)

api = HfApi()

repo_id = "mayyanks/forecast-api"
repo_type = "space"

print(f"Deploying backend to Hugging Face Space: {repo_id}")

try:
    api.upload_folder(
        folder_path=".",
        repo_id=repo_id,
        repo_type=repo_type,
        token=HF_TOKEN,
        ignore_patterns=[
            "venv/*",
            "__pycache__/*",
            ".git/*",
            "deploy_to_hf.py",
            ".env"
        ]
    )
    print("Successfully deployed to Hugging Face Spaces!")
except Exception as e:
    print(f"Deployment failed: {e}")
