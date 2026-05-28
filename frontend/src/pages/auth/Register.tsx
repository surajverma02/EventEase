import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authAPI } from '../../services/api';
import { toast } from 'sonner';

const userRoles = [
  { label: 'Admin', value: 'ROLE_ADMIN' },
  { label: 'Event Organizer', value: 'ROLE_ORGANIZER' },
  { label: 'Attendee', value: 'ROLE_ATTENDEE' },
  { label: 'Vendor', value: 'ROLE_VENDOR' },
  { label: 'Staff', value: 'ROLE_STAFF' }
];

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_ATTENDEE',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        roles: formData.role,
      });

      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-8">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 bg-[#EA580C] rounded-xl mb-4">
            <Calendar className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#0F172A] mb-2">Create your account</h1>
          <p className="text-sm text-[#64748B]">Start managing events with EventEase</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[#0F172A] mb-2">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
              placeholder="john@example.com"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-[#0F172A] mb-2">
              Register as
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
            >
              {userRoles.length > 0 ? userRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              )) : (
                <option value="ROLE_ATTENDEE">Attendee</option>
              )}
            </select>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#0F172A] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#0F172A] mb-2">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#64748B]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#EA580C] hover:text-[#C2410C] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#64748B] mt-6">
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
