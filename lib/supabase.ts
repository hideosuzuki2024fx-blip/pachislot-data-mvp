// 🔧 added: Supabaseクライアントの初期化

import { createClient } from '@supabase/supabase-js'

// 環境変数からキーを取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// URLまたはキーが設定されていない場合はエラーを投げる
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing.')
}

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
