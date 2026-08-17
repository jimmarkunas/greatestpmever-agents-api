create table if not exists assessments (
  assessment_id text primary key,
  campaign text,
  agent_name text,
  agent_description text,
  result text not null check (result in ('GO', 'GO_WITH_CONDITIONS', 'NO_GO')),
  authority text not null check (authority in ('DEFINED', 'PARTIAL', 'UNCLEAR')),
  guardrails text not null check (guardrails in ('DEFINED', 'PARTIAL', 'UNCLEAR')),
  evidence text not null check (evidence in ('DEFINED', 'PARTIAL', 'UNCLEAR')),
  network text not null check (network in ('DEFINED', 'PARTIAL', 'UNCLEAR')),
  transfer text not null check (transfer in ('DEFINED', 'PARTIAL', 'UNCLEAR')),
  success text not null check (success in ('DEFINED', 'PARTIAL', 'UNCLEAR')),
  created_at timestamptz not null default now()
);
