-- ============================================================================
-- Catalyst · 0002 — user ownership + the learning loop
-- Run once in the Supabase SQL editor, after 0001.
-- ============================================================================

-- 1 · Tie analyses to users (nullable: anonymous runs stay legal)
alter table public.catalyst_analyses
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists catalyst_analyses_user_id_idx
  on public.catalyst_analyses (user_id, created_at desc)
  where user_id is not null;

-- Users may read THEIR OWN analyses (writes remain service-role only)
drop policy if exists "own analyses readable" on public.catalyst_analyses;
create policy "own analyses readable"
  on public.catalyst_analyses for select
  to authenticated
  using (auth.uid() = user_id);

-- 2 · THE LEARNING LOOP — which hypotheses were actually tested, and won?
-- This table is the company's proprietary intelligence. Every row makes
-- future strategies smarter and the product harder to copy.
create table if not exists public.catalyst_outcomes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  analysis_id uuid not null references public.catalyst_analyses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  hypothesis_title text not null,
  status text not null check (status in ('tested', 'won', 'lost')),
  note text,
  unique (analysis_id, user_id, hypothesis_title)
);

comment on table public.catalyst_outcomes is
  'Real-world test outcomes per hypothesis — the proprietary learning-loop data.';

create index if not exists catalyst_outcomes_user_idx
  on public.catalyst_outcomes (user_id, created_at desc);

alter table public.catalyst_outcomes enable row level security;

drop policy if exists "own outcomes readable" on public.catalyst_outcomes;
create policy "own outcomes readable"
  on public.catalyst_outcomes for select
  to authenticated using (auth.uid() = user_id);

drop policy if exists "own outcomes writable" on public.catalyst_outcomes;
create policy "own outcomes writable"
  on public.catalyst_outcomes for insert
  to authenticated with check (auth.uid() = user_id);

drop policy if exists "own outcomes updatable" on public.catalyst_outcomes;
create policy "own outcomes updatable"
  on public.catalyst_outcomes for update
  to authenticated using (auth.uid() = user_id);
