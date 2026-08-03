/**
 * Temporary Unsplash stand-ins for every PlaceholderMedia slot that isn't
 * already wired to a real Cloudinary asset (hero video, logo). Swap each
 * constant for a real Cloudinary URL as photography comes in — every call
 * site just reads from here, nothing else needs to change.
 */
function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`
}

export const stockImages = {
  chefPortrait: unsplash("1580489944761-15a19d654956"),
  kitchen: unsplash("1543007630-9710e4a00a20"),
  privateDiningRoom: unsplash("1521017432531-fbd92d768814"),
  atmosphere: unsplash("1590846406792-0adc7f938f1d"),
  journeyCourse: unsplash("1519708227418-c8fd9a32b7a2"),
  bookingTable: unsplash("1600891964599-f61ba0e24092"),
  privateEventsHero: unsplash("1517248135467-4c7edcad34c4"),

  ingredients: {
    uni: unsplash("1553621042-f6e147245754"),
    wagyu: unsplash("1558030006-450675393462"),
    yuzu: unsplash("1547514701-42782101795e"),
    charcoal: unsplash("1555939594-58d7cb561ad1"),
    rice: unsplash("1516684732162-798a0062be99"),
  },

  dishes: {
    wagyu: unsplash("1598511726623-d2e9996892f0"),
    uniRice: unsplash("1553621042-f6e147245754"),
    blackCod: unsplash("1467003909585-2f8a72700288"),
    duck: unsplash("1544025162-d76694265947"),
  },

  team: {
    chef: unsplash("1580489944761-15a19d654956"),
    sommelier: unsplash("1560250097-0b93528c311a"),
    sousChef: unsplash("1607631568010-a87245c0daf8"),
    generalManager: unsplash("1544005313-94ddf0286df2"),
  },

  packages: {
    intimate: unsplash("1550966871-3ed3cdb5ed0c"),
    fullBuyout: unsplash("1552566626-52f8b828add9"),
  },

  gallery: {
    interior: unsplash("1550966871-3ed3cdb5ed0c"),
    food: unsplash("1467003909585-2f8a72700288"),
    events: unsplash("1552566626-52f8b828add9"),
  },

  menu: {
    uniToast: unsplash("1553621042-f6e147245754"),
    wagyu: unsplash("1558030006-450675393462"),
    blackCod: unsplash("1519708227418-c8fd9a32b7a2"),
  },
} as const
