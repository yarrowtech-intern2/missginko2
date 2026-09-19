-- Sample data for local development — `supabase db reset` picks this up automatically.

insert into public.menu_categories (name, slug, description, sort_order) values
  ('Chef''s Signature — Vegetarian', 'chefs-signature-vegetarian', 'Bright, sharable plates built for the table.', 0),
  ('Chef''s Signature — Non-Vegetarian', 'chefs-signature-non-vegetarian', 'Wok-tossed, grilled, and raw-cut favourites.', 1),
  ('Artisanal Signature Cocktails', 'artisanal-signature-cocktails', 'House-crafted cocktails — standard measure 30 ml.', 2);

-- Chef's Signature — Vegetarian

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, sort_order)
select id, 'Edamame Truffle Toast', 'edamame-truffle-toast', 'Crispy fried toast topped with truffle oil infused edamame mixture.', array['edamame','truffle oil','toast'], array['gluten'], array['vegetarian'], 355, 'INR', 0
from public.menu_categories where slug = 'chefs-signature-vegetarian';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, sort_order)
select id, 'Truffle Fries with Togarashi Dust', 'truffle-fries-togarashi-dust', 'Fried potato with parmesan cheese infused with truffle oil.', array['potato','parmesan','truffle oil','togarashi'], array['dairy'], array['vegetarian'], 345, 'INR', 1
from public.menu_categories where slug = 'chefs-signature-vegetarian';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, sort_order)
select id, 'Smoked Chili Cottage Cheese Wrap', 'smoked-chili-cottage-cheese-wrap', 'Tortilla wrap stuffed with wok tossed smoked chili cottage cheese & grilled.', array['cottage cheese','tortilla','chili'], array['dairy','gluten'], array['vegetarian'], 355, 'INR', 2
from public.menu_categories where slug = 'chefs-signature-vegetarian';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, sort_order)
select id, 'Oriental Style Cottage Cheese', 'oriental-style-cottage-cheese', 'Soft fried cottage cheese tossed with fresh red chili, curry leaf, oats & dry milk.', array['cottage cheese','red chili','curry leaf','oats','dry milk'], array['dairy'], array['vegetarian'], 465, 'INR', 3
from public.menu_categories where slug = 'chefs-signature-vegetarian';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, is_chef_recommendation, sort_order)
select id, 'Sushi Platter - 12 pcs', 'sushi-platter-12-pcs', 'Select any 2 varieties of sushi rolls & 4 pcs nigiri - avocado, inari nigiri, asparagus nigiri.', array['avocado','inari','asparagus','sushi rice','nori'], array['soy'], array['vegetarian'], 1399, 'INR', true, 4
from public.menu_categories where slug = 'chefs-signature-vegetarian';

-- Chef's Signature — Non-Vegetarian

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, sort_order)
select id, 'Prawn on Toast', 'prawn-on-toast', 'Crispy fried toast topped with truffle oil infused prawn & edamame mixture.', array['prawn','edamame','truffle oil','toast'], array['shellfish','gluten'], array[]::text[], 375, 'INR', 0
from public.menu_categories where slug = 'chefs-signature-non-vegetarian';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, sort_order)
select id, 'Smoked Chili Chicken Wrap', 'smoked-chili-chicken-wrap', 'Tortilla wrap stuffed with wok tossed smoked chili chicken & grilled.', array['chicken','tortilla','chili'], array['gluten'], array[]::text[], 365, 'INR', 1
from public.menu_categories where slug = 'chefs-signature-non-vegetarian';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, sort_order)
select id, 'Malaysian Style Prawn', 'malaysian-style-prawn', 'Soft fried prawn tossed with creamy sauce finished with fresh red chili & curry leaf.', array['prawn','red chili','curry leaf','cream'], array['shellfish','dairy'], array[]::text[], 695, 'INR', 2
from public.menu_categories where slug = 'chefs-signature-non-vegetarian';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, sort_order)
select id, 'Chili Pork', 'chili-pork', 'Spicy pork shoulder preparation with sliced fresh green chili & soy.', array['pork shoulder','green chili','soy'], array['soy'], array[]::text[], 675, 'INR', 3
from public.menu_categories where slug = 'chefs-signature-non-vegetarian';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, sort_order)
select id, 'Panang Style Grilled Fish', 'panang-style-grilled-fish', 'Grilled chunk of red snapper fish with Thai panang curry & herbs.', array['red snapper','panang curry','herbs'], array['fish'], array[]::text[], 695, 'INR', 4
from public.menu_categories where slug = 'chefs-signature-non-vegetarian';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, is_chef_recommendation, sort_order)
select id, 'Sashimi Moriawase Platter', 'sashimi-moriawase-platter', 'Hotate, maguro, sake, tako & yellow tail - 3 pcs each.', array['hotate','maguro','sake','tako','yellow tail'], array['fish','shellfish'], array[]::text[], 799, 'INR', true, 5
from public.menu_categories where slug = 'chefs-signature-non-vegetarian';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, currency, is_chef_recommendation, sort_order)
select id, 'Moriawase Platter', 'moriawase-platter', '(Roll - 8 pcs, Nigiri - 4 pcs) - Total 12 pcs. Select any 2: Ato Bomb Uramaki / Ebi Tempura / Classic California. Select any 2: Salmon / Maguro / Tako Nigiri.', array['salmon','maguro','tako','ebi tempura','sushi rice','nori'], array['fish','shellfish','soy'], array[]::text[], 1749, 'INR', true, 6
from public.menu_categories where slug = 'chefs-signature-non-vegetarian';

