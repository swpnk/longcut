interface MentalModelProps {
  name: string
  definition: string
  note: string
}

export default function MentalModel({ name, definition, note }: MentalModelProps) {
  return (
    <>
      <style>{`
        .mental-model {
          max-width: 660px;
          margin: 0 auto 3rem;
          border: 0.5px solid var(--gold-dim);
          padding: 2.5rem;
        }

        .mental-model-tag {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(200, 169, 110, 0.4);
          margin-bottom: 1.25rem;
        }

        .mental-model-name {
          font-family: var(--font-headline);
          font-size: clamp(20px, 3vw, 30px);
          font-style: italic;
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .mental-model-definition {
          font-family: var(--font-body);
          font-size: 17px;
          color: rgba(240, 232, 216, 0.68);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .mental-model-note {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.08em;
          color: rgba(200, 169, 110, 0.3);
          line-height: 1.7;
        }

        @media (max-width: 640px) {
          .mental-model {
            margin: 0 1.5rem 3rem;
            padding: 1.75rem;
          }
        }
      `}</style>

      <div className="mental-model">
        <div className="mental-model-tag">The mental model — take this with you</div>
        <div className="mental-model-name">{name}</div>
        <div className="mental-model-definition">{definition}</div>
        <div className="mental-model-note">{note}</div>
      </div>
    </>
  )
}
