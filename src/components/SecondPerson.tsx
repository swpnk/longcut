import { ReactNode } from 'react'

interface SecondPersonProps {
  tag: string
  children: ReactNode
}

export default function SecondPerson({ tag, children }: SecondPersonProps) {
  return (
    <>
      <style>{`
        .second-person {
          width: 100%;
          background: rgba(200, 169, 110, 0.025);
          border-top: 0.5px solid var(--gold-dim);
          border-bottom: 0.5px solid var(--gold-dim);
          padding: 4rem 2.5rem;
          margin: 3rem 0;
        }

        .second-person-inner {
          max-width: 660px;
          margin: 0 auto;
        }

        .second-person-tag {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(200, 169, 110, 0.35);
          margin-bottom: 2rem;
        }

        .second-person-tag::after {
          content: '';
          flex: 1;
          height: 0.5px;
          background: var(--gold-dim);
        }

        .second-person-content {
          font-family: var(--font-headline);
          font-size: clamp(16px, 2vw, 20px);
          font-style: italic;
          font-weight: 400;
          line-height: 1.7;
          color: rgba(240, 232, 216, 0.88);
        }

        .second-person-content p {
          margin-bottom: 1.1em;
        }

        .second-person-content p:last-child {
          margin-bottom: 0;
        }

        .second-person-content em {
          color: var(--gold);
          font-style: italic;
        }

        @media (max-width: 640px) {
          .second-person {
            padding: 3rem 1.5rem;
          }
        }
      `}</style>

      <div className="second-person">
        <div className="second-person-inner">
          <div className="second-person-tag">{tag}</div>
          <div className="second-person-content">{children}</div>
        </div>
      </div>
    </>
  )
}
