export const siteConfig = {
  name: "Miss Ginko",
  shortName: "Ginko",
  tagline: "Where Flavours Become Memories",
  description:
    "Modern Asian fine dining in the heart of the city. An editorial, cinematic dining experience built on seasonal ingredients, precision technique, and quiet luxury.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.missginko.com",
  ogImage: "/og/default.jpg",
  logoUrl: "https://res.cloudinary.com/dc3qprub3/image/upload/v1785745708/logo_bkhlwa.png",
  locale: "en_US",
  cuisine: "Modern Asian Fine Dining",
  priceRange: "$$$$",
  founded: "2016",

  contact: {
    phone: "+1 (212) 555-0148",
    phoneDisplay: "+1 212 555 0148",
    email: "reservations@missginko.com",
    eventsEmail: "events@missginko.com",
    address: {
      street: "88 Lafayette Street",
      city: "New York",
      region: "NY",
      postalCode: "10013",
      country: "US",
    },
    geo: {
      latitude: 40.7178,
      longitude: -74.0007,
    },
  },

  hours: [
    { days: "Monday — Thursday", time: "5:30 PM — 11:00 PM" },
    { days: "Friday — Saturday", time: "5:30 PM — 12:00 AM" },
    { days: "Sunday", time: "5:00 PM — 10:00 PM" },
  ],

  socials: {
    instagram: "https://instagram.com/missginko",
    facebook: "https://facebook.com/missginko",
    twitter: "https://twitter.com/missginko",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ] as const,

  footerLinks: {
    explore: [
      { label: "Menu", href: "/menu" },
      { label: "About", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Reviews", href: "/reviews" },
      { label: "FAQ", href: "/faq" },
    ],
    company: [
      { label: "Private Events", href: "/private-events" },
      { label: "Contact", href: "/contact" },
      { label: "Reserve a Table", href: "/booking" },
    ],
  },
} as const

export type SiteConfig = typeof siteConfig
