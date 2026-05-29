import os
from dotenv import load_dotenv

load_dotenv()

# Test Pinecone
from pinecone import Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
indexes = pc.list_indexes()
print("✅ Pinecone connected:", indexes)

# Test Anthropic
import anthropic
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
msg = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=10,
    messages=[{"role": "user", "content": "say hi"}]
)
print("✅ Anthropic connected:", msg.content[0].text)

# Test Redis
import redis
r = redis.from_url(os.getenv("REDIS_URL"))
r.set("test", "working")
print("✅ Redis connected:", r.get("test"))

# Test W&B
import wandb
wandb.login(key=os.getenv("WANDB_API_KEY"))
print("✅ W&B connected")