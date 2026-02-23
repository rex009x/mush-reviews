import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import { allBlogs } from 'contentlayer/generated'
import { sortPosts } from 'pliny/utils/contentlayer'

export const metadata = genPageMetadata({
  title: 'Restaurant Map',
  description: 'Find reviewed restaurants with location details around New York City.',
})

type BlogWithLocation = (typeof allBlogs)[number] & {
  restaurantAddress?: string
  restaurantName?: string
  googleMapsUrl?: string
}

const NYC_CENTER = {
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 11,
}

function getMapsEmbedUrl() {
  const params = new URLSearchParams({
    q: `${NYC_CENTER.latitude},${NYC_CENTER.longitude}`,
    z: NYC_CENTER.zoom.toString(),
    output: 'embed',
  })

  return `https://maps.google.com/maps?${params.toString()}`
}

function getMapsLink(post: BlogWithLocation) {
  if (post.googleMapsUrl) {
    return post.googleMapsUrl
  }

  if (post.restaurantAddress) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.restaurantAddress)}`
  }

  return undefined
}

export default function MapPage() {
  const locationEnabledPosts = sortPosts(allBlogs).filter((post): post is BlogWithLocation =>
    Boolean(post.restaurantAddress || post.googleMapsUrl)
  )

  return (
    <div className="space-y-8 pt-6 pb-8 md:pt-10 md:pb-12">
      <div className="space-y-3">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
          Restaurant Map
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          A quick look at restaurant posts with location details in and around New York City.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
          <iframe
            title="Map centered on New York City"
            src={getMapsEmbedUrl()}
            className="h-[420px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <section className="rounded-lg border border-gray-200 p-5 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Nearby entries</h2>

          {locationEnabledPosts.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              No posts with restaurant location details are available yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {locationEnabledPosts.map((post) => {
                const mapsUrl = getMapsLink(post)

                return (
                  <li key={post._id} className="space-y-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {post.restaurantName || post.title}
                    </p>
                    <Link href={`/${post.path}`} className="block text-sm">
                      View review
                    </Link>
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
                      >
                        Open in Google Maps
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
