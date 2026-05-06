'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function Navbar() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    // Ambil session user saat ini
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg">📚 PR Tracker</Link>
      <div className="flex items-center gap-4">
        {email && <span className="text-sm opacity-80">{email}</span>}
        <Link href="/add" className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50">
          + Tambah PR
        </Link>
        <button
          onClick={handleLogout}
          className="bg-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-800"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
