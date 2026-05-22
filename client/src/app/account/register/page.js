'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/store/authStore';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      router.push('/account');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.sub}>Join the Haitham Store family</p>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <input className="form-input" placeholder="First name" value={form.firstName}
                onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} required />
            </div>
            <div className="form-group">
              <input className="form-input" placeholder="Last name" value={form.lastName}
                onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} required />
            </div>
          </div>
          <div className="form-group">
            <input className="form-input" type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <input className="form-input" type="password" placeholder="Password (min 6 characters)" value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          </div>
          <div className="form-group">
            <input className="form-input" type="tel" placeholder="Phone (optional)" value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link href="/account/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
