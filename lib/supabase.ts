import { createClient } from '@supabase/supabase-js';

// Access import.meta.env safely to avoid crashes if it is undefined
const env = (import.meta as any).env || {};

// Tenta pegar as variáveis de ambiente, com fallback direto para as chaves fornecidas
const supabaseUrl = env.VITE_SUPABASE_URL || "https://fvctcyzarfibmydqkzfy.supabase.co";
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || "sb_publishable_zVLafFl_4QidVvUJtrPwUw_7S5SpmoN";

// Só cria o cliente se as chaves existirem, senão retorna null
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * ====================================================================
 * SCRIPT SQL ATUALIZADO (RODE ISSO NO SUPABASE SQL EDITOR)
 * ====================================================================

-- 1. TABELA DE PERFIS
CREATE TABLE IF NOT EXISTS profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cep text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS terms_accepted boolean default false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preference text;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
    CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
    CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
END $$;

-- 2. TABELA DE ACESSOS
CREATE TABLE IF NOT EXISTS user_access (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  access_type text not null,
  item_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

ALTER TABLE user_access ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own access" ON user_access;
    CREATE POLICY "Users can view own access" ON user_access FOR SELECT TO authenticated USING (auth.jwt() ->> 'email' = user_email);

    DROP POLICY IF EXISTS "Users can insert own access" ON user_access;
    CREATE POLICY "Users can insert own access" ON user_access FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'email' = user_email);
END $$;

-- 3. TABELA DE CHAT GERAL (Lounge)
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  user_email text not null,
  user_name text,
  user_avatar text,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can read messages" ON chat_messages;
    CREATE POLICY "Authenticated users can read messages" ON chat_messages FOR SELECT TO authenticated USING (true);

    DROP POLICY IF EXISTS "Authenticated users can insert messages" ON chat_messages;
    CREATE POLICY "Authenticated users can insert messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'email' = user_email);
END $$;

-- 4. TABELA DE FEED (Social)
CREATE TABLE IF NOT EXISTS social_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  user_name text,
  user_avatar text,
  image_url text, -- Base64 ou URL
  caption text,
  likes_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can read posts" ON social_posts;
    CREATE POLICY "Authenticated users can read posts" ON social_posts FOR SELECT TO authenticated USING (true);

    DROP POLICY IF EXISTS "Authenticated users can insert posts" ON social_posts;
    CREATE POLICY "Authenticated users can insert posts" ON social_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
END $$;

-- 5. TABELA DE MENSAGENS PRIVADAS (Direct)
CREATE TABLE IF NOT EXISTS private_messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references auth.users,
  receiver_id uuid references auth.users,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can read their own messages" ON private_messages;
    CREATE POLICY "Users can read their own messages" ON private_messages FOR SELECT TO authenticated 
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

    DROP POLICY IF EXISTS "Users can send messages" ON private_messages;
    CREATE POLICY "Users can send messages" ON private_messages FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = sender_id);
END $$;

-- Habilitar Realtime para todas as tabelas de comunicação
DO $$ 
BEGIN 
  ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages; 
  ALTER PUBLICATION supabase_realtime ADD TABLE social_posts;
  ALTER PUBLICATION supabase_realtime ADD TABLE private_messages;
EXCEPTION 
  WHEN duplicate_object THEN NULL; 
END $$;

 */