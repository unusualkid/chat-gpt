import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")

client = client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB]


# ✅ optional async ping for startup debugging
async def test_connection():
    try:
        await db.command("ping")
        print("✅ MongoDB async connection OK")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)


# Only run test when file executed directly (not on import)
if __name__ == "__main__":
    asyncio.run(test_connection())
