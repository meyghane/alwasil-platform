import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import ChatBot from '@/components/ChatBot';

export const metadata: Metadata = {
  title: 'Al-Wasil Platform',
  description: 'Connecter la communauté : Éducation, Solidarité, Événements',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Navigation />
        <main style={{ minHeight: 'calc(100vh - 4rem - 60px)' }}>
          {children}
        </main>
        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 0', backgroundColor: '#fafaf9' }}>
          <div className="container" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <p>&copy; {new Date().getFullYear()} Al-Wasil Platform. Tous droits réservés.</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a href="#">Confidentialité</a>
              <a href="#">Conditions d'utilisation</a>
              <a href="#">Nous contacter</a>
            </div>
          </div>
        </footer>
        <ChatBot />
      </body>
    </html>
  );
}
