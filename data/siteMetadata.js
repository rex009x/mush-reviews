/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'Mushreviews',
  author: 'Jimmy Luc',
  headerTitle: 'Mushreviews',
  description: 'A husband and wife’s journey through food, from dining out to cooking at home.',
  language: 'en-us',
  theme: 'light',
  siteUrl: 'https://mushreviews.vercel.app/',
  siteRepo: 'https://github.com/rex009x/mush-reviews',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/banner.png`,
  email: '1lucjim@gmail.com',
  github: 'https://github.com/rex009x',
  linkedin: 'https://www.linkedin.com/m/in/1lucjim/',
  instagram: 'https://www.instagram.com/ji.mm.eh/',
  locale: 'en-US',
  stickyNav: false,
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.NEXT_UMAMI_ID,
    },
  },
  newsletter: {
    provider: 'buttondown',
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
