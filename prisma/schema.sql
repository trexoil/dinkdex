-- DinkDex Database Schema

CREATE TABLE IF NOT EXISTS courts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Malaysia',
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  indoor BOOLEAN DEFAULT false,
  court_count INT DEFAULT 1,
  has_lights BOOLEAN DEFAULT false,
  surface_type VARCHAR(50),
  amenities JSONB DEFAULT '[]',
  phone VARCHAR(50),
  website VARCHAR(255),
  booking_url VARCHAR(255),
  photos JSONB DEFAULT '[]',
  hours JSONB DEFAULT '{}',
  description TEXT,
  is_claimed BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coaches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  certifications JSONB DEFAULT '[]',
  experience_years INT DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Malaysia',
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  photo VARCHAR(255),
  is_premium BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coach_courts (
  coach_id INT REFERENCES coaches(id) ON DELETE CASCADE,
  court_id INT REFERENCES courts(id) ON DELETE CASCADE,
  PRIMARY KEY (coach_id, court_id)
);

CREATE TABLE IF NOT EXISTS tournaments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  court_id INT REFERENCES courts(id),
  start_date DATE,
  end_date DATE,
  registration_url VARCHAR(255),
  description TEXT,
  is_promoted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  type VARCHAR(50) DEFAULT 'newsletter',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  listing_name VARCHAR(255),
  listing_address TEXT,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_courts_slug ON courts(slug);
CREATE INDEX IF NOT EXISTS idx_courts_city ON courts(city);
CREATE INDEX IF NOT EXISTS idx_courts_country ON courts(country);
CREATE INDEX IF NOT EXISTS idx_courts_premium ON courts(is_premium);
CREATE INDEX IF NOT EXISTS idx_coaches_slug ON coaches(slug);
CREATE INDEX IF NOT EXISTS idx_coaches_city ON coaches(city);
CREATE INDEX IF NOT EXISTS idx_coaches_premium ON coaches(is_premium);
CREATE INDEX IF NOT EXISTS idx_tournaments_slug ON tournaments(slug);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
