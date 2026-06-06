import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
const API_URL = 'https://KrishRamani-arxiv-navigator.hf.space/ask'

function App() {
  const [sources, setSources] = useState([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = question.trim()
    if (!trimmed) return

    setLoading(true)
    setError('')
    setAnswer('')
    setSources([])

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
      })

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`)
      }

      const data = await res.json()
      setAnswer(data.answer ?? '')
      setSources(data.sources ?? [])
    } catch (err) {
      setError(
        err.message ||
          'Could not reach the server. Make sure the backend is running.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .arxiv-app {
          min-height: 100vh;
          background: #ffffff;
          color: #1a1a1a;
          font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
          font-size: 17px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .arxiv-inner {
          max-width: 700px;
          margin: 0 auto;
          padding: 72px 24px 96px;
        }

        .arxiv-header {
          margin-bottom: 48px;
        }

        .arxiv-title {
          font-family: Lora, Georgia, 'Times New Roman', serif;
          font-size: 2.25rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 0 0 12px;
          color: #1a1a1a;
        }

        .arxiv-subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 1rem;
          line-height: 1.5;
        }

        .arxiv-form {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
        }

        .arxiv-input {
          flex: 1;
          min-width: 0;
          padding: 12px 14px;
          font-family: inherit;
          font-size: 1rem;
          color: #1a1a1a;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .arxiv-input::placeholder {
          color: #9ca3af;
        }

        .arxiv-input:focus {
          border-color: #9ca3af;
        }

        .arxiv-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .arxiv-button {
          flex-shrink: 0;
          padding: 12px 20px;
          font-family: inherit;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #ffffff;
          background: #4a5568;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .arxiv-button:hover:not(:disabled) {
          background: #3d4654;
        }

        .arxiv-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .arxiv-loading {
          margin: 0 0 24px;
          color: #6b7280;
          font-size: 0.9375rem;
        }

        .arxiv-error {
          margin: 0 0 24px;
          padding: 14px 16px;
          color: #1a1a1a;
          background: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 0.9375rem;
        }

        .arxiv-answer-label {
          font-family: Lora, Georgia, 'Times New Roman', serif;
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #6b7280;
          margin: 0 0 16px;
        }

        .arxiv-answer {
          margin: 0;
          color: #1a1a1a;
        }
        .arxiv-answer ol {
          margin: 0;
          padding-left: 1.5rem;
        }

        .arxiv-answer li {
          margin-bottom: 20px;
          padding-left: 4px;
        }

        .arxiv-answer li > p,
        .arxiv-answer li > p:first-child {
          margin: 0;
          display: inline;
        }
          .arxiv-sources {
          margin-top: 40px;
        }

        .arxiv-source-link {
          display: block;
          color: #4a5568;
          text-decoration: none;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 0.9375rem;
        }

        .arxiv-source-link:hover {
          text-decoration: underline;
        }
        @media (max-width: 560px) {
          .arxiv-inner {
            padding: 48px 20px 72px;
          }

          .arxiv-title {
            font-size: 1.75rem;
          }

          .arxiv-form {
            flex-direction: column;
          }

          .arxiv-button {
            width: 100%;
          }
        }
      `}</style>

<div className="arxiv-app">
        <div className="arxiv-inner">
          <header className="arxiv-header">
            <h1 className="arxiv-title">ArXiv Navigator</h1>
            <p className="arxiv-subtitle">
              Semantic search over recent AI and ML research papers.
            </p>
          </header>

          <form className="arxiv-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="arxiv-input"
              placeholder="Ask a research question…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
              aria-label="Research question"
            />
            <button
              type="submit"
              className="arxiv-button"
              disabled={loading || !question.trim()}
            >
              Search
            </button>
          </form>

          {loading && (
            <p className="arxiv-loading" role="status">
              Searching papers…
            </p>
          )}

          {error && !loading && (
            <p className="arxiv-error" role="alert">
              {error}
            </p>
          )}

          {answer && !loading && (
            <section aria-live="polite">
              <p className="arxiv-answer-label">Answer</p>
              <div className="arxiv-answer"><ReactMarkdown>{answer}</ReactMarkdown></div>
            </section>
          )}

          {sources.length > 0 && !loading && (
            <section className="arxiv-sources">
              <p className="arxiv-answer-label">Sources</p>
              {sources.map((source, i) => (
                <a  
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="arxiv-source-link"
                >
                  {source.title}
                </a>
              ))}
            </section>
          )}
        </div>
      </div>
    </>
  )
}

export default App