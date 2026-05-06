'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import TaskForm from '@/components/TaskForm'
import { supabase, Task } from '@/lib/supabaseClient'

export default function EditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTask = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        router.push('/')
      } else {
        setTask(data)
      }
      setLoading(false)
    }
    fetchTask()
  }, [id, router])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Edit PR</h1>
        {task && <TaskForm initialData={task} />}
      </main>
    </>
  )
}
