import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#12121a] border-t border-[#2a2a35]">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">DevStats</span>
            </div>
            <p className="mt-4 text-sm text-[#94a3b8]">
              Track your coding progress across all platforms. Unified dashboard for competitive programmers and developers.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#64748b] hover:text-[#f8fafc] transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#64748b] hover:text-[#f8fafc] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#64748b] hover:text-[#f8fafc] transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-[#f8fafc] uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/dashboard" className="text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/platforms" className="text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                  Platforms
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h3 className="text-sm font-semibold text-[#f8fafc] uppercase tracking-wider">Platforms</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                  Codeforces
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                  LeetCode
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                  CodeChef
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-[#f8fafc] uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#2a2a35]">
          <p className="text-center text-sm text-[#64748b]">
            Made with <Heart className="inline-block w-4 h-4 text-[#ef4444] mx-1" /> by developers, for developers.
          </p>
          <p className="text-center text-xs text-[#64748b] mt-2">
            © {new Date().getFullYear()} DevStats. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
