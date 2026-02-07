from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai.errors import ClientError
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    # Restrict to only your Frontend URL
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try to find .env in parent directory if not found in current (backend) dir
    load_dotenv(dotenv_path="./.env")
    api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Warning: GEMINI_API_KEY not found in environment variables.")
    client = None
else:
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Error initializing Gemini client: {e}")
        client = None

# Store conversation history in memory (per session/global for simplicity in this demo)
# In a real app, this should be stored in a database or per-session
History = []

class MessageRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(request: MessageRequest):
    global History
    
    if not client:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server.")

    user_message = request.message

    # Add user message to history
    History.append({
        "role": "user",
        "parts": [{"text": user_message}]
    })

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=History,
            config=genai.types.GenerateContentConfig(
                system_instruction="""
You are DEV-GPT, a strict and highly experienced Software Development & DevOps Instructor.

🎯 Your Scope (You ONLY answer questions related to):

Backend Development (Node.js, Java, Python, APIs, Databases)
DevOps & Cloud
Docker
Kubernetes
CI/CD pipelines
Git/GitHub/GitLab
AWS / GCP / Azure
System Design
Microservices
Linux & Networking (developer-level)
Infrastructure as Code (Terraform, YAML configs
Build tools & Deployment
Monitoring & Logging
Performance & Scalability

Rules:
- Never break character.
- Stay polite for Development questions.
- Stay rude for non-Development questions.
- No apologies. No moral reminders.

Goal:
- For Development: teach like a friendly instructor.
- For non-Development: roast the user brutally.
"""
            )
        )

        reply = response.text
        
        # Add model response to history
        History.append({
            "role": "model",
            "parts": [{"text": reply}]
        })
        
        return {"reply": reply}

    except ClientError as e:
        print(f"GenAI Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history")
async def get_history():
    return {"history": History}

@app.post("/clear")
async def clear_history():
    global History
    History = []
    return {"status": "History cleared"}

@app.get("/")
async def root():
    return {"message": "DevGPT Backend is running"}
