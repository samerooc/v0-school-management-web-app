-- ============================================
-- COMPREHENSIVE DEMO DATA FOR SCHOOL MANAGEMENT SYSTEM
-- ============================================

-- Insert demo students
INSERT INTO public.students (
  student_id, first_name, last_name, date_of_birth, gender, 
  class, section, roll_number, admission_date, 
  email, phone, address, guardian_name, guardian_phone, 
  guardian_email, blood_group, photo_url
) VALUES
  ('STU001', 'Rahul', 'Sharma', '2010-05-15', 'Male', '10', 'A', 1, '2020-04-01', 
   'rahul.sharma@student.greenwood.edu', '+91-9876543210', '123 MG Road, Delhi', 
   'Mr. Rajesh Sharma', '+91-9876543211', 'rajesh.sharma@email.com', 'O+', 
   '/placeholder.svg?height=100&width=100'),
   
  ('STU002', 'Priya', 'Patel', '2010-08-22', 'Female', '10', 'A', 2, '2020-04-01',
   'priya.patel@student.greenwood.edu', '+91-9876543220', '456 Park Street, Mumbai',
   'Mrs. Anjali Patel', '+91-9876543221', 'anjali.patel@email.com', 'A+',
   '/placeholder.svg?height=100&width=100'),
   
  ('STU003', 'Amit', 'Kumar', '2010-03-10', 'Male', '10', 'A', 3, '2020-04-01',
   'amit.kumar@student.greenwood.edu', '+91-9876543230', '789 Lake Road, Bangalore',
   'Mr. Suresh Kumar', '+91-9876543231', 'suresh.kumar@email.com', 'B+',
   '/placeholder.svg?height=100&width=100'),
   
  ('STU004', 'Sneha', 'Singh', '2010-11-05', 'Female', '10', 'A', 4, '2020-04-01',
   'sneha.singh@student.greenwood.edu', '+91-9876543240', '321 Hill View, Pune',
   'Mr. Vikram Singh', '+91-9876543241', 'vikram.singh@email.com', 'AB+',
   '/placeholder.svg?height=100&width=100'),
   
  ('STU005', 'Arjun', 'Reddy', '2011-01-20', 'Male', '9', 'A', 1, '2021-04-01',
   'arjun.reddy@student.greenwood.edu', '+91-9876543250', '654 Garden Street, Hyderabad',
   'Mrs. Lakshmi Reddy', '+91-9876543251', 'lakshmi.reddy@email.com', 'O-',
   '/placeholder.svg?height=100&width=100'),
   
  ('STU006', 'Ananya', 'Gupta', '2011-06-12', 'Female', '9', 'A', 2, '2021-04-01',
   'ananya.gupta@student.greenwood.edu', '+91-9876543260', '987 River Road, Kolkata',
   'Mr. Mahesh Gupta', '+91-9876543261', 'mahesh.gupta@email.com', 'A-',
   '/placeholder.svg?height=100&width=100'),
   
  ('STU007', 'Rohan', 'Verma', '2012-09-08', 'Male', '8', 'A', 1, '2022-04-01',
   'rohan.verma@student.greenwood.edu', '+91-9876543270', '147 Market Square, Chennai',
   'Mrs. Pooja Verma', '+91-9876543271', 'pooja.verma@email.com', 'B-',
   '/placeholder.svg?height=100&width=100'),
   
  ('STU008', 'Ishita', 'Joshi', '2012-12-25', 'Female', '8', 'A', 2, '2022-04-01',
   'ishita.joshi@student.greenwood.edu', '+91-9876543280', '258 Temple Road, Ahmedabad',
   'Mr. Anil Joshi', '+91-9876543281', 'anil.joshi@email.com', 'AB-',
   '/placeholder.svg?height=100&width=100')
ON CONFLICT (student_id) DO NOTHING;

-- Insert demo teachers
INSERT INTO public.teachers (
  teacher_id, first_name, last_name, email, phone, 
  subject, qualification, joining_date, address
) VALUES
  ('TCH001', 'Dr. Suresh', 'Menon', 'suresh.menon@greenwood.edu', '+91-9876501001',
   'Mathematics', 'Ph.D in Mathematics', '2015-06-01', '45 Academic Lane, Delhi'),
   
  ('TCH002', 'Mrs. Kavita', 'Desai', 'kavita.desai@greenwood.edu', '+91-9876501002',
   'English', 'M.A in English Literature', '2016-07-15', '78 Book Street, Mumbai'),
   
  ('TCH003', 'Mr. Rajesh', 'Nair', 'rajesh.nair@greenwood.edu', '+91-9876501003',
   'Science', 'M.Sc in Physics', '2017-08-01', '92 Science Park, Bangalore'),
   
  ('TCH004', 'Ms. Priyanka', 'Chopra', 'priyanka.chopra@greenwood.edu', '+91-9876501004',
   'Social Studies', 'M.A in History', '2018-05-20', '134 Heritage Road, Pune'),
   
  ('TCH005', 'Mr. Deepak', 'Shah', 'deepak.shah@greenwood.edu', '+91-9876501005',
   'Computer Science', 'M.Tech in CS', '2019-06-10', '267 Tech Valley, Hyderabad')
