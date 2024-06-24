'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout, changeDisplayName, resendVerificationEmail, fetchDashboardData, fetchUserProfile } from '../api/auth';
import styles from '../../styles/Dashboard.module.css';

export default function DashboardClient() {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [error, setError] = useState('');
    const router = useRouter();
    const fetchUserData = async () => {
        try {
            const response = await fetchUserProfile();
            setUser(response.data);
        } catch (error) {
            alert(error.response?.data || 'Error fetching user data');
            setError(error.response?.data?.message || 'Error fetching user data');
            router.push('/login');
        }
    };
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await fetchDashboardData();
                setUsers(response.data.users);
                setStatistics(response.data.statistics);
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching dashboard data');
            }
        };

        fetchUserData();
        fetchDashboard();
    }, [router]);

    const handleLogout = async () => {
        try {
            await logout();
            router.reload();
        } catch (error) {
            setError(error.response?.data?.message || 'Logout error');
        }
    };

    const handleChangeDisplayName = async () => {
        const newDisplayName = prompt('New display name:');
        if (newDisplayName) {
            try {
                await changeDisplayName(newDisplayName);
                setError('');
                await fetchUserData();
            } catch (error) {
                setError(error.response?.data?.message || 'Change display name error');
            }
        }
    };

    const handleResendVerificationEmail = async () => {
        try {
            await resendVerificationEmail();
            alert('Verification email sent!');
        } catch (error) {
            setError(error.response?.data?.message || 'Resend verification email error');
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Dashboard</h1>
                    <div>
                        <p>Display Name: {user.displayName}</p>
                        <p>Email: {user.email}</p>
                    </div>
                </div>
                <div>
                    <button onClick={handleLogout} className={styles.button}>
                        Logout
                    </button>
                    <button onClick={handleChangeDisplayName} className={styles.button}>
                        Change Display Name
                    </button>
                </div>
            </header>
            {user.isVerified === 0 && (
                <div className={styles.verification}>
                    <button onClick={handleResendVerificationEmail} className={styles.button}>
                        Resend Verification Email
                    </button>
                </div>
            )}
            {error && <p className={styles.error}>{error}</p>}
            <section className={styles.statistics}>
                <h2>Statistics</h2>
                <p>Total Users: {statistics.totalUsers}</p>
                <p>Active Sessions Today: {statistics.activeSessionsToday}</p>
                <p>Average Active Sessions (Last 7 Days): {statistics.averageActiveSessions}</p>
            </section>
            <section className={styles.tableSection}>
                <h2>User Database</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Sign Up Timestamp</th>
                            <th>Login Count</th>
                            <th>Last Session Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.signupTimestamp}</td>
                                <td>{user.loginCount}</td>
                                <td>{user.lastSessionTimestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