-- Artisanal Signature Cocktails

insert into public.menu_items (category_id, name, slug, description, ingredients, price, currency, sort_order)
select id, 'Ginkoloma', 'ginkoloma', 'Patrón Reposado, Homemade Grapefruit Hibiscus Cordial, Saline Water topped up with bubble.', array['patron reposado','grapefruit hibiscus cordial','saline water'], 799, 'INR', 0
from public.menu_categories where slug = 'artisanal-signature-cocktails';

insert into public.menu_items (category_id, name, slug, description, ingredients, price, currency, sort_order)
select id, 'Matcha Sour', 'matcha-sour', 'Bombay Sapphire, Matcha Syrup, Lemon Juice, Egg White.', array['bombay sapphire','matcha syrup','lemon juice','egg white'], 799, 'INR', 1
from public.menu_categories where slug = 'artisanal-signature-cocktails';

insert into public.menu_items (category_id, name, slug, description, ingredients, price, currency, sort_order)
select id, 'The Maiko', 'the-maiko', 'Patrón Reposado, Homemade Picante Cordial, Peri Peri.', array['patron reposado','picante cordial','peri peri'], 799, 'INR', 2
from public.menu_categories where slug = 'artisanal-signature-cocktails';

insert into public.menu_items (category_id, name, slug, description, ingredients, price, currency, sort_order)
select id, 'Mizuki', 'mizuki', 'Blue Pea infused Vodka, Homemade Lemongrass Syrup, Lime Juice, Foamee.', array['blue pea infused vodka','lemongrass syrup','lime juice','foamee'], 799, 'INR', 3
from public.menu_categories where slug = 'artisanal-signature-cocktails';

insert into public.menu_items (category_id, name, slug, description, ingredients, price, currency, sort_order)
select id, 'Wasabi Martini', 'wasabi-martini', 'Gin, Wasabi, Homemade Sushi Vinegar, Togarashi Nori Sheet.', array['gin','wasabi','sushi vinegar','togarashi nori sheet'], 799, 'INR', 4
from public.menu_categories where slug = 'artisanal-signature-cocktails';

insert into public.menu_items (category_id, name, slug, description, ingredients, price, currency, sort_order)
select id, 'Yuzu Margarita', 'yuzu-margarita', 'Tequila, Yuzu Puree, Mango, Simple Syrup, Saline Water.', array['tequila','yuzu puree','mango','simple syrup','saline water'], 799, 'INR', 5
from public.menu_categories where slug = 'artisanal-signature-cocktails';

insert into public.menu_items (category_id, name, slug, description, ingredients, price, currency, sort_order)
select id, 'Naked Negroni', 'naked-negroni', 'Lacto clarified White Negroni.', array['gin','vermouth','bitter liqueur'], 799, 'INR', 6
from public.menu_categories where slug = 'artisanal-signature-cocktails';

insert into public.menu_items (category_id, name, slug, description, ingredients, price, currency, sort_order)
select id, 'Skinny Pina Colada', 'skinny-pina-colada', 'Clarified Pina Colada.', array['rum','coconut','pineapple'], 799, 'INR', 7
from public.menu_categories where slug = 'artisanal-signature-cocktails';

insert into public.menu_items (category_id, name, slug, description, ingredients, price, currency, sort_order)
select id, 'Twisted Bloody Mearii', 'twisted-bloody-mearii', 'Vodka, Tomato Juice, Worcestershire Sauce, Black Pepper, Salt, Tobasco Sauce, Lime Juice, Celery.', array['vodka','tomato juice','worcestershire sauce','black pepper','salt','tobasco sauce','lime juice','celery'], 799, 'INR', 8
from public.menu_categories where slug = 'artisanal-signature-cocktails';

insert into public.menu_items (category_id, name, slug, description, ingredients, price, currency, sort_order)
select id, 'El Gaijin', 'el-gaijin', 'Tequila, Grapefruit, Triple Sec, Lime Juice.', array['tequila','grapefruit','triple sec','lime juice'], 799, 'INR', 9
from public.menu_categories where slug = 'artisanal-signature-cocktails';

insert into public.gallery_images (title, alt, image_url, category, sort_order) values
  ('Main dining room', 'Main dining room at Miss Ginko', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600&q=80&auto=format&fit=crop', 'interior', 0),
  ('Chef plating', 'Chef plating a dish at the pass', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1600&q=80&auto=format&fit=crop', 'food', 1),
  ('Private room', 'Private dining room set for an event', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&q=80&auto=format&fit=crop', 'events', 2);

insert into public.event_packages (name, slug, description, capacity_min, capacity_max, price_from, includes, image_url, sort_order) values
  ('Intimate Celebration', 'intimate-celebration', 'A curated set menu for smaller private gatherings.', 8, 18, 150, array['5-course set menu','Wine pairing','Dedicated server'], 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600&q=80&auto=format&fit=crop', 0),
  ('Full Buyout', 'full-buyout', 'Exclusive use of the entire dining room.', 40, 80, 12000, array['Custom menu','Full bar','Event coordinator','AV setup'], 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&q=80&auto=format&fit=crop', 1);

insert into public.restaurant_capacity (area, time_slot, max_covers)
select area, time_slot, 24
from unnest(enum_range(null::booking_area)) as area,
     unnest(array['17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00']::time[]) as time_slot;
