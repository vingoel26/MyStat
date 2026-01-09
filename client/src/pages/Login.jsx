import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Github, Zap, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ submit: result.error || 'Login failed. Please try again.' });
    }
  };

  const handleOAuthLogin = (provider) => {
    // TODO: Implement OAuth login
    console.log(`OAuth login with ${provider}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">DevStats</span>
          </Link>

          <h1 className="text-3xl font-bold text-[#f8fafc] mb-2">Welcome back</h1>
          <p className="text-[#94a3b8] mb-8">
            Sign in to continue to your dashboard
          </p>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              leftIcon={<Github className="w-5 h-5" />}
              onClick={() => handleOAuthLogin('github')}
            >
              Continue with GitHub
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              leftIcon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              }
              onClick={() => handleOAuthLogin('google')}
            >
              Continue with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a35]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0a0a0f] text-[#64748b]">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.submit && (
              <div className="p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] text-sm">
                {errors.submit}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={<Mail className="w-5 h-5" />}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              leftIcon={<Lock className="w-5 h-5" />}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#2a2a35] bg-[#12121a] text-[#6366f1] focus:ring-[#6366f1] focus:ring-offset-0"
                />
                <span className="text-sm text-[#94a3b8]">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#6366f1] hover:text-[#818cf8] transition-colors">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#94a3b8]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#6366f1] hover:text-[#818cf8] font-medium transition-colors">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[#12121a] border-l border-[#2a2a35] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-[#6366f1] rounded-full blur-[128px] opacity-20" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-[#8b5cf6] rounded-full blur-[128px] opacity-20" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center px-12"
        >
          <h2 className="text-3xl font-bold text-[#f8fafc] mb-4">
            Track Your Progress
          </h2>
          <p className="text-[#94a3b8] max-w-md">
            Join thousands of developers who use DevStats to monitor their coding journey across multiple platforms.
          </p>
          
          {/* Decorative stats */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { value: '2,156', label: 'Rating' },
              { value: '1,500+', label: 'Problems' },
              { value: '45 days', label: 'Streak' },
              { value: '6', label: 'Platforms' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 bg-[#1a1a25] rounded-xl border border-[#2a2a35]">
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-[#64748b]">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
