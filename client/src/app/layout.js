import './globals.css';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import CartDrawer from '@/components/cart/CartDrawer';
import AuthProvider from '@/components/layout/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-cormorant',
});

export const metadata = {
  title: 'Haitham Store - Premium Disposable Face Towels',
  description: 'Simple switch, better skin. Premium biodegradable face towels for your daily skincare routine. Free shipping on orders above 30 JOD.',
  keywords: 'face towels, disposable towels, skincare, bamboo towels, biodegradable, haitham store',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1A1A1A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <AuthProvider>
          <AnnouncementBar />
          <Header />
          <main className="site-main">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </AuthProvider>
      </body>
    </html>
  );
}
