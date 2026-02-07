from google import genai
from google.genai.errors import ClientError
from dotenv import load_dotenv
load_dotenv()

# Initialize client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Conversation history
History = []


def DeveloperInstructor(user_message):
    # Add user message to history
    History.append({
        "role": "user",
        "parts": [{"text": user_message}]
    })

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
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

    except ClientError as e:
        print("\nError:", e)
        return

    # Add model response to history
    History.append({
        "role": "model",
        "parts": [{"text": reply}]
    })

    print("\nGemini:", reply)


# Main loop
while True:
    user_msg = input("You: ")
    DeveloperInstructor(user_msg)