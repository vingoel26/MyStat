import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PageContainer } from '../components/layout';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { usePlatforms } from '../context/PlatformContext';
import { PLATFORMS, DIFFICULTIES } from '../utils/constants';
import { formatDate, getDifficultyBgColor } from '../utils/formatters';

const Problems = () => {
  const { submissions } = usePlatforms();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const itemsPerPage = 15;

  // Filter and sort submissions
  const filteredSubmissions = useMemo(() => {
    let result = [...submissions];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.problemName.toLowerCase().includes(query) ||
        s.problemId.toLowerCase().includes(query) ||
        s.tags?.some(t => t.toLowerCase().includes(query))
      );
    }

    // Platform filter
    if (selectedPlatform !== 'all') {
      result = result.filter(s => s.platform === selectedPlatform);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      result = result.filter(s => s.difficulty === selectedDifficulty);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter(s => s.status === selectedStatus);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.submittedAt) - new Date(b.submittedAt);
          break;
        case 'name':
          comparison = a.problemName.localeCompare(b.problemName);
          break;
        case 'difficulty':
          const diffOrder = { easy: 1, medium: 2, hard: 3 };
          comparison = (diffOrder[a.difficulty] || 0) - (diffOrder[b.difficulty] || 0);
          break;
        case 'platform':
          comparison = a.platform.localeCompare(b.platform);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [submissions, searchQuery, selectedPlatform, selectedDifficulty, selectedStatus, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = useMemo(() => {
    return {
      total: submissions.length,
      solved: submissions.filter(s => s.status === 'solved').length,
      easy: submissions.filter(s => s.difficulty === 'easy' && s.status === 'solved').length,
      medium: submissions.filter(s => s.difficulty === 'medium' && s.status === 'solved').length,
      hard: submissions.filter(s => s.difficulty === 'hard' && s.status === 'solved').length,
    };
  }, [submissions]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPlatform('all');
    setSelectedDifficulty('all');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  const getPlatformIcon = (platformId) => {
    const colors = {
      codeforces: 'bg-[#1890ff]',
      leetcode: 'bg-[#ffa116]',
      codechef: 'bg-[#5b4638]',
      atcoder: 'bg-[#222222]',
    };

    return (
      <div className={`w-6 h-6 rounded flex items-center justify-center text-white font-bold text-[10px] ${colors[platformId] || 'bg-[#6366f1]'}`}>
        {PLATFORMS[platformId]?.name.substring(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <PageContainer
      title="Problems"
      description="View all your solved problems across platforms."
    >
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#f8fafc]">{stats.total}</p>
          <p className="text-xs text-[#64748b]">Total Problems</p>
        </div>
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#22c55e]">{stats.solved}</p>
          <p className="text-xs text-[#64748b]">Solved</p>
        </div>
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#22c55e]">{stats.easy}</p>
          <p className="text-xs text-[#64748b]">Easy</p>
        </div>
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#f59e0b]">{stats.medium}</p>
          <p className="text-xs text-[#64748b]">Medium</p>
        </div>
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-[#ef4444]">{stats.hard}</p>
          <p className="text-xs text-[#64748b]">Hard</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search problems by name or tag..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a25] border border-[#2a2a35] rounded-lg text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            {/* Platform Filter */}
            <select
              value={selectedPlatform}
              onChange={(e) => {
                setSelectedPlatform(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-[#1a1a25] border border-[#2a2a35] rounded-lg text-[#f8fafc] focus:outline-none focus:border-[#6366f1] transition-colors cursor-pointer"
            >
              <option value="all">All Platforms</option>
              {Object.values(PLATFORMS).filter(p => p.hasRating !== false).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-[#1a1a25] border border-[#2a2a35] rounded-lg text-[#f8fafc] focus:outline-none focus:border-[#6366f1] transition-colors cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 bg-[#1a1a25] border border-[#2a2a35] rounded-lg text-[#f8fafc] focus:outline-none focus:border-[#6366f1] transition-colors cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="attempted">Attempted</option>
            </select>

            {/* Clear Filters */}
            {(searchQuery || selectedPlatform !== 'all' || selectedDifficulty !== 'all' || selectedStatus !== 'all') && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(selectedPlatform !== 'all' || selectedDifficulty !== 'all' || selectedStatus !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#2a2a35]">
            <span className="text-sm text-[#64748b]">Active filters:</span>
            {selectedPlatform !== 'all' && (
              <Badge variant="primary" size="sm">
                {PLATFORMS[selectedPlatform]?.name}
              </Badge>
            )}
            {selectedDifficulty !== 'all' && (
              <Badge variant={selectedDifficulty === 'easy' ? 'success' : selectedDifficulty === 'medium' ? 'warning' : 'danger'} size="sm">
                {selectedDifficulty}
              </Badge>
            )}
            {selectedStatus !== 'all' && (
              <Badge variant="default" size="sm">
                {selectedStatus}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Problems Table */}
      <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a35]">
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                  Problem
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                  
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a35]">
              {paginatedSubmissions.map((submission, index) => (
                <motion.tr
                  key={submission.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-[#1a1a25] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-[#f8fafc]">{submission.problemName}</p>
                      <p className="text-xs text-[#64748b]">{submission.problemId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(submission.platform)}
                      <span className="text-sm text-[#94a3b8] capitalize">{submission.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded capitalize ${getDifficultyBgColor(submission.difficulty)}`}>
                      {submission.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={submission.status === 'solved' ? 'success' : 'warning'}
                      size="sm"
                      dot
                    >
                      {submission.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {submission.tags?.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="default" size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {submission.tags?.length > 2 && (
                        <Badge variant="default" size="sm">
                          +{submission.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#64748b]">
                      <Calendar className="w-4 h-4" />
                      {formatDate(submission.submittedAt, 'short')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={submission.problemUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-[#64748b] hover:text-[#f8fafc] hover:bg-[#2a2a35] transition-colors inline-flex"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedSubmissions.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto text-[#64748b] mb-4" />
            <h3 className="text-lg font-medium text-[#f8fafc] mb-2">No problems found</h3>
            <p className="text-[#94a3b8]">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#2a2a35]">
            <p className="text-sm text-[#64748b]">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSubmissions.length)} of {filteredSubmissions.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#6366f1] text-white'
                          : 'text-[#94a3b8] hover:bg-[#1a1a25]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Problems;
