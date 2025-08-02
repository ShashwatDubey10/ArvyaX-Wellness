// src/pages/Sessions.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [hoveredSession, setHoveredSession] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions");
        setSessions(Array.isArray(res.data.sessions) ? res.data.sessions : []);
      } catch (err) {
        console.error("Error loading sessions:", err);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Get all unique tags from sessions
  const allTags = [...new Set(sessions.flatMap(session => session.tags || []))];

  // Filter sessions based on search and selected tag
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (session.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = !selectedTag || (session.tags || []).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 font-montserrat">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/5 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-emerald-400/3 rounded-full animate-bounce" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-16 h-16 bg-emerald-600/5 rounded-full animate-ping" style={{ animationDuration: '5s' }}></div>
        <div className="absolute bottom-1/4 right-1/6 w-20 h-20 bg-emerald-300/4 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/6 right-1/2 w-12 h-12 bg-emerald-700/6 rounded-full animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
        
        {/* Gradient Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-l from-emerald-600/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/5 to-emerald-300/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-16 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          
          {/* Glassmorphism Hero Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-12 mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-emerald-600/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                Wellness <span className="text-emerald-400">Sessions</span>
              </h1>
              <p className="text-xl md:text-2xl text-emerald-200/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover transformative wellness experiences from our community of practitioners. 
                Find your path to mindfulness, healing, and inner peace.
              </p>
              
              {/* Search and Filter Section */}
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sessions, tags, or topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-emerald-200/60 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
                  />
                  <div className="absolute right-4 top-4 text-emerald-200/60">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Tag Filter */}
                {allTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => setSelectedTag("")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        !selectedTag 
                          ? "bg-emerald-500 text-white shadow-lg scale-105" 
                          : "bg-white/10 text-emerald-200 hover:bg-white/20"
                      }`}
                    >
                      All
                    </button>
                    {allTags.slice(0, 8).map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedTag === tag 
                            ? "bg-emerald-500 text-white shadow-lg scale-105" 
                            : "bg-white/10 text-emerald-200 hover:bg-white/20"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="relative z-10 px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          
          {loading ? (
            /* Premium Loading State */
            <div className="flex flex-col items-center py-20">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-emerald-400/30 rounded-full animate-spin"></div>
                <div className="absolute top-2 left-2 w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
              </div>
              <p className="text-emerald-200 text-lg mt-6 animate-pulse">Loading wellness sessions...</p>
            </div>
          ) : filteredSessions.length === 0 ? (
            /* Beautiful Empty State */
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-emerald-600/5 rounded-3xl"></div>
              
              <div className="relative z-10">
                {/* Animated Lotus Illustration */}
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 bg-emerald-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute inset-4 bg-emerald-600/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {searchTerm || selectedTag ? 'No matching sessions found' : 'No sessions available yet'}
                </h3>
                <p className="text-emerald-200/80 text-lg max-w-md mx-auto">
                  {searchTerm || selectedTag 
                    ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                    : 'Be the first to share your wellness journey with the community.'
                  }
                </p>
                
                {(searchTerm || selectedTag) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedTag("");
                    }}
                    className="mt-6 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Sessions Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSessions.map((session, index) => (
                <div
                  key={session._id}
                  className="group relative"
                  onMouseEnter={() => setHoveredSession(session._id)}
                  onMouseLeave={() => setHoveredSession(null)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Session Card */}
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-6 relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 group-hover:scale-105 group-hover:border-emerald-400/50">
                    
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-emerald-600/5 rounded-3xl transition-opacity duration-500 group-hover:from-emerald-400/10 group-hover:to-emerald-600/10"></div>
                    
                    {/* Hover Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </div>
                    
                    <div className="relative z-10">
                      {/* Session Header */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors duration-300">
                          {session.title}
                        </h3>
                        {session.createdAt && (
                          <p className="text-emerald-200/60 text-sm">
                            Created {formatDate(session.createdAt)}
                          </p>
                        )}
                      </div>

                      {/* Tags */}
                      {session.tags && session.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {session.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-colors duration-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {session.tags.length > 3 && (
                            <span className="px-3 py-1 bg-white/10 text-emerald-200/70 text-xs font-medium rounded-full">
                              +{session.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* JSON Link */}
                      {session.json_file_url && (
                        <div className="mt-6 pt-4 border-t border-white/10">
                          <a
                            href={session.json_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-sm font-medium rounded-xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 group-hover:scale-105"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Session Data
                          </a>
                        </div>
                      )}

                      {/* Floating Glow Orb */}
                      <div className={`absolute -top-2 -right-2 w-6 h-6 bg-emerald-400/30 rounded-full transition-all duration-500 ${
                        hoveredSession === session._id ? 'opacity-100 scale-150' : 'opacity-0 scale-100'
                      }`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action for Logged-in Users */}
          {!loading && sessions.length > 0 && (
            <div className="mt-16 text-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-emerald-500/25 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Join ARVYA.X & Share Your Journey
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .grid > div {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Sessions;
