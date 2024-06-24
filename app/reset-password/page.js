'use client';

import { useState } from 'react';
import { resetPassword } from '../api/auth';
import styles from '../../styles/ResetPassword.module.css';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newConfirmPassword, setNewConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleResetPassword = async () => {
        if (newPassword !== newConfirmPassword) {
            setError('New passwords do not match');
            return;
        }

        try {
            await resetPassword(oldPassword, newPassword, newConfirmPassword);
            setSuccess('Password reset successfully');
            setError('');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error) {
            setError(error.response?.data || 'Reset password error');
            setSuccess('');
        }
    };

    return (
        <div className={styles.container}>
            <h1>Reset Password</h1>
            <input
                type='password'
                placeholder='Old Password'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={styles.input}
            />
            <input
                type='password'
                placeholder='New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
            />
            <input
                type='password'
                placeholder='Confirm New Password'
                value={newConfirmPassword}
                onChange={(e) => setNewConfirmPassword(e.target.value)}
                className={styles.input}
            />
            {error && (
                <p className={styles.error}>
                    <p className={styles.error}>
                        {error.split(',').map((e, index) => (
                            <span key={index}>
                                {e}
                                <br />
                            </span>
                        ))}
                    </p>
                </p>
            )}
            {success && <p className={styles.success}>{success}</p>}
            <button onClick={handleResetPassword} className={styles.button}>
                Reset Password
            </button>
        </div>
    );
}
