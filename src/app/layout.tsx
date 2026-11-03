import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import Navbar from '../components/Navbar';
import ProfileModal from '../components/ProfileModal';
import DuplicateNoticeModal from '../components/DuplicateNoticeModal';
import AuthModal from '../components/AuthModal';

export const metadata: Metadata = {
  title: 'GlobalScholar Hub | CS Higher Study Abroad & Scholarship Portal',
  description: 'Verified scholarship database, country work rights, application Kanban tracker, and document vault for undergraduate students aiming for higher studies abroad.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [
      { url: '/icon.svg' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased min-h-screen bg-slate-50 flex flex-col font-sans">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          
          {/* Global Modals */}
          <AuthModal />
          <ProfileModal />
          <DuplicateNoticeModal />

          {/* Footer */}
          <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">GlobalScholar Hub</span>
                <span>•</span>
                <span>Data verified against official government & university portals</span>
              </div>
              <p>Built for CS Undergraduates aiming for global scholarships & tuition-free higher studies.</p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
