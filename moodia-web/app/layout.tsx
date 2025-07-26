import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/contexts/AuthContext'
import { MoodProvider } from '@/contexts/MoodContext'

export const metadata: Metadata = {
  title: 'Moodia - La Red Social Más Humana',
  description: 'Red social innovadora enfocada en procesos emocionales y crecimiento personal. Conectá desde tus emociones, no desde la apariencia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-neutral-white min-h-screen">
        <AuthProvider>
          <MoodProvider>
            {children}
          </MoodProvider>
        </AuthProvider>
      </body>
    </html>
  )
}