'use client';

import { useState, useEffect } from 'react';
import { register, fetchUserProfile } from '../api/auth';
import styles from '../../styles/Auth.module.css';
import { useRouter } from 'next/navigation';
export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await register(email, password, confirmPassword);
            if (response.status !== 200) {
                setError(response.data || 'Register failed');
            } else {
                console.log('Register success:', response.data);
                setError('');
            }
        } catch (error) {
            console.log('error:', error.response);
            setError(error.response?.data || 'Register error');
        }
    };
    //check is user is already logged in
    useEffect(() => {
        const handleCheckUserAuth = async () => {
            try {
                const response = await fetchUserProfile();
                if (response.data) {
                    router.push('/dashboard');
                }
            } catch (error) {}
        };

        handleCheckUserAuth();
    }, [router]);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Register</h1>
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
            <input
                type='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
            />
            {error && (
                <p className={styles.error}>
                    {error.split(',').map((e, index) => (
                        <span key={index}>
                            {e}
                            <br />
                        </span>
                    ))}
                </p>
            )}
            <button onClick={handleRegister} className={styles.button}>
                Register
            </button>
        </div>
    );
}
