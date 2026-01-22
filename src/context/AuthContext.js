"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const api = axios.create({
        baseURL: 'https://sistema-api.znmwnf.easypanel.host/api'
    });

    useEffect(() => {
        // Hydrate from cookie
        const token = Cookies.get('token');
        const userData = Cookies.get('user');

        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });

            // If 2FA is required, return the temp token and flag
            if (res.data.requires2FA) {
                return res.data;
            }

            // Standard login fallback (if 2FA disabled somehow)
            const { token, user } = res.data;
            Cookies.set('token', token, { expires: 365 });
            Cookies.set('user', JSON.stringify(user), { expires: 365 });
            setUser(user);
            router.push('/admin/dashboard');
            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const verifyCode = async (tempToken, code) => {
        try {
            const res = await api.post('/auth/verify-2fa', { tempToken, code });
            const { token, user } = res.data;

            Cookies.set('token', token, { expires: 365 });
            Cookies.set('user', JSON.stringify(user), { expires: 365 });
            setUser(user);
            router.push('/admin/dashboard');
            return true;
        } catch (error) {
            console.error("2FA Verification failed", error);
            throw error;
        }
    };

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, verifyCode, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
