-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Add triggers for updated_at
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_students_updated_at before update on public.students
  for each row execute function public.handle_updated_at();

create trigger set_parents_updated_at before update on public.parents
  for each row execute function public.handle_updated_at();

create trigger set_teachers_updated_at before update on public.teachers
  for each row execute function public.handle_updated_at();

create trigger set_attendance_updated_at before update on public.attendance
  for each row execute function public.handle_updated_at();

create trigger set_marks_updated_at before update on public.marks
  for each row execute function public.handle_updated_at();

create trigger set_fee_payments_updated_at before update on public.fee_payments
  for each row execute function public.handle_updated_at();

create trigger set_announcements_updated_at before update on public.announcements
  for each row execute function public.handle_updated_at();

create trigger set_timetable_updated_at before update on public.timetable
  for each row execute function public.handle_updated_at();

create trigger set_school_settings_updated_at before update on public.school_settings
  for each row execute function public.handle_updated_at();

create trigger set_gallery_images_updated_at before update on public.gallery_images
  for each row execute function public.handle_updated_at();

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student')
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$;

-- Trigger to create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
