interface Source {
  label: string
  publication?: string
  year?: string
  url?: string
  note?: string
}

interface SourcesPanelProps {
  sources: Source[]
}

export default function SourcesPanel({ sources }: SourcesPanelProps) {
  return (
    <>
      <style>{`
        .sources-panel {
          max-width: 660px;
          margin: 0 auto;
          padding: 2.5rem 2.5rem 4rem;
          border-top: 0.5px solid var(--faint);
        }

        .sources-heading {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(200,169,110,0.35);
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sources-heading::after {
          content: '';
          flex: 1;
          height: 0.5px;
          background: var(--faint);
        }

        .sources-fairuse {
          font-family: var(--font-body);
          font-size: 12px;
          font-style: italic;
          color: rgba(240,232,216,0.3);
          line-height: 1.65;
          padding-bottom: 1.25rem;
          margin-bottom: 1.25rem;
          border-bottom: 0.5px solid var(--faint);
        }

        .sources-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .sources-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sources-item-meta {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240,232,216,0.18);
        }

        .sources-item-label {
          font-family: var(--font-body);
          font-size: 13px;
          font-style: italic;
          color: rgba(240,232,216,0.45);
          line-height: 1.5;
        }

        .sources-item-label a {
          color: var(--gold);
          text-decoration: none;
        }

        .sources-item-label a:hover {
          text-decoration: underline;
        }

        .sources-item-note {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.08em;
          color: rgba(240,232,216,0.2);
          font-style: italic;
          text-transform: none;
        }

        @media (max-width: 640px) {
          .sources-panel {
            padding: 2rem 1.5rem 3rem;
          }
        }
      `}</style>

      <div className="sources-panel">
        <div className="sources-heading">Sources &amp; Notes</div>

        <div className="sources-fairuse">
          All quoted material is used for editorial commentary and criticism under fair use. longcut is an independent publication.
        </div>

        <div className="sources-list">
          {sources.map((s, i) => (
            <div key={i} className="sources-item">
              {(s.publication || s.year) && (
                <div className="sources-item-meta">
                  {[s.publication, s.year].filter(Boolean).join(' · ')}
                </div>
              )}
              <div className="sources-item-label">
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                ) : (
                  s.label
                )}
              </div>
              {s.note && <div className="sources-item-note">{s.note}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
