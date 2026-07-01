import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordToggle from '../components/auth/PasswordToggle';
import PasswordStrength from '../components/auth/PasswordStrength';
import {
  inputClassName,
  selectClassName,
  labelClassName,
  submitButtonClassName,
} from '../components/auth/authStyles';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Freelancer',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const res = await api.post('/api/auth/register', formData);
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <AuthLayout
      mode="register"
      title="Sign Up"
      compact
      error={error}
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <label className={labelClassName}>Full Name</label>
          <input
            type="text"
            required
            className={inputClassName}
            placeholder="John Doe"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClassName}>Email Address</label>
          <input
            type="email"
            required
            className={inputClassName}
            placeholder="Enter your email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClassName}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className={inputClassName}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
          <PasswordStrength password={formData.password} />
        </div>

        <div>
          <label className={labelClassName}>I want to join as a:</label>
          <select
            className={selectClassName}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="Freelancer">Freelancer (Looking for Work)</option>
            <option value="Client">Client (Looking to Hire)</option>
          </select>
        </div>

        <button type="submit" className={submitButtonClassName}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Sign Up
        </button>
      </form>
    </AuthLayout>
  );
}
