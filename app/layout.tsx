import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PR Tracker',
  description: 'Aplikasi pencatatan dan informasi PR (Pekerjaan Rumah)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
