import React, { Suspense } from "react";
import { getCachedProductBySlug } from "@/lib/data-service";
import { CacheStatusBadge } from "@/components/caching/CacheStatusBadge";
import { CodeSnippet } from "@/components/caching/CodeSnippet";

interface Props {
  params: Promise<{ slug: string }>;
}

async function ProductDetails({ slugPromise }: { slugPromise: Promise<{ slug: string }> }) {
  const { slug } = await slugPromise;
  const { product, formattedTime } = await getCachedProductBySlug(slug);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {product.category}
          </span>
          <h2 className="text-xl font-bold text-foreground mt-0.5">{product.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold text-foreground">${product.price}</span>
            <span className="text-xs text-muted-foreground">• In Stock: {product.stock} units</span>
            <span className="rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-xs font-medium">
              ★ {product.rating}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-xs font-mono">
          <CacheStatusBadge type="data-cache" label="Cached by Slug ('use cache')" />
          <span className="text-muted-foreground text-[11px]">Cached at: {formattedTime}</span>
        </div>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed">{product.description}</p>

      <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-xs text-sky-800 dark:text-sky-300">
        💡 <strong>Cache Tag Scoping:</strong> This product is cached with tag: <code>product-{product.slug}</code>.
        Invalidating <code>revalidateTag(&quot;products&quot;)</code> revalidates all products, while{" "}
        <code>revalidateTag(&quot;product-{product.slug}&quot;)</code> revalidates only this specific item.
      </div>
    </div>
  );
}

export default function ShopProductPage({ params }: Props) {
  const codeExample = `// app/shop/[slug]/layout.tsx
// Maximizing the static shell: layout NEVER awaits params!
export default function Layout({ children, params }) {
  return (
    <div>
      <Sidebar /> {/* Included in static shell */}
      <Suspense fallback={<h1>Loading...</h1>}>
        {/* await happens inside the Suspense boundary */}
        {params.then(({ slug }) => <SlugHeading slug={slug} />)}
      </Suspense>
      {children}
    </div>
  )
}`;

  return (
    <div className="flex flex-col gap-6">
      <Suspense
        fallback={
          <div className="rounded-2xl border border-border/40 bg-muted/20 p-8 animate-pulse h-64">
            <div className="h-6 w-48 bg-muted/60 rounded mb-4" />
            <div className="h-4 w-full bg-muted/40 rounded mb-2" />
            <div className="h-4 w-3/4 bg-muted/40 rounded" />
          </div>
        }
      >
        <ProductDetails slugPromise={params} />
      </Suspense>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">
          Why passing params down maximizes the static shell
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          In older versions of Next.js, awaiting <code>params</code> in the root layout opted the entire layout and
          sidebar out of prerendering. In the Cache Components model, deferring the resolution of <code>params</code> into
          a leaf component boundary allows the entire shell (headers, sidebars, navigation) to be statically prerendered
          and served with zero delay from CDNs.
        </p>
        <CodeSnippet
          title="Pattern from Next.js Documentation"
          code={codeExample}
          docLink="https://nextjs.org/docs/app/getting-started/caching#maximizing-the-static-shell"
        />
      </div>
    </div>
  );
}
