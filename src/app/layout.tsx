import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'HK Card King',
  description: 'Your premier destination for trading cards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}