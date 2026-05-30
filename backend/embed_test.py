from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")
vector = model.encode("Transformers are efficient for natural language processing")
print("Length of vector:", len(vector))
print("First 5 numbers:", vector[:5])

vector2 = model.encode("Transformers are efficient for natural language processing")
print("Length of vector:", len(vector2))
print("First 5 numbers:", vector2[:5])

