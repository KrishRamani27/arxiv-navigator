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