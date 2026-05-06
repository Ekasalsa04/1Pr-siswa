'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import TaskCard from '@/components/TaskCard'
import { supabase, Task } from '@/lib/supabaseClient'

type Filter = 'all' | 'done' | 'pending'

export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Cek apakah user sudah login
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/login')
      else fetchTasks()
    })
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    // Ambil semua task milik user, urutkan deadline terdekat
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('deadline', { ascending: true })

    if (error) setError(error.message)
    else setTasks(data ?? [])
    setLoading(false)
  }

  // Hapus task
  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus PR ini?')) return
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks(prev => prev.filter(t => t.id !== id))
  }

  // Toggle status selesai / belum
  const handleToggle = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: !current })
      .eq('id', id)
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, status: !current } : t))
  }

  // Filter tasks berdasarkan pilihan
  const filtered = tasks.filter(t => {
    if (filter === 'done') return t.status === true
    if (filter === 'pending') return t.status === false
    return true
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard PR</h1>
        <p className="text-sm text-gray-500 mb-6">Semua tugas kamu, diurutkan berdasarkan deadline terdekat.</p>

        {/* Tombol filter */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'done'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'done' ? '✅ Selesai' : '⏳ Belum Selesai'}
            </button>
          ))}
        </div>

        {/* Konten */}
        {loading && <p className="text-gray-400 text-sm">Memuat PR...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm">Belum ada PR. Tambah sekarang!</p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </main>
    </>
  )
}
