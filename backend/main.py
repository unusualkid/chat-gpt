from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os

load_dotenv()

client = OpenAI()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GrammarRequest(BaseModel):
    text: str

class GrammarResponse(BaseModel):
    correction: str
    explanation: str


@app.get("/")
def read_root():
    response = client.responses.create(
        model="gpt-5-nano",
        input="Give me a joke."
    )
    return {"response: ": response.output_text}

@app.post("/grammar", response_model=GrammarResponse)
def correct_grammar(request: GrammarRequest):
    response = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {"role": "system", "content": "You are a assistant that corrects grammar.  Always respond in the format 'correction:... reason:...'"},
            {"role": "user", "content": request.text}
        ]
    )

    response_parts = response.choices[0].message.content.split("reason:")
    correction = response_parts[0].replace("correction:", "").strip()
    explanation = response_parts[1].strip()
    return GrammarResponse(correction=correction, explanation=explanation)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=int(os.getenv('FASTAPI_PORT')))