ON CONFLICT (teacher_id) DO NOTHING;

-- Insert demo parents (linked to students)
INSERT INTO public.parents (
  first_name, last_name, email, phone, address, relationship
) VALUES
  ('Rajesh', 'Sharma', 'rajesh.sharma@email.com', '+91-9876543211', '123 MG Road, Delhi', 'Father'),
  ('Anjali', 'Patel', 'anjali.patel@email.com', '+91-9876543221', '456 Park Street, Mumbai', 'Mother'),
  ('Suresh', 'Kumar', 'suresh.kumar@email.com', '+91-9876543231', '789 Lake Road, Bangalore', 'Father'),
  ('Vikram', 'Singh', 'vikram.singh@email.com', '+91-9876543241', '321 Hill View, Pune', 'Father'),
  ('Lakshmi', 'Reddy', 'lakshmi.reddy@email.com', '+91-9876543251', '654 Garden Street, Hyderabad', 'Mother'),
  ('Mahesh', 'Gupta', 'mahesh.gupta@email.com', '+91-9876543261', '987 River Road, Kolkata', 'Father'),
  ('Pooja', 'Verma', 'pooja.verma@email.com', '+91-9876543271', '147 Market Square, Chennai', 'Mother'),
  ('Anil', 'Joshi', 'anil.joshi@email.com', '+91-9876543281', '258 Temple Road, Ahmedabad', 'Father')
ON CONFLICT (email) DO NOTHING;

-- Link parents to students
INSERT INTO public.student_parents (student_id, parent_id)
SELECT s.id, p.id FROM public.students s, public.parents p
WHERE (s.student_id = 'STU001' AND p.email = 'rajesh.sharma@email.com')
   OR (s.student_id = 'STU002' AND p.email = 'anjali.patel@email.com')
   OR (s.student_id = 'STU003' AND p.email = 'suresh.kumar@email.com')
   OR (s.student_id = 'STU004' AND p.email = 'vikram.singh@email.com')
   OR (s.student_id = 'STU005' AND p.email = 'lakshmi.reddy@email.com')
   OR (s.student_id = 'STU006' AND p.email = 'mahesh.gupta@email.com')
   OR (s.student_id = 'STU007' AND p.email = 'pooja.verma@email.com')
   OR (s.student_id = 'STU008' AND p.email = 'anil.joshi@email.com')
ON CONFLICT DO NOTHING;

-- Insert attendance records (last 30 days for all students)
INSERT INTO public.attendance (student_id, date, status, marked_by, remarks)
SELECT 
  s.id,
  date_series::date,
  CASE 
    WHEN random() < 0.85 THEN 'present'
    WHEN random() < 0.95 THEN 'absent'
    ELSE 'late'
  END,
  (SELECT id FROM public.teachers LIMIT 1),
  CASE 
    WHEN random() < 0.1 THEN 'Medical leave'
    ELSE NULL
  END
FROM 
  public.students s,
  generate_series(
    current_date - interval '30 days',
    current_date - interval '1 day',
    interval '1 day'
  ) AS date_series
WHERE 
  EXTRACT(DOW FROM date_series) NOT IN (0, 6) -- Exclude weekends
ON CONFLICT (student_id, date) DO NOTHING;

-- Insert marks for students
INSERT INTO public.marks (student_id, subject, exam_type, marks_obtained, total_marks, exam_date, remarks)
SELECT 
  s.id,
  subject,
  'Mid Term',
  marks_obtained,
  100,
  current_date - interval '60 days',
  CASE WHEN marks_obtained >= 90 THEN 'Excellent' 
       WHEN marks_obtained >= 75 THEN 'Very Good'
       WHEN marks_obtained >= 60 THEN 'Good'
       ELSE 'Needs Improvement'
  END
