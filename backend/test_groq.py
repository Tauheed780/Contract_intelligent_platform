import os
from dotenv import load_dotenv
import groq

load_dotenv()

def test_groq():
    client = groq.Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    try:
        response = client.chat.completions.create(
            model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'Groq is working!' in exactly 3 words."}
            ],
            temperature=0.1,
            max_tokens=10
        )
        print("✅ Groq is working!")
        print(f"Response: {response.choices[0].message.content}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_groq()