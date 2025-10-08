import os
import json
import uvicorn
from datetime import datetime
from db import db
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel


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


class TranslationItem(BaseModel):
    translation: str
    examples: list[str]


class TranslateResponse(BaseModel):
    de: TranslationItem
    en: TranslationItem
    es: TranslationItem
    fr: TranslationItem
    jp: TranslationItem
    tw: TranslationItem


@app.get("/")
def read_root():
    response = client.responses.create(model="gpt-5-nano", input="Give me a joke.")
    return {"response: ": response.output_text}


@app.post("/grammar", response_model=GrammarResponse)
def correct_grammar(request: GrammarRequest):
    response = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {
                "role": "system",
                "content": "You are a assistant that corrects grammar.  Always respond in the format 'correction:... reason:...'",
            },
            {"role": "user", "content": request.text},
        ],
    )

    response_parts = response.choices[0].message.content.split("reason:")
    correction = response_parts[0].replace("correction:", "").strip()
    explanation = response_parts[1].strip()
    return GrammarResponse(correction=correction, explanation=explanation)


@app.post("/translate", response_model=TranslateResponse)
async def translate_text(request: GrammarRequest):
    system_content = """
    You are a professional multilingual translator.
    Translate the following text into:
    - German (de)
    - English (en)
    - Spanish (es)
    - French (fr)
    - Japanese (jp)
    - Traditional Taiwanese Mandarin (tw)

    For each language, produce a JSON object with:
        "translation": "<translated text>",
        "examples": ["<example sentence 1>", "<example sentence 2>"]

    Return a **single JSON object** with keys "de", "en", "es", "fr", "jp", and "tw".
    Do not include explanations or text outside the JSON.
    """
    response = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {"role": "system", "content": system_content},
            {"role": "user", "content": request.text},
        ],
    )
    content = response.choices[0].message.content.strip()
    try:
        translations = json.loads(content)
    except json.JSONDecodeError:
        # Try to extract the JSON substring if the model added extra formatting
        start = content.find("{")
        end = content.rfind("}") + 1
        translations = json.loads(content[start:end])

    # ✅ Store in MongoDB
    record = {
        "input_text": request.text,
        "translations": translations,
        "timestamp": datetime.utcnow(),
    }
    await db.translations.insert_one(record)

    return translations


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=int(os.getenv("FASTAPI_PORT")))
