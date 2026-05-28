import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../services/api';
import { toast } from 'sonner';
import DemoCredentials from '../../components/DemoCredentials';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try real API first
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });
      console.log(response);

      const { token, id, email, role, fullName, phone, bio } = response.data;

      const userData = {
        id,
        fullName: fullName || 'Unknown',
        email,
        role: role ? role.replace("ROLE_", "") : "",
        phone: phone || '',
        bio: bio || '',
      };

      login(userData, token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response.data.message || "Login failed!");
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
          <h1 className="text-2xl font-semibold text-[#0F172A] mb-2">Welcome back</h1>
          <p className="text-sm text-[#64748B]">Sign in to your EventEase account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                className="h-4 w-4 rounded border-[#E2E8F0] text-[#EA580C] focus:ring-[#EA580C] focus:ring-offset-0"
              />
              <span className="ml-2 text-sm text-[#64748B]">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-[#EA580C] hover:text-[#C2410C] font-medium">
              Forgot password?
            </Link>
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
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[#64748B]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#EA580C] hover:text-[#C2410C] font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#64748B] mt-6">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}