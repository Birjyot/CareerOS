import { Inter } from 'next/font/google'
import { Providers } from '../components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CareerOS — AI-Powered Career Operating System',
  description: 'Track applications, generate cover letters, ace interviews with AI coaching, and score your resume — all in one premium dashboard.',
}

export const viewport = {
  themeColor: '#050814',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // The inline style fires at parse time — before CSS, before JS — so
    // the very first paint is dark. Eliminates the white/grey flash.
    <html lang="en" style={{ background: '#050814' }}>
      <body
        className={inter.className}
        style={{ background: '#050814', color: '#fff' }}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}