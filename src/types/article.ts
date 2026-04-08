export interface Act {
  id: string
  label: string
  name: string
}

export interface ArticleFrontmatter {
  title: string
  subject: string
  issue: string
  deck: string
  totalMinutes: number
  gate: string
  coldOpenTag: string
  acts: Act[]
}

export interface ContradictionItem {
  yearSaid: string
  quote: string
  source: string
  yearDid: string
  action: string
  badge: string
  gap: number
}

export interface OralHistoryVoice {
  name: string
  role: string
  quote: string
}

export interface EvidenceItem {
  number: string
  text: string
  redacted?: string
}

export type VerdictLine = string | { text: string; em?: boolean | string }
