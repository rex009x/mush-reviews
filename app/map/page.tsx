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

const SCROLLBAR_STYLES = `
  .restaurants-list::-webkit-scrollbar {
    width: 6px;
  }
  .restaurants-list::-webkit-scrollbar-track {
    background: transparent;
  }
  .restaurants-list::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
  .restaurants-list::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  .dark .restaurants-list::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
  .dark .restaurants-list::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
`

const MAP_EMBED_URL =
  'https://www.google.com/maps/d/u/0/embed?mid=1-eZ1Ea1tAiyug3jIIG2aYSBCkivKv9A&ehbc=2E312F&noprof=1'
const MAP_HIDE_BANNER_STYLES = `
  div#block-yui_3_17_2_1_1685838379094_5882>div {
    overflow: hidden;
  }
  iframe[src*="maps/d"] {
    margin-top: -70px;
  }
`

function getMapsLink(post: BlogWithLocation) {
  if (post.googleMapsUrl) {
    return post.googleMapsUrl
  }

  if (post.restaurantAddress) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.restaurantAddress)}`
  }

  return undefined
}

function RestaurantListItem({ post }: { post: BlogWithLocation }) {
  const mapsUrl = getMapsLink(post)

  return (
    <li className="space-y-0.5 border-b border-gray-100 pb-2.5 last:border-0 dark:border-gray-800">
      <p className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        {post.restaurantName || post.title}
      </p>
      <Link
        href={`/${post.path}`}
        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 block text-xs"
      >
        View review
      </Link>
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-xs"
        >
          Get Directions →
        </a>
      )}
    </li>
  )
}

export default function MapPage() {
  const locationEnabledPosts = sortPosts(allBlogs).filter((post): post is BlogWithLocation =>
    Boolean(post.restaurantAddress || post.googleMapsUrl)
  )

  return (
    <>
      <style>{`${MAP_HIDE_BANNER_STYLES}${SCROLLBAR_STYLES}`}</style>
      <div className="space-y-8 pt-6 pb-8 md:pt-10 md:pb-12">
        <div className="space-y-3">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
            Restaurant Map
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            A quick look at restaurant posts with location details in and around New York City.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[4fr_1fr]">
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
            <iframe
              title="Restaurant Map"
              src={MAP_EMBED_URL}
              className="h-[600px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <section className="sticky top-20 h-fit rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Nearby entries
            </h2>

            {locationEnabledPosts.length === 0 ? (
              <p className="mt-3 text-xs text-gray-600 dark:text-gray-300">
                No posts with restaurant location details are available yet.
              </p>
            ) : (
              <ul className="restaurants-list mt-3 max-h-[680px] space-y-2.5 overflow-y-scroll">
                {locationEnabledPosts.map((post) => (
                  <RestaurantListItem key={post._id} post={post} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
