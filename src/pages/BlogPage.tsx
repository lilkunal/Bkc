import { Link, useParams } from 'react-router-dom'
import { POSTS, postBySlug } from '../data/blog'
import { SectionHead } from '../components/ProductCard'

export function BlogPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:py-12">
      <SectionHead eyebrow="The Journal" title="Read before you print" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className="flex flex-col border-2 border-ink bg-cream">
            <div className="flex h-36 items-center justify-center text-5xl" style={{ background: p.bg }}>
              {p.glyph}
            </div>
            <div className="flex flex-1 flex-col gap-2 border-t-2 border-ink p-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-45">
                {p.cat} · {p.read} min · {p.date}
              </span>
              <h2 className="font-display text-xl uppercase leading-tight">{p.title}</h2>
              <p className="text-sm text-ink-70">{p.dek}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function PostPage() {
  const { slug } = useParams()
  const post = postBySlug(slug || '')
  if (!post) {
    return (
      <div className="px-4 py-20 text-center">
        <p>Post not found.</p>
        <Link to="/blog" className="underline">
          Journal
        </Link>
      </div>
    )
  }
  return (
    <article className="mx-auto max-w-3xl px-[clamp(1rem,0.5rem+2vw,3rem)] py-8 md:py-12">
      <Link to="/blog" className="text-sm underline">
        ← Journal
      </Link>
      <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-45">
        {post.cat} · {post.read} min read · {post.date}
      </p>
      <h1 className="mt-2 font-display text-[clamp(2rem,1rem+3vw,3.5rem)] uppercase leading-none">
        {post.title}
      </h1>
      <p className="mt-3 text-lg text-ink-70">{post.dek}</p>
      <div className="prose-bkc mt-8" dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  )
}
