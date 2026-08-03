-- Sample data for local development — `supabase db reset` picks this up automatically.

insert into public.menu_categories (name, slug, description, sort_order) values
  ('Snacks & Small Plates', 'snacks', 'Bright, sharable openers to begin the evening.', 0),
  ('Sashimi & Raw', 'sashimi', 'Line-caught, cut to order.', 1),
  ('Robata Grill', 'robata', 'Binchotan-fired over Japanese white charcoal.', 2),
  ('Mains', 'mains', 'The heart of the tasting menu, also available à la carte.', 3),
  ('Desserts', 'desserts', 'Light, precise, never an afterthought.', 4);

-- Image URLs below are temporary Unsplash stand-ins (matching
-- src/lib/stock-images.ts) — swap for real Cloudinary URLs when photography
-- is ready; no schema or app-code change needed, just update the value.

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, image_url, is_chef_recommendation, sort_order)
select id, 'Hokkaido Uni Toast', 'hokkaido-uni-toast', 'Sea urchin, brioche, yuzu kosho butter.', array['uni','brioche','yuzu','butter'], array['shellfish','gluten','dairy'], array[]::text[], 28, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1600&q=80&auto=format&fit=crop', true, 0
from public.menu_categories where slug = 'snacks';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, image_url, sort_order)
select id, 'Charcoal Grilled Wagyu', 'charcoal-grilled-wagyu', 'A5 Miyazaki wagyu, binchotan, ponzu.', array['wagyu','ponzu'], array['soy'], array[]::text[], 88, 'https://images.unsplash.com/photo-1558030006-450675393462?w=1600&q=80&auto=format&fit=crop', 0
from public.menu_categories where slug = 'robata';

insert into public.menu_items (category_id, name, slug, description, ingredients, allergens, dietary_tags, price, image_url, is_chef_recommendation, sort_order)
select id, 'Yuzu Kosho Black Cod', 'yuzu-kosho-black-cod', 'Miso-marinated black cod, yuzu kosho glaze.', array['black cod','miso','yuzu'], array['soy','fish'], array[]::text[], 56, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1600&q=80&auto=format&fit=crop', true, 0
from public.menu_categories where slug = 'mains';

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

insert into public.review_summaries (overall_rating_avg, total_reviews, atmosphere_summary, service_summary, food_summary, most_mentioned_dishes) values
  (4.8, 214, 'Guests consistently describe the room as intimate and quiet, praising the lighting and low noise level for conversation.', 'Service is frequently called attentive without being intrusive, with several mentions of staff remembering returning guests.', 'The wagyu and black cod are the most praised dishes; several reviews highlight the tasting menu as the best way to experience the kitchen.', '[{"name":"Charcoal Grilled Wagyu","mentions":58},{"name":"Yuzu Kosho Black Cod","mentions":41},{"name":"Hokkaido Uni Toast","mentions":33}]'::jsonb);
