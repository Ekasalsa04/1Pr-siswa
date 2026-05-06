// Inisialisasi Supabase client — dipakai di seluruh aplikasi
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipe data untuk tabel tasks
export type Task = {
  id: string
  title: string
  subject: string
  description: string
  deadline: string
  status: boolean
  user_id: string
}
