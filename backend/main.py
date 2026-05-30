import os
from fastapi import FastAPI
from pydantic import BaseModel
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import anthropic

load_dotenv()

#Setup
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("arxiv-navigator")
model = SentenceTransformer("all-MiniLM-L6-v2")
claude = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

app = FastAPI()

class Query(BaseModel):
    question: str

@app.post("/ask")
def ask(query: Query):
    question = query.question

    query_vector = model.encode(question).tolist()

    results = index.query(vector=query_vector,top_k=3,include_metadata=True)

    context = ""
    for match in results["matches"]:
        context = context + match["metadata"]["text"] + "\n\n"

    prompt = f"""Here is context from research papers:

{context}

Based ONLY on the context above, answer this question: {question}

If the context does not contain the answer, say so."""

    response = claude.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        temperature=0.3,
        messages=[{"role": "user", "content": prompt}]
    )
    answer = response.content[0].text

    return {"answer": answer}