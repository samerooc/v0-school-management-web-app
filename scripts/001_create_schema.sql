-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create roles enum
create type user_role as enum ('admin', 'teacher', 'parent', 'student');

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role user_role not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Students table
create table if not exists public.students (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  student_id text unique not null,
  full_name text not null,
  class text not null,
  section text,
  roll_number text not null,
  date_of_birth date,
  gender text,
  blood_group text,
  address text,
  phone text,
  photo_url text,
  admission_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Parents table
create table if not exists public.parents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  relation text,
  occupation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student-Parent relationship table
create table if not exists public.student_parents (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.students(id) on delete cascade not null,
  parent_id uuid references public.parents(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, parent_id)
);

-- Teachers table
create table if not exists public.teachers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  qualification text,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Attendance table
create table if not exists public.attendance (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.students(id) on delete cascade not null,
  date date not null,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  marked_by uuid references auth.users(id),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, date)
);

-- Marks/Grades table
create table if not exists public.marks (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.students(id) on delete cascade not null,
  subject text not null,
  exam_name text not null,
  exam_date date,
  marks_obtained numeric not null,
  total_marks numeric not null,
  grade text,
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Fee payments table
create table if not exists public.fee_payments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references public.students(id) on delete cascade not null,
  amount numeric not null,
  payment_date date not null,
  payment_method text,
  transaction_id text,
  fee_type text not null,
  academic_year text,
  status text not null check (status in ('paid', 'pending', 'overdue', 'partial')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Announcements table
create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text not null,
  author_id uuid references auth.users(id) on delete set null,
  target_audience text[] not null, -- ['all', 'students', 'parents', 'teachers']
  priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
  published boolean default false,
  publish_date timestamp with time zone,
  expiry_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Timetable table
create table if not exists public.timetable (
  id uuid primary key default uuid_generate_v4(),
  class text not null,
  section text,
  day_of_week integer not null check (day_of_week between 0 and 6), -- 0=Sunday, 6=Saturday
  period_number integer not null,
  subject text not null,
  teacher_id uuid references public.teachers(id) on delete set null,
  start_time time not null,
  end_time time not null,
  room_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- School settings table (for website content management)
create table if not exists public.school_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value jsonb not null,
  updated_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gallery images table
create table if not exists public.gallery_images (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  image_url text not null,
  category text,
  display_order integer default 0,
  uploaded_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index if not exists idx_students_class on public.students(class);
create index if not exists idx_students_user_id on public.students(user_id);
create index if not exists idx_attendance_student_date on public.attendance(student_id, date);
create index if not exists idx_marks_student on public.marks(student_id);
create index if not exists idx_fee_payments_student on public.fee_payments(student_id);
create index if not exists idx_announcements_published on public.announcements(published);
create index if not exists idx_timetable_class on public.timetable(class, day_of_week);
