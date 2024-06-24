import axios from 'axios';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:3000';

export const login = async (email, password) => {
    return axios.post(
        `${API_HOST}/api/auth/login`,
        { email, password },
        {
            withCredentials: true,
        }
    );
};

export const register = async (email, password) => {
    return axios.post(
        `${API_HOST}/api/auth/register`,
        { email, password },
        {
            withCredentials: true,
        }
    );
};

export const googleLogin = () => {
    window.location.href = `${API_HOST}/api/auth/google`;
};

export const logout = async () => {
    return axios.get(`${API_HOST}/api/logout`, {
        withCredentials: true,
    });
};

export const changeDisplayName = async (displayName) => {
    return axios.post(
        `${API_HOST}/api/auth/changeDisplayName`,
        { displayName },
        {
            withCredentials: true,
        }
    );
};

export const resendVerificationEmail = async () => {
    return axios.post(
        `${API_HOST}/api/auth/resend-verification-email`,
        {},
        {
            withCredentials: true,
        }
    );
};

export const fetchUserProfile = async () => {
    return axios.get(`${API_HOST}/api/user/profile`, {
        withCredentials: true,
    });
};

export const fetchDashboardData = async () => {
    return axios.get(`${API_HOST}/api/dashboard`, {
        withCredentials: true,
    });
};

export const fetchUserStatic = async () => {
    return axios.get(`${API_HOST}/api/statistics`, {
        withCredentials: true,
    });
};

export const resetPassword = async (oldPassword, newPassword, newConfirmPassword) => {
    return axios.post(
        `${API_HOST}/api/auth/reset-password`,
        { oldPassword, newPassword, confirmNewPassword: newConfirmPassword },
        {
            withCredentials: true,
        }
    );
};
