import { Link, useParams } from 'react-router-dom'
import { POSTS, postBySlug } from '../data/blog'
import { SectionHead } from '../components/ProductCard'

export function BlogPage() {
  return (
    <div className="shell py-10 md:py-14">
      <SectionHead level={1} eyebrow="The Journal" title="Read before you print" note="Fit guides, the slang atlas, and why a gaali became a brand." />
      <div className="grid border-l border-t border-line md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p) => (
          <Link
            key={p.slug}
            to={`/blog/${p.slug}`}
            className="group grid content-start gap-3 border-b border-r border-line p-6 transition-colors duration-500 hover:bg-surface md:p-8"
          >
            <p className="micro">
              {p.cat} · {p.read} min · {p.date}
            </p>
            <h2 className="font-display text-[1.75rem] font-semibold uppercase leading-[1.08] tracking-[0.03em] transition-colors group-hover:text-gold">
              {p.title}
            </h2>
            <p className="text-sm text-muted">{p.dek}</p>
            <span className="micro mt-2 text-gold">Read →</span>
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
      <div className="shell grid justify-items-center gap-5 py-24 text-center">
        <h1 className="h-section">Post not found</h1>
        <Link to="/blog" className="btn btn-secondary">
          Back to the Journal
        </Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-[clamp(1rem,0.5rem+2.5vw,3rem)] py-10 md:py-14">
      <Link to="/blog" className="u micro text-bone">
        ← Journal
      </Link>
      <p className="eyebrow mt-8">
        {post.cat} · {post.read} min read · {post.date}
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.2rem,1.2rem+3vw,3.75rem)] font-medium uppercase leading-[1.02] tracking-[0.02em]">
        {post.title}
      </h1>
      <p className="lede mt-5 max-w-none text-lg">{post.dek}</p>
      <div className="my-10 h-px bg-line" />
      <div className="prose-bkc" dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  )
}
