'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    logout,
    changeDisplayName,
    resendVerificationEmail,
    fetchDashboardData,
    fetchUserStatic,
    fetchUserProfile,
} from '../api/auth';
import styles from '../../styles/Dashboard.module.css';
import is from 'is_js';

export default function DashboardClient() {
    const [user, setUser] = useState(null);
    const [dashboard, setDashboard] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const responseDashboard = await fetchDashboardData();
                const responseStatistics = await fetchUserStatic();
                setStatistics(responseStatistics.data);
                setDashboard(responseDashboard.data);
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching dashboard data');
            }
        };
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
        fetchUserData();
        fetchDashboard();
    }, [router]);

    const handleLogout = async () => {
        try {
            await logout();

            router.push('/login');
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
                const response = await fetchUserProfile();
                setUser(response.data);
            } catch (error) {
                setError(error.response?.data?.message || 'Change display name error');
            }
        }
    };

    const handleResendVerificationEmail = async () => {
        try {
            await resendVerificationEmail();
            alert('Verification email sent!');
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Resend verification email error');
        }
    };

    const handleResetPassword = async () => {
        if (user.type == 'google') {
            return alert('Google does not support reset password');
        }
        router.push('/reset-password');
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
                        <p>Login Type: {user.type}</p>
                    </div>
                </div>
                <div>
                    <button onClick={handleLogout} className={styles.button}>
                        Logout
                    </button>
                    <button onClick={handleChangeDisplayName} className={styles.button}>
                        Change Display Name
                    </button>
                    <button onClick={handleResetPassword} className={styles.button}>
                        Reset Password
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

            {user.isVerified == 1 && is.not.empty(statistics) && (
                <div>
                    <section className={styles.statistics}>
                        <h2>User Statistics</h2>
                        <p>Total Users: {statistics.totalUsers}</p>
                        <p>Active Sessions Today: {statistics.activeSessionsToday}</p>
                        <p>Average Active Sessions (Last 7 Days): {statistics.averageActiveSessionsLast7Days}</p>
                    </section>
                </div>
            )}
            {user.isVerified == 1 && is.not.empty(dashboard) && (
                <div>
                    <section className={styles.tableSection}>
                        <h2>User Database Dashboard</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Display Name</th>
                                    <th>Email</th>
                                    <th>Timestamp of User Sign Up</th>
                                    <th>Number of Times Logged In</th>
                                    <th>Timestamp of the Last User Session</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard.map((user, key) => (
                                    <tr key={key}>
                                        <td>{user.displayName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.signupTs}</td>
                                        <td>{user.loginCount}</td>
                                        <td>{user.lastSession}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            )}
        </div>
    );
}
