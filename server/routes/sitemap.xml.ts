import { defineEventHandler, setHeader } from 'h3'

const SITE_URL = 'https://familycorner.pk'
const PAGE_SIZE = 100
const MAX_PRODUCT_PAGES = 100

type SitemapProduct = {
  slug?: string
  status?: string
  updated_at?: string
}

type SitemapCategory = {
  slug?: string
  children?: SitemapCategory[]
}

type ProductPage = {
  data?: SitemapProduct[]
  meta?: {
    total_pages?: number
    page?: number
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function addCategoryUrls(categories: SitemapCategory[], urls: Map<string, string | undefined>) {
  for (const category of categories) {
    if (category.slug) {
      const url = `${SITE_URL}/products?category=${encodeURIComponent(category.slug)}`
      urls.set(url, undefined)
    }

    if (category.children?.length) {
      addCategoryUrls(category.children, urls)
    }
  }
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')

  const urls = new Map<string, string | undefined>([
    [SITE_URL, undefined],
    [`${SITE_URL}/products`, undefined],
  ])

  const config = useRuntimeConfig(event)
  const apiBase = String(config.public.apiBase || '').replace(/\/+$/, '')
  const isConfiguredApi = apiBase && !/localhost|127\.0\.0\.1/i.test(apiBase)

  if (isConfiguredApi) {
    // Product and category failures must not turn the sitemap itself into a 500.
    try {
      const categories = await $fetch<SitemapCategory[]>(`${apiBase}/categories`, {
        query: { active_only: true },
      })
      if (Array.isArray(categories)) addCategoryUrls(categories, urls)
    } catch (error) {
      console.error('[sitemap] Could not load categories:', error)
    }

    try {
      let page = 1
      let totalPages = 1

      while (page <= totalPages && page <= MAX_PRODUCT_PAGES) {
        const response = await $fetch<ProductPage>(`${apiBase}/products`, {
          query: { page, limit: PAGE_SIZE, sort_by: 'created_at', sort_order: 'desc' },
        })

        for (const product of response.data || []) {
          if (!product.slug || product.status && product.status !== 'active') continue
          urls.set(
            `${SITE_URL}/products/${encodeURIComponent(product.slug)}`,
            product.updated_at,
          )
        }

        totalPages = Math.max(1, Number(response.meta?.total_pages || 1))
        page += 1
      }
    } catch (error) {
      console.error('[sitemap] Could not load products:', error)
    }
  }

  const entries = Array.from(urls.entries()).map(([loc, lastmod]) => {
    const lastmodTag = lastmod && !Number.isNaN(Date.parse(lastmod))
      ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>`
      : ''

    return `<url><loc>${escapeXml(loc)}</loc>${lastmodTag}<changefreq>daily</changefreq></url>`
  })

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`
})
