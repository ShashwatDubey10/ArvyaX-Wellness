// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const getUserFromStorage = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored && stored !== "undefined" ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const Dashboard = () => {
  const user = getUserFromStorage();

  const [mySessions, setMySessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/my-sessions");
        setMySessions(res.data.sessions || []);
      } catch {
        setMySessions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const publishedCount = mySessions.filter((s) => s.status === "published").length;
  const draftCount = mySessions.filter((s) => s.status === "draft").length;

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-cyan-800 font-montserrat select-none text-white">
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-24 left-24 w-36 h-36 rounded-full bg-emerald-500/10 animate-pulse"></div>
        <div className="absolute bottom-40 right-32 w-28 h-28 rounded-full bg-emerald-400/20 animate-bounce" style={{ animationDuration: "3.5s" }}></div>
        <div className="absolute top-1/2 left-12 w-20 h-20 rounded-full bg-emerald-600/20 animate-ping" style={{ animationDuration: "5s" }}></div>
        <div className="absolute bottom-20 right-16 w-20 h-20 rounded-full bg-cyan-500/15 animate-pulse"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/30 to-transparent blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-cyan-400/30 to-transparent blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-16">
        <section className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-12">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-md">
                Welcome, <span className="text-emerald-400">Yogi</span>!
              </h1>
              <p className="mt-2 text-lg text-emerald-200/80 max-w-md">
                Your personal hub for creating, editing, and tracking wellness sessions. Let's elevate your journey.
              </p>
            </div>

            {user.email && (
              <p className="text-lg font-semibold max-w-xs truncate select-text text-white">
                {user.email}
              </p>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20 flex flex-col items-center">
              <p className="text-6xl font-bold text-emerald-400">{mySessions.length}</p>
              <p className="text-xl font-semibold mt-2">Total Sessions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20 flex flex-col items-center">
              <p className="text-6xl font-bold text-emerald-500">{publishedCount}</p>
              <p className="text-xl font-semibold mt-2">Published Sessions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/20 flex flex-col items-center">
              <p className="text-6xl font-bold text-amber-400">{draftCount}</p>
              <p className="text-xl font-semibold mt-2">Draft Sessions</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-center md:justify-start mb-14">
            <Link
              to="/my-sessions/new"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-700 rounded-3xl shadow-lg text-white font-semibold transition-transform duration-300 hover:scale-105 cursor-pointer overflow-hidden select-none"
              aria-label="Create New Session"
            >
              <svg
                viewBox="0 0 24 24"
                width={20}
                height={20}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 stroke-white stroke-[1.5px]"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M15 12L12 12" strokeLinecap="round" />
                <path d="M12 12L9 12" strokeLinecap="round" />
                <path d="M12 12L12 9" strokeLinecap="round" />
                <path d="M12 12L12 15" strokeLinecap="round" />
                <path
                  d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                  strokeLinecap="round"
                />
              </svg>
              New Session
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white-50 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>

            <Link
              to="/sessions"
              className="inline-flex items-center gap-3 bg-white/20 text-emerald-400 hover:text-emerald-300 font-semibold py-4 px-8 rounded-3xl shadow-inner cursor-pointer select-none transition-colors duration-300"
              aria-label="Browse All Sessions"
            >
              <span className="flex items-center justify-center w-7 h-7">
                <svg
                  version="1.1"
                  id="Uploaded to svgrepo.com"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32"
                  xmlSpace="preserve"
                  width={22}
                  height={22}
                  style={{ display: "block" }}
                >
                  <style type="text/css">{".stone_een{fill:#10b981;}"}</style>
                  <path
                    className="stone_een"
                    d="M13,21.5c0,3.038-2.462,5.5-5.5,5.5S2,24.538,2,21.5S4.462,16,7.5,16S13,18.462,13,21.5z M24.5,16 
                    c-3.038,0-5.5,2.462-5.5,5.5s2.462,5.5,5.5,5.5s5.5-2.462,5.5-5.5S27.538,16,24.5,16z M32,21.5c0,4.142-3.358,7.5-7.5,7.5 
                    c-3.441,0-6.333-2.32-7.216-5.478C16.935,23.816,16.491,24,16,24s-0.935-0.184-1.284-0.478C13.833,26.68,10.941,29,7.5,29 
                    C3.358,29,0,25.642,0,21.5c0-1.195,0.287-2.321,0.784-3.323l3.515-8.453c0.468-1.372,1.464-2.496,2.743-3.139 
                    C7.246,5.126,8.485,4,10,4c1.657,0,3,1.343,3,3c0,0.082-0.017,0.159-0.024,0.239C14.211,8.248,15,9.781,15,11.5 
                    c0,0.225,0,0.491,0,0.777C15.295,12.106,15.634,12,16,12s0.705,0.106,1,0.277c0-0.286,0-0.552,0-0.777 
                    c0-1.742,0.812-3.292,2.076-4.3c-0.008-0.066-0.02-0.132-0.02-0.2c0-1.657,1.343-3,3-3c1.523,0,2.768,1.139,2.961,2.61 
                    c1.252,0.647,2.223,1.762,2.685,3.114l3.515,8.453C31.713,19.179,32,20.305,32,21.5z M14,21.5c0-3.59-2.91-6.5-6.5-6.5 
                    S1,17.91,1,21.5S3.91,28,7.5,28S14,25.09,14,21.5z M17,22c0-0.552-0.448-1-1-1s-1,0.448-1,1c0,0.552,0.448,1,1,1S17,22.552,17,22z 
                    M31,21.5c0-3.59-2.91-6.5-6.5-6.5S18,17.91,18,21.5s2.91,6.5,6.5,6.5S31,25.09,31,21.5z"
                  />
                </svg>
              </span>
              <span className="ml-1">Explore</span>
            </Link>
          </div>

          <section>
            <h2 className="text-4xl font-extrabold mb-8 drop-shadow-md tracking-wide">Recent Sessions</h2>
            {loading ? (
              <div className="flex flex-col items-center space-y-6 py-20 text-emerald-200 animate-pulse">
                <svg
                  className="w-14 h-14"
                  viewBox="0 0 140 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse cx="70" cy="110" rx="47" ry="10" fill="#2ecc71" />
                  <rect x="35" y="35" width="70" height="50" rx="12" fill="#27ae60" />
                </svg>
                <p className="text-xl">Loading your sessions...</p>
              </div>
            ) : mySessions.length === 0 ? (
              <div className="text-center py-20 text-white">
                <p className="text-xl max-w-xl mx-auto">
                  You haven't created any sessions yet. Click "New Session" to start your wellness journey.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {mySessions.slice(0, 6).map((session) => (
                  <Link
                    key={session._id}
                    to={`/my-sessions/${session._id}`}
                    className="group relative bg-white/15 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/30 transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col cursor-pointer"
                  >
                    <div className="mb-3 flex justify-between items-center">
                      <h3 className="text-xl font-semibold drop-shadow-md truncate group-hover:text-emerald-300">
                        {session.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          session.status === "published"
                            ? "bg-emerald-700 text-emerald-300"
                            : "bg-amber-700 text-amber-300"
                        }`}
                      >
                        {session.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-emerald-200 truncate mb-4">
                      {session.tags?.join(", ") || "No tags"}
                    </p>
                    <div className="mt-auto flex justify-between items-center text-xs text-emerald-400">
                      <span>{formatDate(session.updatedAt)}</span>
                      {session.json_file_url && (
                        <a
                          href={session.json_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-emerald-300 hover:text-emerald-100 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View JSON
                        </a>
                      )}
                    </div>
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-80 transition-opacity"></span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