FROM public.students s
CROSS JOIN (
  SELECT 'Mathematics' as subject, (75 + random() * 20)::int as marks_obtained
  UNION ALL SELECT 'English', (70 + random() * 25)::int
  UNION ALL SELECT 'Science', (65 + random() * 30)::int
  UNION ALL SELECT 'Social Studies', (70 + random() * 25)::int
  UNION ALL SELECT 'Computer Science', (75 + random() * 20)::int
  UNION ALL SELECT 'Hindi', (65 + random() * 30)::int
) subjects
WHERE s.student_id IN ('STU001', 'STU002', 'STU003', 'STU004', 'STU005', 'STU006', 'STU007', 'STU008')
ON CONFLICT DO NOTHING;

-- Insert fee payments
INSERT INTO public.fee_payments (
  student_id, amount, payment_date, payment_method, 
  transaction_id, fee_type, status, academic_year, term
)
SELECT 
  s.id,
  CASE 
    WHEN s.class IN ('8', '9') THEN 15000
    WHEN s.class = '10' THEN 18000
    ELSE 12000
  END,
  payment_date,
  payment_method,
  'TXN' || to_char(payment_date, 'YYYYMMDD') || lpad((random() * 10000)::int::text, 5, '0'),
  fee_type,
  CASE WHEN payment_date <= current_date THEN 'paid' ELSE 'pending' END,
  '2024-25',
  term
FROM public.students s
CROSS JOIN (
  SELECT (current_date - interval '90 days')::date as payment_date, 'Tuition Fee' as fee_type, 'Term 1' as term, 'Online Banking' as payment_method
  UNION ALL SELECT (current_date - interval '60 days')::date, 'Examination Fee', 'Term 1', 'UPI'
  UNION ALL SELECT (current_date + interval '30 days')::date, 'Tuition Fee', 'Term 2', 'Pending'
) payments
ON CONFLICT DO NOTHING;

-- Insert timetable
INSERT INTO public.timetable (class, section, day_of_week, period, subject, teacher_id, start_time, end_time, room_number)
SELECT 
  '10',
  'A',
  day,
  period,
  subject,
  (SELECT id FROM public.teachers WHERE teachers.subject = tt.subject LIMIT 1),
  start_time,
  end_time,
  'Room ' || (100 + period)::text
FROM (
  -- Monday
  SELECT 'Monday' as day, 1 as period, 'Mathematics' as subject, '08:00'::time as start_time, '09:00'::time as end_time
  UNION ALL SELECT 'Monday', 2, 'English', '09:00'::time, '10:00'::time
  UNION ALL SELECT 'Monday', 3, 'Science', '10:15'::time, '11:15'::time
  UNION ALL SELECT 'Monday', 4, 'Social Studies', '11:15'::time, '12:15'::time
  UNION ALL SELECT 'Monday', 5, 'Computer Science', '13:00'::time, '14:00'::time
  
  -- Tuesday
  UNION ALL SELECT 'Tuesday', 1, 'Science', '08:00'::time, '09:00'::time
  UNION ALL SELECT 'Tuesday', 2, 'Mathematics', '09:00'::time, '10:00'::time
  UNION ALL SELECT 'Tuesday', 3, 'English', '10:15'::time, '11:15'::time
  UNION ALL SELECT 'Tuesday', 4, 'Computer Science', '11:15'::time, '12:15'::time
  UNION ALL SELECT 'Tuesday', 5, 'Social Studies', '13:00'::time, '14:00'::time
  
  -- Wednesday
  UNION ALL SELECT 'Wednesday', 1, 'English', '08:00'::time, '09:00'::time
  UNION ALL SELECT 'Wednesday', 2, 'Science', '09:00'::time, '10:00'::time
  UNION ALL SELECT 'Wednesday', 3, 'Mathematics', '10:15'::time, '11:15'::time
  UNION ALL SELECT 'Wednesday', 4, 'Social Studies', '11:15'::time, '12:15'::time
  UNION ALL SELECT 'Wednesday', 5, 'Computer Science', '13:00'::time, '14:00'::time
  
  -- Thursday
  UNION ALL SELECT 'Thursday', 1, 'Mathematics', '08:00'::time, '09:00'::time
  UNION ALL SELECT 'Thursday', 2, 'Computer Science', '09:00'::time, '10:00'::time
  UNION ALL SELECT 'Thursday', 3, 'Science', '10:15'::time, '11:15'::time
  UNION ALL SELECT 'Thursday', 4, 'English', '11:15'::time, '12:15'::time
  UNION ALL SELECT 'Thursday', 5, 'Social Studies', '13:00'::time, '14:00'::time
  
  -- Friday
  UNION ALL SELECT 'Friday', 1, 'Social Studies', '08:00'::time, '09:00'::time
  UNION ALL SELECT 'Friday', 2, 'Mathematics', '09:00'::time, '10:00'::time
  UNION ALL SELECT 'Friday', 3, 'English', '10:15'::time, '11:15'::time
  UNION ALL SELECT 'Friday', 4, 'Science', '11:15'::time, '12:15'::time
  UNION ALL SELECT 'Friday', 5, 'Computer Science', '13:00'::time, '14:00'::time
) tt
ON CONFLICT (class, section, day_of_week, period) DO NOTHING;

