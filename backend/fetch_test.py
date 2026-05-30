#This file is just to test if pinecone is fetching the files properly or not
import arxiv
search = arxiv.Search(
    query="cat:cs.AI",
    max_results=5,
    sort_by=arxiv.SortCriterion.SubmittedDate
)

for paper in arxiv.Client().results(search):
    print("TITLE:", paper.title)
    print("SUMMARY:", paper.summary[:200])