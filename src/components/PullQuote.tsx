interface PullQuoteProps {
  quote: string
  cite: string
}

export default function PullQuote({ quote, cite }: PullQuoteProps) {
  return (
    <>
      <style>{`
        .pull-quote {
          max-width: 580px;
          margin: 0 auto 3rem;
          padding: 1.75rem 2.5rem;
          border-left: 2px solid var(--gold);
        }

        .pull-quote-text {
          font-family: var(--font-headline);
          font-size: clamp(16px, 2vw, 21px);
          font-style: italic;
          font-weight: 400;
          line-height: 1.45;
          color: #f0e8d8;
          margin-bottom: 0.75rem;
        }

        .pull-quote-cite {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          font-style: normal;
        }
      `}</style>

      <blockquote className="pull-quote">
        <p className="pull-quote-text">{quote}</p>
        <cite className="pull-quote-cite">{cite}</cite>
      </blockquote>
    </>
  )
}
