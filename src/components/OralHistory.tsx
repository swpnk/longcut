import { OralHistoryVoice } from '@/types/article'

interface OralHistoryProps {
  voices: OralHistoryVoice[]
  eyebrow?: string
}

export default function OralHistory({ voices = [], eyebrow }: OralHistoryProps) {
  return (
    <>
      <style>{`
        .oral-history {
          max-width: 820px;
          margin: 0 auto;
          padding: 3rem 2.5rem;
        }

        .oral-history-eyebrow {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 2rem;
        }

        .oral-history-eyebrow::after {
          content: '';
          flex: 1;
          height: 0.5px;
          background: var(--gold-dim);
        }

        .oral-voice {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 1.25rem;
          border-bottom: 0.5px solid var(--faint);
          padding-bottom: 2rem;
          margin-bottom: 2rem;
        }

        .oral-voice:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .oral-voice-id {
          padding-top: 0.2rem;
        }

        .oral-voice-name {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.3rem;
        }

        .oral-voice-role {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.2);
          line-height: 1.5;
        }

        .oral-voice-quote {
          font-family: var(--font-body);
          font-size: 16px;
          font-style: italic;
          color: rgba(240, 232, 216, 0.75);
          line-height: 1.7;
        }

        @media (max-width: 640px) {
          .oral-voice {
            grid-template-columns: 1fr;
            gap: 0.6rem;
          }
        }
      `}</style>

      <div className="oral-history">
        {eyebrow && <div className="oral-history-eyebrow">{eyebrow}</div>}
        {voices.map((voice, i) => (
          <div key={i} className="oral-voice">
            <div className="oral-voice-id">
              <div className="oral-voice-name">{voice.name}</div>
              <div className="oral-voice-role">{voice.role}</div>
            </div>
            <div className="oral-voice-quote">&ldquo;{voice.quote}&rdquo;</div>
          </div>
        ))}
      </div>
    </>
  )
}
