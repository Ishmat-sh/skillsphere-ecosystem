import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    localStorage.setItem('token', token);

    api
      .get('/api/auth/me')
      .then((res) => {
        login(token, res.data);
        navigate('/dashboard');
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center">
      <div className="text-white">Processing Google login...</div>
    </div>
  );
}
