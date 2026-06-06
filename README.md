# ArXiv Navigator

Semantic search over recent AI/ML research papers. Ask a question in plain English and get a grounded, cited answer drawn from real arXiv papers.

**Live demo:** https://arxiv-navigator.vercel.app

## What it does
Instead of keyword-matching like the arXiv site, ArXiv Navigator finds papers by *meaning* using vector embeddings, then uses an LLM to generate an answer grounded strictly in the retrieved papers — with clickable source links.

## Architecture
User question → embedded (sentence-transformers) → semantic search over Pinecone vector DB → top matching papers retrieved → passed to Claude with a grounding prompt → cited answer returned

- **Frontend:** React (Vite), deployed on Vercel
- **Backend:** FastAPI, containerized with Docker, deployed on Hugging Face Spaces
- **Embeddings:** sentence-transformers (`all-MiniLM-L6-v2`, 384-dim), running on PyTorch
- **Vector DB:** Pinecone (cosine similarity)
- **LLM:** Claude (Anthropic API)
- **Corpus:** 200+ papers from arXiv cs.AI and cs.LG

## How it works
The ingestion pipeline fetches paper abstracts from the arXiv API, chunks and embeds them, and stores the vectors in Pinecone with metadata. At query time, the question is embedded the same way, the closest papers are retrieved by cosine similarity, and their text is passed to Claude with an instruction to answer only from that context — keeping answers grounded and citable.

## Tech stack
`RAG` · `LLM` · `Claude API` · `sentence-transformers` · `PyTorch` · `Pinecone` · `FastAPI` · `React` · `Docker` · `Hugging Face Spaces` · `Vercel`

## Running locally
1. Backend: `cd backend`, create a venv, `pip install -r requirements.txt`, add a `.env` with `PINECONE_API_KEY` and `ANTHROPIC_API_KEY`, then `uvicorn main:app --reload`
2. Frontend: `cd frontend`, `npm install`, `npm run dev`
3. Run `python ingest.py` once to populate the Pinecone index
