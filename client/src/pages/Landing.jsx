import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  BarChart3,
  Link as LinkIcon,
  Shield,
  Github,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Code2,
} from 'lucide-react';
import Button from '../components/common/Button';
import { Footer } from '../components/layout';

const Landing = () => {
  const features = [
    {
      icon: LinkIcon,
      title: 'Multi-Platform Integration',
      description: 'Connect Codeforces, LeetCode, CodeChef, AtCoder, GitHub, and more. All your stats in one place.',
    },
    {
      icon: BarChart3,
      title: 'Deep Analytics',
      description: 'Visualize your progress with beautiful charts, heatmaps, and insights to identify improvement areas.',
    },
    {
      icon: Shield,
      title: 'Privacy Focused',
      description: 'Your data stays yours. Control visibility settings and share only what you want.',
    },
  ];

  const platforms = [
    { name: 'Codeforces', color: '#1890ff' },
    { name: 'LeetCode', color: '#ffa116' },
    { name: 'CodeChef', color: '#5b4638' },
    { name: 'AtCoder', color: '#222222' },
    { name: 'GitHub', color: '#24292f' },
    { name: 'Stack Overflow', color: '#f48024' },
  ];

  const stats = [
    { value: '10K+', label: 'Developers' },
    { value: '500K+', label: 'Problems Tracked' },
    { value: '9', label: 'Platforms Supported' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#2a2a35]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">DevStats</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-[#94a3b8] hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6366f1] rounded-full blur-[128px] opacity-20" />
          <div className="absolute top-60 -left-40 w-80 h-80 bg-[#8b5cf6] rounded-full blur-[128px] opacity-20" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#6366f1]/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/30">
              <Star className="w-4 h-4 text-[#fbbf24]" />
              <span className="text-sm text-[#94a3b8]">The #1 coding portfolio platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#f8fafc] mb-6">
              Track Your{' '}
              <span className="gradient-text">Coding Journey</span>
              <br />
              Across All Platforms
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg text-[#94a3b8] mb-8">
              Connect multiple coding platforms, visualize your progress, and showcase your achievements. 
              The ultimate portfolio for competitive programmers and developers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start for Free
                </Button>
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" leftIcon={<Github className="w-5 h-5" />}>
                  View on GitHub
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Platform logos */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6"
          >
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12121a] border border-[#2a2a35]"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: platform.color }}
                />
                <span className="text-sm text-[#94a3b8]">{platform.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-[#2a2a35] bg-[#12121a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-[#64748b] mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Level Up</span>
            </h2>
            <p className="max-w-2xl mx-auto text-[#94a3b8]">
              Powerful features designed for competitive programmers and developers who want to track, analyze, and improve their coding skills.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-[#12121a] border border-[#2a2a35] rounded-2xl p-6 hover:border-[#6366f1]/50 transition-all duration-300">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#6366f1]/10 mb-4">
                    <feature.icon className="w-6 h-6 text-[#6366f1]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">{feature.title}</h3>
                  <p className="text-[#94a3b8]">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#12121a]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] mb-6">
                Why Choose{' '}
                <span className="gradient-text">DevStats</span>?
              </h2>
              <ul className="space-y-4">
                {[
                  'Unified dashboard for all your coding platforms',
                  'Beautiful visualizations and actionable insights',
                  'Track streaks, ratings, and problem-solving patterns',
                  'Share your public profile with recruiters',
                  '100% free and open source',
                  'Privacy-first approach with data control',
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <span className="text-[#94a3b8]">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 rounded-2xl blur-2xl" />
              <div className="relative bg-[#12121a] border border-[#2a2a35] rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
                    <Code2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#f8fafc]">1,500+ Problems</h3>
                    <p className="text-sm text-[#94a3b8]">Solved across platforms</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Rating', value: '2156' },
                    { label: 'Streak', value: '45 days' },
                    { label: 'Rank', value: 'Expert' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 bg-[#1a1a25] rounded-lg">
                      <p className="text-lg font-bold text-[#f8fafc]">{item.value}</p>
                      <p className="text-xs text-[#64748b]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-[#6366f1]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f8fafc] mb-4">
              Join Thousands of Developers
            </h2>
            <p className="text-lg text-[#94a3b8] mb-8">
              Start tracking your coding journey today. It's free, forever.
            </p>
            <Link to="/signup">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Create Your Portfolio
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
