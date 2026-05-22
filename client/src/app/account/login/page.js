'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import styles from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(form.email, form.password);
      if (res.data.user.role === 'admin') router.push('/admin');
      else router.push('/account');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.sub}>Welcome back to Haitham Store</p>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input className="form-input" type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <input className="form-input" type="password" placeholder="Password" value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className={styles.footer}>
          Don&apos;t have an account? <Link href="/account/register">Register</Link>
        </p>

      </div>
    </div>
  );
}
