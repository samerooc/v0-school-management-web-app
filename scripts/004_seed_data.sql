-- Insert default school settings
insert into public.school_settings (key, value) values
  ('school_name', '"Greenwood International School"'::jsonb),
  ('school_tagline', '"Excellence in Education"'::jsonb),
  ('school_logo', '"https://placeholder.svg?height=80&width=80&query=school+logo"'::jsonb),
  ('about_us', '"Welcome to Greenwood International School, where we nurture young minds and foster excellence in education. Our commitment is to provide a holistic learning environment that prepares students for success."'::jsonb),
  ('contact_email', '"info@greenwood.edu"'::jsonb),
  ('contact_phone', '"+1 (555) 123-4567"'::jsonb),
  ('contact_address', '"123 Education Lane, Knowledge City, ST 12345"'::jsonb),
  ('theme_color', '"#2563eb"'::jsonb)
on conflict (key) do nothing;

-- Insert sample announcements
insert into public.announcements (title, content, target_audience, priority, published, publish_date) values
  (
    'Welcome to New Academic Year 2024-25',
    'We are excited to welcome all students and parents to the new academic year. Classes begin on January 15th, 2024.',
    ARRAY['all'],
    'high',
    true,
    now()
  ),
  (
    'Parent-Teacher Meeting Schedule',
    'Parent-teacher meetings are scheduled for February 10-12, 2024. Please check your individual schedules.',
    ARRAY['parents', 'teachers'],
    'medium',
    true,
    now()
  ),
  (
    'Annual Sports Day',
    'Annual Sports Day will be held on March 20th, 2024. All students are encouraged to participate.',
    ARRAY['students', 'parents'],
    'medium',
    true,
    now()
  )
on conflict do nothing;
