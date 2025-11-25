-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.parents enable row level security;
alter table public.student_parents enable row level security;
alter table public.teachers enable row level security;
alter table public.attendance enable row level security;
alter table public.marks enable row level security;
alter table public.fee_payments enable row level security;
alter table public.announcements enable row level security;
alter table public.timetable enable row level security;
alter table public.school_settings enable row level security;
alter table public.gallery_images enable row level security;

-- Helper function to get user role
create or replace function public.get_user_role()
returns user_role
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (get_user_role() = 'admin');

create policy "Admins can insert profiles"
  on public.profiles for insert
  with check (get_user_role() = 'admin');

-- Students policies
create policy "Students can view their own data"
  on public.students for select
  using (user_id = auth.uid() or get_user_role() in ('admin', 'teacher'));

create policy "Parents can view their children"
  on public.students for select
  using (
    exists (
      select 1 from public.student_parents sp
      join public.parents p on p.id = sp.parent_id
      where sp.student_id = students.id
      and p.user_id = auth.uid()
    )
  );

create policy "Admins and teachers can manage students"
  on public.students for all
  using (get_user_role() in ('admin', 'teacher'))
  with check (get_user_role() in ('admin', 'teacher'));

-- Parents policies
create policy "Parents can view their own data"
  on public.parents for select
  using (user_id = auth.uid() or get_user_role() in ('admin', 'teacher'));

create policy "Admins can manage parents"
  on public.parents for all
  using (get_user_role() = 'admin')
  with check (get_user_role() = 'admin');

-- Student-Parents relationship policies
create policy "Users can view relevant relationships"
  on public.student_parents for select
  using (
    exists (
      select 1 from public.parents p
      where p.id = student_parents.parent_id
      and p.user_id = auth.uid()
    )
    or get_user_role() in ('admin', 'teacher')
  );

create policy "Admins can manage relationships"
  on public.student_parents for all
  using (get_user_role() = 'admin')
  with check (get_user_role() = 'admin');

-- Teachers policies
create policy "Everyone can view teachers"
  on public.teachers for select
  using (true);

create policy "Admins can manage teachers"
  on public.teachers for all
  using (get_user_role() = 'admin')
  with check (get_user_role() = 'admin');

-- Attendance policies
create policy "Students can view their own attendance"
  on public.attendance for select
  using (
    exists (
      select 1 from public.students s
      where s.id = attendance.student_id
      and s.user_id = auth.uid()
    )
    or get_user_role() in ('admin', 'teacher')
  );

create policy "Parents can view their children's attendance"
  on public.attendance for select
  using (
    exists (
      select 1 from public.student_parents sp
      join public.parents p on p.id = sp.parent_id
      where sp.student_id = attendance.student_id
      and p.user_id = auth.uid()
    )
  );

create policy "Admins and teachers can manage attendance"
  on public.attendance for all
  using (get_user_role() in ('admin', 'teacher'))
  with check (get_user_role() in ('admin', 'teacher'));

-- Marks policies
create policy "Students can view their own marks"
  on public.marks for select
  using (
    exists (
      select 1 from public.students s
      where s.id = marks.student_id
      and s.user_id = auth.uid()
    )
    or get_user_role() in ('admin', 'teacher')
  );

create policy "Parents can view their children's marks"
  on public.marks for select
  using (
    exists (
      select 1 from public.student_parents sp
      join public.parents p on p.id = sp.parent_id
      where sp.student_id = marks.student_id
      and p.user_id = auth.uid()
    )
  );

create policy "Admins and teachers can manage marks"
  on public.marks for all
  using (get_user_role() in ('admin', 'teacher'))
  with check (get_user_role() in ('admin', 'teacher'));

-- Fee payments policies
create policy "Students can view their own fee payments"
  on public.fee_payments for select
  using (
    exists (
      select 1 from public.students s
      where s.id = fee_payments.student_id
      and s.user_id = auth.uid()
    )
    or get_user_role() in ('admin', 'teacher')
  );

create policy "Parents can view their children's fee payments"
  on public.fee_payments for select
  using (
    exists (
      select 1 from public.student_parents sp
      join public.parents p on p.id = sp.parent_id
      where sp.student_id = fee_payments.student_id
      and p.user_id = auth.uid()
    )
  );

create policy "Admins can manage fee payments"
  on public.fee_payments for all
  using (get_user_role() = 'admin')
  with check (get_user_role() = 'admin');

-- Announcements policies
create policy "Published announcements are public"
  on public.announcements for select
  using (published = true);

create policy "Admins and teachers can manage announcements"
  on public.announcements for all
  using (get_user_role() in ('admin', 'teacher'))
  with check (get_user_role() in ('admin', 'teacher'));

-- Timetable policies
create policy "Everyone can view timetable"
  on public.timetable for select
  using (true);

create policy "Admins and teachers can manage timetable"
  on public.timetable for all
  using (get_user_role() in ('admin', 'teacher'))
  with check (get_user_role() in ('admin', 'teacher'));

-- School settings policies
create policy "Everyone can view school settings"
  on public.school_settings for select
  using (true);

create policy "Admins can manage school settings"
  on public.school_settings for all
  using (get_user_role() = 'admin')
  with check (get_user_role() = 'admin');

-- Gallery images policies
create policy "Everyone can view published gallery images"
  on public.gallery_images for select
  using (true);

create policy "Admins can manage gallery images"
  on public.gallery_images for all
  using (get_user_role() = 'admin')
  with check (get_user_role() = 'admin');
