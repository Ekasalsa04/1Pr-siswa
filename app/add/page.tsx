import Navbar from '@/components/Navbar'
import TaskForm from '@/components/TaskForm'

export default function AddPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Tambah PR Baru</h1>
        <TaskForm />
      </main>
    </>
  )
}
