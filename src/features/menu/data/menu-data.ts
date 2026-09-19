import type { MenuCategoryWithItems, MenuItem } from "@/services/menu.service"

const NOW = "2026-09-19T00:00:00.000Z"

function item(
  categoryId: string,
  overrides: Pick<
    MenuItem,
    "name" | "slug" | "description" | "ingredients" | "price" | "sort_order"
  > &
    Partial<Pick<MenuItem, "allergens" | "dietary_tags" | "is_chef_recommendation">>
): MenuItem {
  return {
    id: `${categoryId}-${overrides.slug}`,
    category_id: categoryId,
    allergens: [],
    dietary_tags: [],
    currency: "INR",
    image_url: null,
    gallery: [],
    is_chef_recommendation: false,
    is_available: true,
    created_at: NOW,
    updated_at: NOW,
    ...overrides,
  }
}

const vegetarianId = "chefs-signature-vegetarian"
const nonVegetarianId = "chefs-signature-non-vegetarian"
const cocktailsId = "artisanal-signature-cocktails"

/**
 * Static stand-in for the menu until a real Supabase project is provisioned —
 * the site currently has no working database, so the /menu page reads this
 * directly instead of calling services/menu.service.
 */
export const menuData: MenuCategoryWithItems[] = [
  {
    id: vegetarianId,
    slug: vegetarianId,
    name: "Chef's Signature — Vegetarian",
    description: "Bright, sharable plates built for the table.",
    sort_order: 0,
    created_at: NOW,
    items: [
      item(vegetarianId, {
        name: "Edamame Truffle Toast",
        slug: "edamame-truffle-toast",
        description: "Crispy fried toast topped with truffle oil infused edamame mixture.",
        ingredients: ["edamame", "truffle oil", "toast"],
        allergens: ["gluten"],
        dietary_tags: ["vegetarian"],
        price: 355,
        sort_order: 0,
      }),
      item(vegetarianId, {
        name: "Truffle Fries with Togarashi Dust",
        slug: "truffle-fries-togarashi-dust",
        description: "Fried potato with parmesan cheese infused with truffle oil.",
        ingredients: ["potato", "parmesan", "truffle oil", "togarashi"],
        allergens: ["dairy"],
        dietary_tags: ["vegetarian"],
        price: 345,
        sort_order: 1,
      }),
      item(vegetarianId, {
        name: "Smoked Chili Cottage Cheese Wrap",
        slug: "smoked-chili-cottage-cheese-wrap",
        description:
          "Tortilla wrap stuffed with wok tossed smoked chili cottage cheese & grilled.",
        ingredients: ["cottage cheese", "tortilla", "chili"],
        allergens: ["dairy", "gluten"],
        dietary_tags: ["vegetarian"],
        price: 355,
        sort_order: 2,
      }),
      item(vegetarianId, {
        name: "Oriental Style Cottage Cheese",
        slug: "oriental-style-cottage-cheese",
        description:
          "Soft fried cottage cheese tossed with fresh red chili, curry leaf, oats & dry milk.",
        ingredients: ["cottage cheese", "red chili", "curry leaf", "oats", "dry milk"],
        allergens: ["dairy"],
        dietary_tags: ["vegetarian"],
        price: 465,
        sort_order: 3,
      }),
      item(vegetarianId, {
        name: "Sushi Platter - 12 pcs",
        slug: "sushi-platter-12-pcs",
        description:
          "Select any 2 varieties of sushi rolls & 4 pcs nigiri - avocado, inari nigiri, asparagus nigiri.",
        ingredients: ["avocado", "inari", "asparagus", "sushi rice", "nori"],
        allergens: ["soy"],
        dietary_tags: ["vegetarian"],
        price: 1399,
        is_chef_recommendation: true,
        sort_order: 4,
      }),
    ],
  },
  {
    id: nonVegetarianId,
    slug: nonVegetarianId,
    name: "Chef's Signature — Non-Vegetarian",
    description: "Wok-tossed, grilled, and raw-cut favourites.",
    sort_order: 1,
    created_at: NOW,
    items: [
      item(nonVegetarianId, {
        name: "Prawn on Toast",
        slug: "prawn-on-toast",
        description:
          "Crispy fried toast topped with truffle oil infused prawn & edamame mixture.",
        ingredients: ["prawn", "edamame", "truffle oil", "toast"],
        allergens: ["shellfish", "gluten"],
        price: 375,
        sort_order: 0,
      }),
      item(nonVegetarianId, {
        name: "Smoked Chili Chicken Wrap",
        slug: "smoked-chili-chicken-wrap",
        description: "Tortilla wrap stuffed with wok tossed smoked chili chicken & grilled.",
        ingredients: ["chicken", "tortilla", "chili"],
        allergens: ["gluten"],
        price: 365,
        sort_order: 1,
      }),
      item(nonVegetarianId, {
        name: "Malaysian Style Prawn",
        slug: "malaysian-style-prawn",
        description:
          "Soft fried prawn tossed with creamy sauce finished with fresh red chili & curry leaf.",
        ingredients: ["prawn", "red chili", "curry leaf", "cream"],
        allergens: ["shellfish", "dairy"],
        price: 695,
        sort_order: 2,
      }),
      item(nonVegetarianId, {
        name: "Chili Pork",
        slug: "chili-pork",
        description: "Spicy pork shoulder preparation with sliced fresh green chili & soy.",
        ingredients: ["pork shoulder", "green chili", "soy"],
        allergens: ["soy"],
        price: 675,
        sort_order: 3,
      }),
      item(nonVegetarianId, {
        name: "Panang Style Grilled Fish",
        slug: "panang-style-grilled-fish",
        description: "Grilled chunk of red snapper fish with Thai panang curry & herbs.",
        ingredients: ["red snapper", "panang curry", "herbs"],
        allergens: ["fish"],
        price: 695,
        sort_order: 4,
      }),
      item(nonVegetarianId, {
        name: "Sashimi Moriawase Platter",
        slug: "sashimi-moriawase-platter",
        description: "Hotate, maguro, sake, tako & yellow tail - 3 pcs each.",
        ingredients: ["hotate", "maguro", "sake", "tako", "yellow tail"],
        allergens: ["fish", "shellfish"],
        is_chef_recommendation: true,
        price: 799,
        sort_order: 5,
      }),
      item(nonVegetarianId, {
        name: "Moriawase Platter",
        slug: "moriawase-platter",
        description:
          "(Roll - 8 pcs, Nigiri - 4 pcs) - Total 12 pcs. Select any 2: Ato Bomb Uramaki / Ebi Tempura / Classic California. Select any 2: Salmon / Maguro / Tako Nigiri.",
        ingredients: ["salmon", "maguro", "tako", "ebi tempura", "sushi rice", "nori"],
        allergens: ["fish", "shellfish", "soy"],
        is_chef_recommendation: true,
        price: 1749,
        sort_order: 6,
      }),
    ],
  },
  {
    id: cocktailsId,
    slug: cocktailsId,
    name: "Artisanal Signature Cocktails",
    description: "House-crafted cocktails — standard measure 30 ml.",
    sort_order: 2,
    created_at: NOW,
    items: [
      item(cocktailsId, {
        name: "Ginkoloma",
        slug: "ginkoloma",
        description:
          "Patrón Reposado, Homemade Grapefruit Hibiscus Cordial, Saline Water topped up with bubble.",
        ingredients: ["patron reposado", "grapefruit hibiscus cordial", "saline water"],
        price: 799,
        sort_order: 0,
      }),
      item(cocktailsId, {
        name: "Matcha Sour",
        slug: "matcha-sour",
        description: "Bombay Sapphire, Matcha Syrup, Lemon Juice, Egg White.",
        ingredients: ["bombay sapphire", "matcha syrup", "lemon juice", "egg white"],
        price: 799,
        sort_order: 1,
      }),
      item(cocktailsId, {
        name: "The Maiko",
        slug: "the-maiko",
        description: "Patrón Reposado, Homemade Picante Cordial, Peri Peri.",
        ingredients: ["patron reposado", "picante cordial", "peri peri"],
        price: 799,
        sort_order: 2,
      }),
      item(cocktailsId, {
        name: "Mizuki",
        slug: "mizuki",
        description: "Blue Pea infused Vodka, Homemade Lemongrass Syrup, Lime Juice, Foamee.",
        ingredients: ["blue pea infused vodka", "lemongrass syrup", "lime juice", "foamee"],
        price: 799,
        sort_order: 3,
      }),
      item(cocktailsId, {
        name: "Wasabi Martini",
        slug: "wasabi-martini",
        description: "Gin, Wasabi, Homemade Sushi Vinegar, Togarashi Nori Sheet.",
        ingredients: ["gin", "wasabi", "sushi vinegar", "togarashi nori sheet"],
        price: 799,
        sort_order: 4,
      }),
      item(cocktailsId, {
        name: "Yuzu Margarita",
        slug: "yuzu-margarita",
        description: "Tequila, Yuzu Puree, Mango, Simple Syrup, Saline Water.",
        ingredients: ["tequila", "yuzu puree", "mango", "simple syrup", "saline water"],
        price: 799,
        sort_order: 5,
      }),
      item(cocktailsId, {
        name: "Naked Negroni",
        slug: "naked-negroni",
        description: "Lacto clarified White Negroni.",
        ingredients: ["gin", "vermouth", "bitter liqueur"],
        price: 799,
        sort_order: 6,
      }),
      item(cocktailsId, {
        name: "Skinny Pina Colada",
        slug: "skinny-pina-colada",
        description: "Clarified Pina Colada.",
        ingredients: ["rum", "coconut", "pineapple"],
        price: 799,
        sort_order: 7,
      }),
      item(cocktailsId, {
        name: "Twisted Bloody Mearii",
        slug: "twisted-bloody-mearii",
        description:
          "Vodka, Tomato Juice, Worcestershire Sauce, Black Pepper, Salt, Tobasco Sauce, Lime Juice, Celery.",
        ingredients: [
          "vodka",
          "tomato juice",
          "worcestershire sauce",
          "black pepper",
          "salt",
          "tobasco sauce",
          "lime juice",
          "celery",
        ],
        price: 799,
        sort_order: 8,
      }),
      item(cocktailsId, {
        name: "El Gaijin",
        slug: "el-gaijin",
        description: "Tequila, Grapefruit, Triple Sec, Lime Juice.",
        ingredients: ["tequila", "grapefruit", "triple sec", "lime juice"],
        price: 799,
        sort_order: 9,
      }),
    ],
  },
]
