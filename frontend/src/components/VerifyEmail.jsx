import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const { data } = await api.get(`/users/verify/${token}`);

                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    window.location.href = '/';
                    window.location.reload();
                }
            } catch (err) {
                console.error("Verification failed", err);
                navigate('/signin');
            }
        };

        if (token) confirmEmail();
    }, [token, navigate]);

    return (
        <div className="auth-page-container">
        </div>
    );
}

export default VerifyEmail;