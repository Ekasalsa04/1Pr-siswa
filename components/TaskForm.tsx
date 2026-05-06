'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, Task } from '@/lib/supabaseClient'

type Props = {
  // Jika ada initialData, berarti mode edit
  initialData?: Task
}

export default function TaskForm({ initialData }: Props) {
  const router = useRouter()
  const isEdit = !!initialData

  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    subject: initialData?.subject ?? '',
    description: initialData?.description ?? '',
    deadline: initialData?.deadline ?? '',
    status: initialData?.status ?? false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Ambil user yang sedang login
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    if (isEdit) {
      // Update task yang sudah ada
      const { error } = await supabase
        .from('tasks')
        .update(form)
        .eq('id', initialData!.id)
      if (error) setError(error.message)
      else router.push('/')
    } else {
      // Buat task baru
      const { error } = await supabase
        .from('tasks')
        .insert({ ...form, user_id: user.id })
      if (error) setError(error.message)
      else router.push('/')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4 max-w-lg w-full">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul PR</label>
        <input
          name="title" value={form.title} onChange={handleChange} required
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Contoh: Laporan Praktikum Fisika"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
        <input
          name="subject" value={form.subject} onChange={handleChange} required
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Contoh: Fisika"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea
          name="description" value={form.description} onChange={handleChange}
          rows={3}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Deskripsi singkat tugas..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
        <input
          type="date" name="deadline" value={form.deadline} onChange={handleChange} required
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox" name="status" id="status"
          checked={form.status}
          onChange={handleChange}
          className="w-4 h-4 accent-green-500"
        />
        <label htmlFor="status" className="text-sm text-gray-700">Sudah selesai</label>
      </div>

      <button
        type="submit" disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah PR'}
      </button>
    </form>
  )
}
