import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import CartDrawer from '@/components/cart/CartDrawer';
import AuthProvider from '@/components/layout/AuthProvider';

export const metadata = {
  title: 'Haitham Store - Premium Disposable Face Towels',
  description: 'Simple switch, better skin. Premium biodegradable face towels for your daily skincare routine. Free shipping on orders above 30 JOD.',
  keywords: 'face towels, disposable towels, skincare, bamboo towels, biodegradable, haitham store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AnnouncementBar />
          <Header />
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </AuthProvider>
      </body>
    </html>
  );
}
