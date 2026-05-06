-- Jalankan SQL ini di Supabase SQL Editor

-- 1. Buat tabel tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  description text,
  deadline date not null,
  status boolean default false,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default now()
);

-- 2. Aktifkan Row Level Security
alter table tasks enable row level security;

-- 3. Policy: user hanya bisa lihat task miliknya sendiri
create policy "User can view own tasks"
  on tasks for select
  using (auth.uid() = user_id);

-- 4. Policy: user hanya bisa insert task untuk dirinya sendiri
create policy "User can insert own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

-- 5. Policy: user hanya bisa update task miliknya sendiri
create policy "User can update own tasks"
  on tasks for update
  using (auth.uid() = user_id);

-- 6. Policy: user hanya bisa delete task miliknya sendiri
create policy "User can delete own tasks"
  on tasks for delete
  using (auth.uid() = user_id);
