import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Github, Zap, ArrowRight, Check, X } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, validatePassword } from '../utils/validators';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Update password strength
    if (name === 'password') {
      setPasswordStrength(validatePassword(value));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await signup(formData.name, formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ submit: result.error || 'Signup failed. Please try again.' });
    }
  };

  const handleOAuthSignup = (provider) => {
    // TODO: Implement OAuth signup
    console.log(`OAuth signup with ${provider}`);
  };

  const getStrengthColor = (strength) => {
    if (strength < 40) return 'bg-[#ef4444]';
    if (strength < 70) return 'bg-[#f59e0b]';
    return 'bg-[#22c55e]';
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[#12121a] border-r border-[#2a2a35] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#6366f1] rounded-full blur-[128px] opacity-20" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#8b5cf6] rounded-full blur-[128px] opacity-20" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center px-12"
        >
          <h2 className="text-3xl font-bold text-[#f8fafc] mb-4">
            Start Your Journey
          </h2>
          <p className="text-[#94a3b8] max-w-md mb-8">
            Create your free account and start tracking your coding progress across all platforms.
          </p>

          {/* Features list */}
          <div className="text-left space-y-4">
            {[
              'Connect 9+ coding platforms',
              'Beautiful progress visualizations',
              'Shareable public profile',
              'Deep analytics and insights',
              '100% free forever',
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#22c55e]/20">
                  <Check className="w-4 h-4 text-[#22c55e]" />
                </div>
                <span className="text-[#94a3b8]">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
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

          <h1 className="text-3xl font-bold text-[#f8fafc] mb-2">Create your account</h1>
          <p className="text-[#94a3b8] mb-8">
            Start tracking your coding journey for free
          </p>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              leftIcon={<Github className="w-5 h-5" />}
              onClick={() => handleOAuthSignup('github')}
            >
              Sign up with GitHub
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
              onClick={() => handleOAuthSignup('google')}
            >
              Sign up with Google
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
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              leftIcon={<User className="w-5 h-5" />}
            />

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

            <div>
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
              {passwordStrength && formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#1a1a25] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength.strength}%` }}
                        className={`h-full rounded-full ${getStrengthColor(passwordStrength.strength)}`}
                      />
                    </div>
                    <span className="text-xs text-[#64748b]">{passwordStrength.message}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(passwordStrength.checks || {}).map(([key, passed]) => (
                      <span
                        key={key}
                        className={`text-xs flex items-center gap-1 ${passed ? 'text-[#22c55e]' : 'text-[#64748b]'}`}
                      >
                        {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {key === 'length' ? '8+ chars' : key}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              leftIcon={<Lock className="w-5 h-5" />}
            />

            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-[#2a2a35] bg-[#12121a] text-[#6366f1] focus:ring-[#6366f1] focus:ring-offset-0"
                />
                <span className="text-sm text-[#94a3b8]">
                  I agree to the{' '}
                  <a href="#" className="text-[#6366f1] hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-[#6366f1] hover:underline">Privacy Policy</a>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-[#ef4444]">{errors.agreeToTerms}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#94a3b8]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#6366f1] hover:text-[#818cf8] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
