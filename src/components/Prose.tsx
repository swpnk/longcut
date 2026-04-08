import { ReactNode } from 'react'

interface ProseProps {
  children: ReactNode
  dropcap?: boolean
  wide?: boolean
}

export default function Prose({ children, dropcap, wide }: ProseProps) {
  return (
    <>
      <style>{`
        .prose {
          max-width: 660px;
          margin: 0 auto;
          padding: 1rem 2.5rem 3rem;
        }

        .prose-wide {
          max-width: 820px;
        }

        .prose p {
          font-family: var(--font-body);
          font-size: 19px;
          line-height: 1.8;
          color: rgba(240, 232, 216, 0.87);
          margin-bottom: 1.65em;
        }

        .prose-dropcap p:first-child::first-letter {
          font-family: var(--font-headline);
          font-weight: 700;
          font-size: 4.2em;
          float: left;
          margin: 0.05em 0.12em 0 0;
          color: var(--gold);
          line-height: 0.85;
        }

        @media (max-width: 640px) {
          .prose {
            padding: 1rem 1.5rem 2.5rem;
          }
        }
      `}</style>

      <div className={`prose${wide ? ' prose-wide' : ''}${dropcap ? ' prose-dropcap' : ''}`}>
        {children}
      </div>
    </>
  )
}
