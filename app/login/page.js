'use client';

import { useState } from 'react';
import { login, googleLogin } from '../api/auth';
import styles from '../../styles/Auth.module.css';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await login(email, password);
            if (response.status !== 200) {
                setError(response.data.message || 'Login failed');
            }
            setError('');
            router.push('/dashboard');
        } catch (error) {
            setError(error.response?.data || 'Login error');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Login</h1>
            <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
            />
            <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button onClick={handleLogin} className={styles.button}>
                Login
            </button>
            <button onClick={googleLogin} className={styles.secondaryButton}>
                Login with Google
            </button>
            <button onClick={() => router.push('/register')} className={styles.linkButton}>
                Don't have an account? Register
            </button>
        </div>
    );
}
