import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import type { Metadata } from 'next'
import { getArticleBySlug, getAllArticleSlugs } from '@/lib/mdx'
import Filmstrip from '@/components/Filmstrip'
import Gate from '@/components/Gate'
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

const components = {
  Gate,
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

interface PageProps {
  params: Promise<{ article: string }>
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs()
  return slugs.map((slug) => ({ article: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { article } = await params
  const data = getArticleBySlug(article)
  if (!data) return {}

  const { frontmatter } = data
  return {
    title: frontmatter.title,
    description: frontmatter.deck,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.deck,
      images: [`/og/${article}.jpg`],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.deck,
      images: [`/og/${article}.jpg`],
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { article } = await params
  const data = getArticleBySlug(article)

  if (!data) notFound()

  const { frontmatter, content } = data

  return (
    <>
      <Filmstrip acts={frontmatter.acts} totalMinutes={frontmatter.totalMinutes} />
      <main style={{ paddingTop: '48px' }}>
        <MDXRemote source={content} components={components} />
      </main>
    </>
  )
}
