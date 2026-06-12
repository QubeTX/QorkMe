-- Sync reserved_words with the canonical in-app list (lib/shortcode/reserved.ts).
-- The DB table backs the availability check inside get_or_create_short_url;
-- the app list is authoritative — keep both in lockstep when editing either.

INSERT INTO reserved_words (word) VALUES
  -- System routes
  ('api'), ('app'), ('admin'), ('auth'), ('callback'), ('dashboard'),
  ('login'), ('logout'), ('register'), ('signup'), ('signin'),
  -- Pages
  ('about'), ('contact'), ('help'), ('support'), ('terms'), ('privacy'),
  ('policy'), ('settings'), ('profile'), ('account'), ('home'),
  -- Features
  ('result'), ('results'), ('analytics'), ('stats'), ('statistics'),
  ('qr'), ('qrcode'), ('export'), ('import'), ('bulk'), ('batch'),
  -- HTTP status codes
  ('404'), ('500'), ('403'), ('401'),
  -- File extensions
  ('css'), ('js'), ('json'), ('xml'), ('html'), ('txt'), ('pdf'),
  -- Common tech terms
  ('test'), ('demo'), ('example'), ('sample'), ('docs'), ('documentation'), ('guide'),
  -- Brand protection
  ('qork'), ('qorkme'), ('geeksquad'), ('geek'),
  -- Security
  ('hack'), ('hacked'), ('security'), ('exploit'),
  -- Miscellaneous
  ('undefined'), ('null'), ('void'), ('new'), ('delete'), ('edit'),
  ('update'), ('create'), ('list'), ('view'), ('show')
ON CONFLICT (word) DO NOTHING;
