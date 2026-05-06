'use client'

import Link from 'next/link'
import { supabase, Task } from '@/lib/supabaseClient'

type Props = {
  task: Task
  onDelete: (id: string) => void
  onToggle: (id: string, current: boolean) => void
}

// Cek apakah deadline sudah dekat (dalam 3 hari ke depan)
function isDeadlineNear(deadline: string): boolean {
  const diff = new Date(deadline).getTime() - Date.now()
  return diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function TaskCard({ task, onDelete, onToggle }: Props) {
  const near = isDeadlineNear(task.deadline)
  const overdue = new Date(task.deadline) < new Date() && !task.status

  // Warna border berdasarkan status
  const borderColor = task.status
    ? 'border-green-400'
    : overdue || near
    ? 'border-red-400'
    : 'border-gray-200'

  return (
    <div className={`bg-white rounded-xl border-2 ${borderColor} p-4 shadow-sm`}>
      {/* Header: judul + badge status */}
      <div className="flex items-start justify-between gap-2">
        <h3 className={`font-semibold text-base ${task.status ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {task.title}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
          task.status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {task.status ? '✅ Selesai' : '⏳ Belum'}
        </span>
      </div>

      {/* Mata pelajaran */}
      <p className="text-xs text-blue-600 font-medium mt-1">{task.subject}</p>

      {/* Deskripsi */}
      {task.description && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
      )}

      {/* Deadline */}
      <p className={`text-xs mt-2 font-medium ${
        task.status ? 'text-gray-400' : overdue ? 'text-red-600' : near ? 'text-red-500' : 'text-gray-500'
      }`}>
        📅 {formatDate(task.deadline)}
        {overdue && !task.status && ' — Terlambat!'}
        {near && !task.status && !overdue && ' — Segera!'}
      </p>

      {/* Aksi */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onToggle(task.id, task.status)}
          className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          {task.status ? 'Tandai Belum' : 'Tandai Selesai'}
        </button>
        <Link
          href={`/edit/${task.id}`}
          className="text-xs px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs px-3 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600"
        >
          Hapus
        </button>
      </div>
    </div>
  )
}
