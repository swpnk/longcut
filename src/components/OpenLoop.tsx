interface OpenLoopProps {
  word: string
  note: string
  preLabel?: string
}

export default function OpenLoop({ word, note, preLabel }: OpenLoopProps) {
  return (
    <>
      <style>{`
        .open-loop {
          max-width: 660px;
          margin: 0 auto;
          padding: 2.5rem;
          border-top: 0.5px solid var(--gold-dim);
          border-bottom: 0.5px solid var(--gold-dim);
        }

        .open-loop-prelabel {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.25);
          margin-bottom: 0.75rem;
        }

        .open-loop-word {
          display: block;
          font-family: var(--font-headline);
          font-weight: 700;
          font-style: italic;
          font-size: clamp(44px, 7vw, 80px);
          color: var(--gold);
          margin: 0.5rem 0;
          line-height: 1;
        }

        .open-loop-note {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.18);
          margin-top: 0.5rem;
        }

        .open-loop-note::before {
          content: '';
          display: block;
          width: 20px;
          height: 0.5px;
          background: var(--gold-dim);
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .open-loop {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="open-loop">
        {preLabel && <div className="open-loop-prelabel">{preLabel}</div>}
        <span className="open-loop-word">{word}</span>
        <div className="open-loop-note">{note}</div>
      </div>
    </>
  )
}
