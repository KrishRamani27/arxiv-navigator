import os
import time
import json
import arxiv
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv


load_dotenv()

# Config
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = "arxiv-navigator"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
CHUNK_SIZE = 512
CHUNK_OVERLAP = 50
MAX_PAPERS = 100

# Init
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)
model = SentenceTransformer(EMBEDDING_MODEL)

print("✅ All clients initialized")

def chunk_text(text,chunk_size=512,overlap=50):
    words=text.split()

    if len(words) <= chunk_size:
        return [text]

    chunks = []
    start = 0
    while start < len(words):
        chunk = " ".join(words[start:start+chunk_size])
        chunks.append(chunk)
        start+=chunk_size-overlap
    return chunks

client = arxiv.Client(
    page_size=10,
    delay_seconds=3,
    num_retries=3
)

search = arxiv.Search(
    query="cat:cs.AI OR cat:cs.LG",
    max_results=5,
    sort_by=arxiv.SortCriterion.SubmittedDate
)

for paper in client.results(search):
    paper_id=paper.get_short_id()
    chunks=chunk_text(paper.summary)
    print("Number of chunks:", len(chunks))
    for i,chunk in enumerate(chunks):
        vector = model.encode(chunk)
        chunk_id=f"{paper_id}_{i}"
        print("CHUNK ID:", chunk_id)
        index.upsert(
            vectors=[{
                "id":chunk_id,
                "values":vector.tolist(),
                "metadata": {
                    "title":paper.title,
                    "text":chunk
                }
            }
        ])
        print("Uploaded:", chunk_id)