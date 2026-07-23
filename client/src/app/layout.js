import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import CartDrawer from '@/components/cart/CartDrawer';
import AuthProvider from '@/components/layout/AuthProvider';

export const metadata = {
  title: 'Fit Station Kitchen — Eat Fit. Live Strong.',
  description: 'Fresh, healthy, calorie-counted meals delivered to your door. High-protein meal boxes, fresh salads, and weekly meal plans. Real Food. Real Results.',
  keywords: 'healthy food, meal prep, high protein, calorie counted, fresh meals, fit station, meal delivery, keto, diet food, fitness meals, Egypt',
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
