from dotenv import load_dotenv
from openai import OpenAI
import re

load_dotenv()
client = OpenAI()

response = client.chat.completions.create(
    model="gpt-5-nano",
    messages=[
        {"role": "system", "content": "You are a helpful assistant that corrects grammar. Answer always in correction:... reason:..."},
        {"role": "user", "content": "He o to the store yesterday."}
    ]
)

pattern = r"[Cc]orrection:\s*(.*?)\s*[Rr]eason:\s*(.*)"
match = re.search(pattern, response.choices[0].message.content, re.DOTALL)

if match:
    correction = match.group(1).strip()
    reason = match.group(2).strip()

print("Correction:", correction)
print("Reason:", reason)