-- Insert more announcements with varied content
INSERT INTO public.announcements (title, content, target_audience, priority, published, publish_date) VALUES
  (
    'Library Book Fair - This Weekend',
    'A special book fair will be organized in the school library this weekend. Students and parents are welcome to explore and purchase books at discounted prices.',
    ARRAY['students', 'parents'],
    'medium',
    true,
    current_date - interval '5 days'
  ),
  (
    'Science Exhibition - February 2024',
    'Students are encouraged to participate in the upcoming Science Exhibition. Registration deadline is January 31st, 2024. Contact the Science department for more details.',
    ARRAY['students', 'teachers'],
    'high',
    true,
    current_date - interval '3 days'
  ),
  (
    'Winter Break Holiday Notice',
    'School will remain closed from December 25th to January 5th for winter break. Classes will resume on January 6th, 2024.',
    ARRAY['all'],
    'high',
    true,
    current_date - interval '45 days'
  ),
  (
    'Career Counseling Sessions',
    'Career counseling sessions for Class 10 students will be conducted next week. Individual slots will be shared via email.',
    ARRAY['students', 'parents'],
    'medium',
    true,
    current_date - interval '2 days'
  ),
  (
    'Annual Day Celebration - Save the Date',
    'Our Annual Day celebration is scheduled for March 15th, 2024. Students will showcase their talents through cultural performances. More details to follow.',
    ARRAY['all'],
    'high',
    true,
    current_date - interval '1 day'
  )
ON CONFLICT DO NOTHING;

-- Insert gallery images
INSERT INTO public.gallery_images (title, description, image_url, category, display_order) VALUES
  ('School Main Building', 'Our modern school building with state-of-the-art facilities', '/placeholder.svg?height=400&width=600', 'Campus', 1),
  ('Science Laboratory', 'Well-equipped science lab for practical learning', '/placeholder.svg?height=400&width=600', 'Facilities', 2),
  ('Computer Lab', 'Latest computer lab with high-speed internet', '/placeholder.svg?height=400&width=600', 'Facilities', 3),
  ('Sports Ground', 'Spacious sports ground for outdoor activities', '/placeholder.svg?height=400&width=600', 'Campus', 4),
  ('Library', 'Extensive library with thousands of books', '/placeholder.svg?height=400&width=600', 'Facilities', 5),
  ('Annual Day 2023', 'Memorable moments from our Annual Day celebration', '/placeholder.svg?height=400&width=600', 'Events', 6),
  ('Science Exhibition', 'Students presenting their innovative projects', '/placeholder.svg?height=400&width=600', 'Events', 7),
  ('Basketball Court', 'Indoor basketball court for sports enthusiasts', '/placeholder.svg?height=400&width=600', 'Sports', 8)
ON CONFLICT DO NOTHING;

-- Update school settings with complete information
INSERT INTO public.school_settings (key, value) VALUES
  ('school_name', '"Greenwood International School"'::jsonb),
  ('school_tagline', '"Nurturing Excellence, Building Future Leaders"'::jsonb),
  ('school_logo', '"/placeholder.svg?height=80&width=80"'::jsonb),
  ('about_us', '"Greenwood International School is a premier educational institution committed to providing world-class education. Established in 2005, we have been at the forefront of academic excellence, character development, and holistic growth. Our dedicated faculty, modern infrastructure, and student-centric approach make us the preferred choice for quality education. We believe in nurturing young minds to become responsible global citizens equipped with knowledge, skills, and values to excel in life."'::jsonb),
  ('contact_email', '"info@greenwood.edu"'::jsonb),
  ('contact_phone', '"+91-11-2345-6789"'::jsonb),
  ('contact_address', '"Sector 21, Knowledge Park, New Delhi - 110001, India"'::jsonb),
  ('theme_color', '"#2563eb"'::jsonb),
  ('principal_name', '"Dr. Meera Sharma"'::jsonb),
  ('established_year', '"2005"'::jsonb),
  ('total_students', '"1200+"'::jsonb),
  ('faculty_count', '"85+"'::jsonb),
  ('campus_area', '"15 Acres"'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
