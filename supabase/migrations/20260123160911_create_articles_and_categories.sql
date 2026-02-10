/*
  # Create Articles and Categories Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Category name
      - `slug` (text, unique) - URL-friendly slug
      - `created_at` (timestamptz) - Creation timestamp
    
    - `articles`
      - `id` (uuid, primary key)
      - `title` (text) - Article title
      - `slug` (text, unique) - URL-friendly slug
      - `excerpt` (text) - Short description
      - `content` (text) - Full article content
      - `image_url` (text) - Featured image URL
      - `author` (text) - Author name
      - `category_id` (uuid, foreign key) - Reference to categories
      - `published_date` (timestamptz) - Publication date
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Add public read access policies (articles are public content)
    - Restrict write access to authenticated users only
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  image_url text,
  author text NOT NULL DEFAULT 'Admin',
  category_id uuid REFERENCES categories(id),
  published_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read articles"
  ON articles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_date ON articles(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);