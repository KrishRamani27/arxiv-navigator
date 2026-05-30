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

sample = "Are AI agents tools, co-authors, or researchers? We present a quantified case study (N = 1): a physicist supervising an AI coding agent over 12 work days and 57 sessions to build CLAX-PT, a differentiable one-loop perturbation theory module in JAX."

print(chunk_text(sample))
print("Number of chunks:", len(chunk_text(sample)))