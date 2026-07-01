import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import AuthSocialButtons from '../components/auth/AuthSocialButtons';
import PasswordToggle from '../components/auth/PasswordToggle';
import { inputClassName, submitButtonClassName, linkAccentClassName } from '../components/auth/authStyles';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const res = await api.post('/api/auth/login', formData);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <AuthLayout
      mode="login"
      title="Sign In"
      error={error}
      footerText="New to SkillSphere?"
      footerLinkText="Create an account"
      footerLinkTo="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="email"
            required
            className={inputClassName}
            placeholder="Email or Username"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            className={inputClassName}
            placeholder="Password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
        </div>

        <div className="text-right">
          <button type="button" className={`text-sm ${linkAccentClassName}`}>
            Forgot password?
          </button>
        </div>

        <button type="submit" className={submitButtonClassName}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Sign In
        </button>
      </form>

      <AuthSocialButtons action="Log in" />
    </AuthLayout>
  );
}
