import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the OpenAI API key from the environment variable
api_key = os.getenv('OPENAI_API_KEY')

# Initialize the OpenAI client with the API key
client = OpenAI(api_key=api_key)

# Example chat completion request using GPT-3.5-turbo
chat_completion = client.chat.completions.create(
    messages=[{"role": "user", "content": "Say this is a test"}],
    model="gpt-3.5-turbo",  # Correct model identifier
)

print(chat_completion['choices'][0]['message']['content'])
