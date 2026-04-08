interface ActBreakProps {
  number: string | number
  title: string
  id?: string
}

export default function ActBreak({ number, title, id }: ActBreakProps) {
  return (
    <>
      <style>{`
        .act-break {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem 4rem;
          border-top: 0.5px solid var(--faint);
          position: relative;
          text-align: center;
          overflow: hidden;
        }

        .act-break-anchor {
          position: absolute;
          top: -48px;
          visibility: hidden;
          pointer-events: none;
        }

        .act-ghost {
          position: absolute;
          font-family: var(--font-headline);
          font-weight: 700;
          font-size: clamp(80px, 14vw, 160px);
          color: rgba(240, 232, 216, 0.018);
          line-height: 1;
          user-select: none;
          pointer-events: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .act-label {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.75rem;
          position: relative;
          z-index: 1;
        }

        .act-rule {
          width: 40px;
          height: 0.5px;
          background: var(--gold-dim);
          margin: 0.6rem auto;
          position: relative;
          z-index: 1;
        }

        .act-title {
          font-family: var(--font-headline);
          font-size: clamp(20px, 3.2vw, 36px);
          font-style: italic;
          font-weight: 400;
          color: #f5f0e8;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 640px) {
          .act-ghost {
            display: none;
          }
        }
      `}</style>

      <div
        className="act-break"
        data-act-id={id}
      >
        {id && <span id={id} className="act-break-anchor" />}
        <div className="act-ghost">{number}</div>
        <div className="act-label">Act {number}</div>
        <div className="act-rule" />
        <div className="act-title">{title}</div>
      </div>
    </>
  )
}
