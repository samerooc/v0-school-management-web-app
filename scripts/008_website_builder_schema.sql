-- Website Builder Schema - Theme settings, custom links, events, templates
-- Run this script to add website customization capabilities

-- Website theme settings table
CREATE TABLE IF NOT EXISTS website_themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  primary_color VARCHAR(20) DEFAULT '#1e40af',
  secondary_color VARCHAR(20) DEFAULT '#3b82f6',
  accent_color VARCHAR(20) DEFAULT '#f59e0b',
  background_color VARCHAR(20) DEFAULT '#ffffff',
  text_color VARCHAR(20) DEFAULT '#1f2937',
  header_bg_color VARCHAR(20) DEFAULT '#1e40af',
  footer_bg_color VARCHAR(20) DEFAULT '#1f2937',
  font_family VARCHAR(100) DEFAULT 'Inter',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom navigation links
CREATE TABLE IF NOT EXISTS custom_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  link_type VARCHAR(50) DEFAULT 'navigation', -- navigation, footer, quick_link
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  open_in_new_tab BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  end_date DATE,
  end_time TIME,
  location VARCHAR(255),
  event_type VARCHAR(50) DEFAULT 'general', -- general, academic, sports, cultural, holiday
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage sections configuration
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key VARCHAR(50) UNIQUE NOT NULL, -- hero, about, features, gallery, announcements, events, contact
  section_title VARCHAR(255),
  section_subtitle TEXT,
  is_visible BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  custom_content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom buttons for homepage
CREATE TABLE IF NOT EXISTS custom_buttons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  button_text VARCHAR(100) NOT NULL,
  button_url VARCHAR(500) NOT NULL,
  button_style VARCHAR(50) DEFAULT 'primary', -- primary, secondary, outline
  section VARCHAR(50) DEFAULT 'hero', -- hero, about, contact
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment reminders/notifications
CREATE TABLE IF NOT EXISTS payment_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  fee_payment_id UUID REFERENCES fee_payments(id) ON DELETE CASCADE,
  reminder_date DATE NOT NULL,
  reminder_type VARCHAR(50) DEFAULT 'pending', -- pending, overdue, final_notice
  message TEXT,
  is_sent BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default theme
INSERT INTO website_themes (name, is_active) VALUES ('Default Blue', true)
ON CONFLICT DO NOTHING;

-- Insert default homepage sections
INSERT INTO homepage_sections (section_key, section_title, section_subtitle, display_order, is_visible) VALUES
('hero', 'Welcome to Our School', 'Empowering minds, shaping futures', 1, true),
('about', 'About Our School', 'Learn about our mission and values', 2, true),
('features', 'Why Choose Us', 'Discover what makes us special', 3, true),
('gallery', 'Campus Gallery', 'Explore our beautiful campus', 4, true),
('events', 'Upcoming Events', 'Stay updated with school activities', 5, true),
('announcements', 'Latest News', 'Important announcements and updates', 6, true),
('contact', 'Contact Us', 'Get in touch with us', 7, true)
ON CONFLICT (section_key) DO NOTHING;

-- Enable RLS
ALTER TABLE website_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_buttons ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read, Admin write
CREATE POLICY "Public can view active themes" ON website_themes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage themes" ON website_themes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can view active links" ON custom_links FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage links" ON custom_links FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can view active events" ON events FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can view sections" ON homepage_sections FOR SELECT USING (true);
CREATE POLICY "Admins can manage sections" ON homepage_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can view active buttons" ON custom_buttons FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage buttons" ON custom_buttons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view own reminders" ON payment_reminders FOR SELECT USING (
  student_id IN (SELECT id FROM students WHERE user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
CREATE POLICY "Admins can manage reminders" ON payment_reminders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
