import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { ArticleFrontmatter } from '@/types/article'

const CONTENT_DIR = path.join(process.cwd(), 'src/content')

export function getArticleBySlug(slug: string): {
  frontmatter: ArticleFrontmatter
  content: string
} | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    frontmatter: data as ArticleFrontmatter,
    content,
  }
}

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return []
  }

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}
