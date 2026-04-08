import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getArticleBySlug } from '@/lib/mdx'
import LandingClient from '@/components/LandingClient'
import Hero from '@/components/Hero'
import ActBreak from '@/components/ActBreak'
import Prose from '@/components/Prose'
import OpenLoop from '@/components/OpenLoop'
import PullQuote from '@/components/PullQuote'
import SceneCard from '@/components/SceneCard'
import OralHistory from '@/components/OralHistory'
import SecondPerson from '@/components/SecondPerson'
import EvidenceFile from '@/components/EvidenceFile'
import ContradictionEngine from '@/components/ContradictionEngine'
import Verdict from '@/components/Verdict'
import MotifReveal from '@/components/MotifReveal'
import MentalModel from '@/components/MentalModel'
import ReaderVote from '@/components/ReaderVote'

export const metadata: Metadata = {
  title: 'longcut.ink',
  description: 'Cinematic long-form journalism. The long game, in ink.',
  openGraph: {
    title: 'longcut.ink',
    description: 'Cinematic long-form journalism. The long game, in ink.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'longcut.ink',
    description: 'Cinematic long-form journalism. The long game, in ink.',
  },
}

// Gate inside the MDX is suppressed — LandingClient renders the real Gate above
const NullGate = () => null

const components = {
  Gate: NullGate,
  Hero,
  ActBreak,
  Prose,
  OpenLoop,
  PullQuote,
  SceneCard,
  OralHistory,
  SecondPerson,
  EvidenceFile,
  ContradictionEngine,
  Verdict,
  MotifReveal,
  MentalModel,
  ReaderVote,
}

export default async function HomePage() {
  const data = getArticleBySlug('altman')
  if (!data) return null

  const { frontmatter, content } = data

  return (
    <LandingClient
      question={frontmatter.gate}
      acts={frontmatter.acts}
      totalMinutes={frontmatter.totalMinutes}
    >
      <MDXRemote source={content} components={components} />
    </LandingClient>
  )
}
